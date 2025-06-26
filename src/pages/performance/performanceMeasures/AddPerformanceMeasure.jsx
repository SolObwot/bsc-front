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
import DeletePerformanceMeasure from './DeletePerformanceMeasure';
import { useToast } from '../../../hooks/useToast';
import Button from '../../../components/ui/Button';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../hooks/useAuth';

const AddPerformanceMeasure = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { id: agreementId } = useParams();
  const [activeTab, setActiveTab] = useState('active');
  const [savingMeasures, setSavingMeasures] = useState(false);
  const [fetchingMeasures, setFetchingMeasures] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPerformanceMeasure, setSelectedPerformanceMeasure] = useState(null);
  
  const { 
    department,
    perspectives,
    loading: { department: isLoading, allDashboardMeasures: isDashboardLoading },
    error: { department: error, allDashboardMeasures: dashboardError }
  } = useSelector((state) => state.performanceMeasure);

  const { user } = useAuth();
        
  const [objectives, setObjectives] = useState({
    quantitative: [],
    qualitative: []
  });
  
  const [dashboardMeasures, setDashboardMeasures] = useState([]);
  
  const formRef = useRef();

  useEffect(() => {}, [selectedPerformanceMeasure]);

  useEffect(() => {
    dispatch(fetchDepartmentObjectives())
      .unwrap()
      .then(() => {})
      .catch(error => {
        toast({
          title: "Error",
          description: "Failed to load department objectives. Please try again.",
          variant: "destructive",
        });
      });
  }, [dispatch]);
  
  useEffect(() => {
    setFetchingMeasures(true);
    dispatch(fetchAllDashboardPerformanceMeasures({ agreement_id: agreementId }))
      .unwrap()
      .then((measures) => {
          setDashboardMeasures(measures);
      })
      .catch((error) => {
          toast({
              title: "Error",
              description: error.message || "Failed to load dashboard performance measures. Please try again.",
              variant: "destructive",
          });
      })
      .finally(() => {
          setFetchingMeasures(false);
      });
  }, [dispatch, agreementId]);

  useEffect(() => {
    if (department && perspectives) {
      const quantitativePerspectives = perspectives.filter(p => p.type === 'quantitative');
      const qualitativePerspectives = perspectives.filter(p => p.type === 'qualitative');
      
      const transformPerspectiveToObjective = (perspective) => {
        const perspectiveObjectives = perspective.objectives || {};
        const objectivesArray = Array.isArray(perspectiveObjectives) 
          ? perspectiveObjectives 
          : Object.values(perspectiveObjectives);
        const safeObjectivesArray = objectivesArray.length > 0 ? objectivesArray : [{
          id: `default-${perspective.id}`,
          name: "General Objectives",
          weight: perspective.weight
        }];
        
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
          department_perspective_id: perspective.id,
          subObjectives: safeObjectivesArray.map(obj => ({
            id: obj.id,
            name: obj.name,
            weight: `${Math.round((perspective.weight / safeObjectivesArray.length) * 10) / 10}%`,
            department_objective_id: obj.department_objective_id || obj.id,
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

  useEffect(() => {
    if (dashboardMeasures.length > 0 && objectives.quantitative.length > 0) {
      const updatedQuantitativeObjectives = JSON.parse(JSON.stringify(objectives.quantitative));
      const updatedQualitativeObjectives = JSON.parse(JSON.stringify(objectives.qualitative));
      
      dashboardMeasures.forEach(measure => {
        let targetObjectives = updatedQuantitativeObjectives;
        let perspectiveFound = false;
        
        for (const objective of targetObjectives) {
          if (measure.department_objective && 
              objective.department_perspective_id === measure.department_objective.strategy_perspective_id) {
            
            const subObjIndex = objective.subObjectives.findIndex(
              subObj => subObj.id === measure.strategic_objective_id
            );
            
            if (subObjIndex !== -1) {
              const existingIndicator = objective.subObjectives[subObjIndex].indicators.find(
                ind => ind.id === measure.id
              );
              
              if (!existingIndicator) {
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
        
        if (!perspectiveFound && measure.department_objective) {}
      });
      
      setObjectives({
        quantitative: updatedQuantitativeObjectives,
        qualitative: updatedQualitativeObjectives
      });
    }
  }, [dashboardMeasures, objectives.quantitative.length, objectives.qualitative.length]);

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

  const handleDataChange = (newObjectives) => {
    if (activeTab === 'active') {
      setObjectives((prev) => ({
        ...prev,
        quantitative: Array.isArray(newObjectives) ? newObjectives : [],
      }));
    } else {
      setObjectives((prev) => ({
        ...prev,
        qualitative: Array.isArray(newObjectives) ? newObjectives : [],
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
      } else {}
    }
  };

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

  const displayedObjectives = activeTab === 'active' 
  ? objectives.quantitative || [] 
  : (activeTab === 'draft' ? objectives.qualitative || [] : []);
  
  const handleSaveAllMeasures = async () => {
    try {
      setSavingMeasures(true);
      
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
      
      toast({
        title: "Success",
        description: "All performance measures have been saved successfully.",
      });
      
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

  const handleDeleteClick = (performanceMeasure) => {
    setSelectedPerformanceMeasure(performanceMeasure);
    setIsDeleteModalOpen(true);
  };

  const handlers = getFormHandlers();

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
              onIndicatorDelete={(indicator) => handleDeleteClick(indicator)}
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

      <PerformanceMeasureForm
        objectives={displayedObjectives}
        isQualitative={activeTab !== 'active'}
        onDataChange={handleDataChange}
        agreementId={agreementId}
        ref={formRef}
      />

      {isDeleteModalOpen && selectedPerformanceMeasure && (
      <DeletePerformanceMeasure
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        performanceMeasureId={selectedPerformanceMeasure.id}
        prevObjectives={activeTab === 'active' ? objectives.quantitative : objectives.qualitative}
        onDataChange={(updatedObjectives) => {
          handleDataChange(updatedObjectives);
        }}
      />
    )}
    </div>
  );
};

export default AddPerformanceMeasure;
