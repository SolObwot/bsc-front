import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchDepartmentObjectives, 
  fetchAllDashboardPerformanceMeasures 
} from '../../../redux/performanceMeasureSlice';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import ObjectiveTabs from '../../../components/balancescorecard/Tabs';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import InfoBanner from '../../../components/balancescorecard/InfoBanner';
import ObjectiveListHeader from '../../../components/balancescorecard/ListHeader';
import ObjectiveItem from '../../../components/balancescorecard/Item';
import PerformanceMeasureForm from './PerformanceMeasureForm';
import { useToast } from '../../../hooks/useToast';
import Button from '../../../components/ui/Button';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';


const AddPerformanceMeasure = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { id: agreementId } = useParams(); // Get agreement ID from URL
  const [activeTab, setActiveTab] = useState('active');
  const [savingMeasures, setSavingMeasures] = useState(false);
  const [fetchingMeasures, setFetchingMeasures] = useState(false);
  
  // Get data from Redux store
  const { 
    department,
    perspectives,
    loading: { department: isLoading, allDashboardMeasures: isDashboardLoading },
    error: { department: error, allDashboardMeasures: dashboardError }
  } = useSelector((state) => state.performanceMeasure);

  // Get the authenticated user from Redux store
  const { user } = useAuth();
        
  // Local state for transformed objectives
  const [objectives, setObjectives] = useState({
    quantitative: [],
    qualitative: []
  });
  
  // Local state for dashboard performance measures
  const [dashboardMeasures, setDashboardMeasures] = useState([]);
  
  // Form handlers
  const formRef = useRef();

  // Fetch department objectives when component mounts
  useEffect(() => {
    dispatch(fetchDepartmentObjectives())
      .unwrap()
      .then(() => {
        // Successfully loaded department objectives
      })
      .catch(error => {
        toast({
          title: "Error",
          description: "Failed to load department objectives. Please try again.",
          variant: "destructive",
        });
      });
  }, [dispatch]);
  
  // Fetch dashboard performance measures when component mounts
  useEffect(() => {
    setFetchingMeasures(true);
    dispatch(fetchAllDashboardPerformanceMeasures({ agreement_id: agreementId }))
      .unwrap()
      .then((measures) => {
        setDashboardMeasures(measures);
      })
      .catch(error => {
        toast({
          title: "Error",
          description: "Failed to load dashboard performance measures. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setFetchingMeasures(false);
      });
  }, [dispatch, agreementId]);

  // Transform API data to component format
  useEffect(() => {
    if (department && perspectives) {
      const quantitativePerspectives = perspectives.filter(p => p.type === 'quantitative');
      const qualitativePerspectives = perspectives.filter(p => p.type === 'qualitative');
      
      const transformPerspectiveToObjective = (perspective) => {
        // Get objectives for this perspective
        const perspectiveObjectives = perspective.objectives || {};

        // Convert object to array if needed
        const objectivesArray = Array.isArray(perspectiveObjectives) 
          ? perspectiveObjectives 
          : Object.values(perspectiveObjectives);
        
        // Ensure we have an array even if objectives is null/undefined
        const safeObjectivesArray = objectivesArray.length > 0 ? objectivesArray : [{
          id: `default-${perspective.id}`,
          name: "General Objectives",
          weight: perspective.weight
        }];
        
        // Transform to the format expected by the component
        return {
          id: perspective.id,
          title: perspective.name,
          totalWeight: `${perspective.weight}%`,
          progress: 0,
          dueDate: '31 Dec, 2024',
          assignee: {
            name: `${user?.surname || ''} ${user?.last_name || ''}`.trim() || 'Current User',
            surname: user?.surname || '',
            lastName: user?.last_name || '',
            avatar: user?.profile_photo_url || '/placeholder.svg',
          },
          lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          keyResults: safeObjectivesArray.length,
          status: 'In Progress',
          comments: 0,
          // Important: Store the department_perspective_id for API integration
          department_perspective_id: perspective.id,
          subObjectives: safeObjectivesArray.map(obj => ({
            id: obj.id,
            name: obj.name,
            weight: `${Math.round((perspective.weight / safeObjectivesArray.length) * 10) / 10}%`,
            // Store the department_objective_id for API integration
            department_objective_id: obj.department_objective_id || obj.id,
            // Create empty indicators array that will be filled when measures are added
            indicators: []
          }))
        };
      };
      
      setObjectives({
        quantitative: quantitativePerspectives.map(transformPerspectiveToObjective),
        qualitative: qualitativePerspectives.map(transformPerspectiveToObjective)
      });
    }
  }, [department, perspectives]);

  // Populate dashboard performance measures to appropriate strategic objectives
  useEffect(() => {
    if (dashboardMeasures.length > 0 && objectives.quantitative.length > 0) {
      // Deep clone the objectives to avoid direct state mutation
      const updatedQuantitativeObjectives = JSON.parse(JSON.stringify(objectives.quantitative));
      const updatedQualitativeObjectives = JSON.parse(JSON.stringify(objectives.qualitative));
      
      // For each dashboard measure, find the corresponding strategic objective and add it as an indicator
      dashboardMeasures.forEach(measure => {
        // First check if this is a quantitative or qualitative measure
        // Typically this would be determined by the perspective type
        let targetObjectives = updatedQuantitativeObjectives;
        
        // If you need to determine whether a measure is qualitative, add logic here
        // For example, based on measure.department_objective.strategy_perspective_id
        
        // Find the correct main objective (perspective)
        let perspectiveFound = false;
        
        for (const objective of targetObjectives) {
          // Find the corresponding strategic objective using department_objective from the measure
          if (measure.department_objective && 
              objective.department_perspective_id === measure.department_objective.strategy_perspective_id) {
            
            // Find the strategic objective that matches the measure's strategic_objective_id
            const subObjIndex = objective.subObjectives.findIndex(
              subObj => subObj.id === measure.strategic_objective_id
            );
            
            if (subObjIndex !== -1) {
              // Check if indicator already exists (avoid duplicates)
              const existingIndicator = objective.subObjectives[subObjIndex].indicators.find(
                ind => ind.id === measure.id
              );
              
              if (!existingIndicator) {
                // Add the measure as an indicator
                objective.subObjectives[subObjIndex].indicators.push({
                  id: measure.id,
                  name: measure.name,
                  targetValue: measure.target_value,
                  measurementType: measure.measurement_type,
                  weight: `${measure.net_weight}%`,
                  description: measure.description || ""
                });
              }
              
              perspectiveFound = true;
              break;
            }
          }
        }
        
        // If not found in quantitative, check qualitative (if needed)
        if (!perspectiveFound && measure.department_objective) {
          // Similar logic for qualitative objectives
          // ...
        }
      });
      
      // Update state with populated indicators
      setObjectives({
        quantitative: updatedQuantitativeObjectives,
        qualitative: updatedQualitativeObjectives
      });
    }
  }, [dashboardMeasures, objectives.quantitative.length, objectives.qualitative.length]);

  // Helper function to get the current form handlers
  const getFormHandlers = () => {
    return formRef.current ? {
      handleStrategicModalOpen: (objective) => 
        formRef.current.handleStrategicModalOpen(objective),
      
      handleIndicatorModalOpen: (objective, strategicObjective, indicator, isEdit) => 
        formRef.current.handleIndicatorModalOpen(objective, strategicObjective, indicator, isEdit),
      
      handleAppraisalModalOpen: (indicator, index, indicators) => 
        formRef.current.handleAppraisalModalOpen(indicator, index, indicators),
      
      handleApprovalModalOpen: (indicator, index, indicators) => 
        formRef.current.handleApprovalModalOpen(indicator, index, indicators),
      
      handleActionSelect: (action, objective) => 
        formRef.current.handleActionSelect(action, objective),
      
      handleIndicatorEdit: (indicator, index, indicators) => 
        formRef.current.handleIndicatorEdit(indicator, index, indicators)
    } : {};
  };

  // Handle data changes from PerformanceMeasureForm
  const handleDataChange = (newObjectives) => {
    if (activeTab === 'active') {
      setObjectives(prev => ({
        ...prev,
        quantitative: newObjectives
      }));
    } else {
      setObjectives(prev => ({
        ...prev,
        qualitative: newObjectives
      }));
    }
  };

  const handleIndicatorEdit = (indicator, index, indicators) => {
    if (formRef.current && formRef.current.handleIndicatorEdit) {
      const parentObjective = findParentObjective(indicator);
      if (parentObjective) {
        formRef.current.handleIndicatorModalOpen(
          findMainObjective(indicator), 
          parentObjective, 
          indicator, 
          true
        );
      } else {
        console.error('Could not find parent objective for indicator:', indicator);
      }
    }
  };

  // Helper function to find the parent strategic objective for an indicator
  const findParentObjective = (indicator) => {
    for (const objective of displayedObjectives) {
      for (const subObj of objective.subObjectives) {
        if (subObj.indicators.some(ind => ind.id === indicator.id)) {
          return subObj;
        }
      }
    }
    return null;
  };

  // Helper function to find the main objective
  const findMainObjective = (indicator) => {
    for (const objective of displayedObjectives) {
      for (const subObj of objective.subObjectives) {
        if (subObj.indicators.some(ind => ind.id === indicator.id)) {
          return objective;
        }
      }
    }
    return null;
  };

  // Get current objectives based on active tab
  const displayedObjectives = activeTab === 'active' 
    ? objectives.quantitative 
    : (activeTab === 'draft' ? objectives.qualitative : []);
    
  // Handle saving all performance measures
  const handleSaveAllMeasures = async () => {
    try {
      setSavingMeasures(true);
      
      // All saved measures are tracked in the PerformanceMeasureForm component
      // Check if there are any measures to save
      const allIndicators = displayedObjectives.flatMap(objective => 
        objective.subObjectives.flatMap(subObj => subObj.indicators)
      );
      
      if (allIndicators.length === 0) {
        toast({
          title: "No measures to save",
          description: "Please add at least one performance measure before saving.",
          variant: "destructive",
        });
        setSavingMeasures(false);
        return;
      }
      
      // Notify that all measures have been saved
      toast({
        title: "Success",
        description: "All performance measures have been saved successfully.",
      });
      
      // Navigate back to the agreement
      navigate(`/performance/agreements/${agreementId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save performance measures",
        variant: "destructive",
      });
    } finally {
      setSavingMeasures(false);
    }
  };

  // Store handlers reference
  const handlers = getFormHandlers();

  // Show loading state
  if (isLoading || fetchingMeasures) {
    return (
      <div className="min-h-screen bg-gray-100 shadow-md rounded-lg">
        <ObjectiveHeader />
        <div className="flex justify-between">
          <ObjectiveTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <OverallProgress progress={0} riskStatus={false} />
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-500">
            {isLoading ? 'Loading department objectives...' : 'Loading performance measures...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between">
        <ObjectiveTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <OverallProgress progress={25} riskStatus={true} />
      </div>
      <InfoBanner />
      <ObjectiveListHeader activeTab={activeTab} />
      
      <div className="px-4 py-2">
        {displayedObjectives.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg shadow-sm">
            <p className="text-gray-500">No {activeTab === 'active' ? 'quantitative' : 'qualitative'} objectives found.</p>
          </div>
        ) : (
          displayedObjectives.map((objective, index) => (
            <ObjectiveItem 
              key={index} 
              objective={objective}
              subObjectives={objective.subObjectives || []}
              
              showAddStrategicButton={false}
              showAddKPIButton={true}
              addKPIButtonLabel="Add Performance Indicator"
              showTargetValue={true}
              
              displayMode={activeTab === 'active' ? 'standard' : 'direct-indicators'}
              isQualitative={activeTab !== 'active'}
              
              onAddKPIClick={(strategicObjective) => 
                handlers.handleIndicatorModalOpen && handlers.handleIndicatorModalOpen(objective, strategicObjective)
              }
              onActionSelect={(action) => 
                handlers.handleActionSelect && handlers.handleActionSelect(action, objective)
              }
              onIndicatorClick={(indicator, index, indicators) => 
                handlers.handleAppraisalModalOpen && handlers.handleAppraisalModalOpen(indicator, index, indicators || [])
              }
              onIndicatorEdit={handleIndicatorEdit}
              onIndicatorDelete={(indicator, index, indicators) => 
                handlers.handleApprovalModalOpen && handlers.handleApprovalModalOpen(indicator, index, indicators || [])
              }
              onStrategicObjectiveEdit={(objective) => 
                handlers.handleApprovalModalOpen && handlers.handleApprovalModalOpen(objective, 0, [])
              }
              
              renderStrategicModal={false}
              renderIndicatorModal={false}
              renderAppraisalModal={false}
              renderAppraisalApprovalModal={false}
            />
          ))
        )}
      </div>

      {/* Save button */}
      <div className="flex justify-end px-4 py-4">
        <Button
          variant="pride"
          onClick={handleSaveAllMeasures}
          disabled={savingMeasures}
          className="flex items-center gap-2"
        >
          <CheckCircleIcon className="h-5 w-5" />
          {savingMeasures ? 'Saving...' : 'Save All Measures & Return'}
        </Button>
      </div>

      {/* Use PerformanceMeasureForm for modal handling and data management */}
      <PerformanceMeasureForm
        objectives={displayedObjectives}
        isQualitative={activeTab !== 'active'}
        onDataChange={handleDataChange}
        agreementId={agreementId}
        ref={formRef}
      />
    </div>
  );
};

export default AddPerformanceMeasure;