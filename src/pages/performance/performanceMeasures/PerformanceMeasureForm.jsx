import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPerformanceMeasure, deletePerformanceMeasure } from '../../../redux/performanceMeasureSlice';
import StrategicObjectiveModal from '../../../components/balancescorecard/modals/StrategicObjectiveModal';
import PerformanceIndicatorModal from '../../../components/balancescorecard/modals/PerformanceIndicatorModal';
import AppraisalModal from '../../../components/balancescorecard/modals/AppraisalModal';
import AppraisalApprovalModal from '../../../components/balancescorecard/modals/AppraisalApprovalModal';
import { useToast } from '../../../hooks/useToast';

const PerformanceMeasureForm = forwardRef(({ objectives, isQualitative, onDataChange, agreementId }, ref) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // Get loading and error states from Redux
  const { 
    loading: { create: isCreating, delete: isDeleting },
    error: { create: createError, delete: deleteError }
  } = useSelector((state) => state.performanceMeasure);
  
  // Modal states
  const [isStrategicModalOpen, setIsStrategicModalOpen] = useState(false);
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);
  const [isAppraisalModalOpen, setIsAppraisalModalOpen] = useState(false);
  const [isAppraisalApprovalModalOpen, setIsAppraisalApprovalModalOpen] = useState(false);
  
  // Selected items for modals
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [selectedStrategicObjective, setSelectedStrategicObjective] = useState(null);
  const [currentIndicatorIndex, setCurrentIndicatorIndex] = useState(0);
  const [approvalModalCurrentIndex, setApprovalModalCurrentIndex] = useState(0);
  const [currentIndicators, setCurrentIndicators] = useState([]);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState(null);
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    handleStrategicModalOpen,
    handleIndicatorModalOpen,
    handleAppraisalModalOpen,
    handleApprovalModalOpen,
    handleActionSelect,
    handleIndicatorEdit
  }));
  
  // Event handlers
  const handleStrategicModalOpen = (objective) => {
    setSelectedObjective(objective);
    setIsStrategicModalOpen(true);
  };

  const handleIndicatorModalOpen = (objective, strategicObjective, indicator = null, isEdit = false) => {
    setSelectedObjective(objective);
    setSelectedStrategicObjective(strategicObjective);
    setIsEditing(isEdit);
    setEditingIndicator(indicator);
    setIsIndicatorModalOpen(true);
  };

  const handleAppraisalModalOpen = (indicator, index, indicators) => {
    setSelectedIndicator(indicator);
    setCurrentIndicatorIndex(index);
    setCurrentIndicators(indicators);
    setIsAppraisalModalOpen(true);
  };

  const handleApprovalModalOpen = (indicator, index, indicators) => {
    setSelectedIndicator(indicator);
    setApprovalModalCurrentIndex(index);
    setCurrentIndicators(indicators);
    setIsAppraisalApprovalModalOpen(true);
  };

  const handleIndicatorNavigation = (direction) => {
    if (direction === 'next' && currentIndicatorIndex < currentIndicators.length - 1) {
      setCurrentIndicatorIndex(prev => prev + 1);
      setSelectedIndicator(currentIndicators[currentIndicatorIndex + 1]);
    } else if (direction === 'prev' && currentIndicatorIndex > 0) {
      setCurrentIndicatorIndex(prev => prev - 1);
      setSelectedIndicator(currentIndicators[currentIndicatorIndex - 1]);
    }
  };

  const handleApprovalModalNavigation = (direction) => {
    if (direction === 'next' && approvalModalCurrentIndex < currentIndicators.length - 1) {
      setApprovalModalCurrentIndex(prev => prev + 1);
      setSelectedIndicator(currentIndicators[approvalModalCurrentIndex + 1]);
    } else if (direction === 'prev' && approvalModalCurrentIndex > 0) {
      setApprovalModalCurrentIndex(prev => prev - 1);
      setSelectedIndicator(currentIndicators[approvalModalCurrentIndex - 1]);
    }
  };

  const handleActionSelect = (action, objective) => {
    if (action.name === 'Delete') {
      setSelectedIndicator(objective);
      setIsAppraisalApprovalModalOpen(true);
    }
  };

  const handleSaveIndicator = async (formData) => {
    // For API integration
    const apiData = {
      name: formData.name,
      strategic_objective_id: selectedStrategicObjective.id,
      department_perspective_id: selectedObjective.id,
      target_value: formData.targetValue,
      measurement_type: formData.measurementType,
      agreement_id: agreementId,
      weight: parseFloat(formData.weight || "0"),
      description: formData.description || ""
    };

    if (isEditing && editingIndicator) {
      // Handle update logic here
      // For now, update local state
      const updatedObjectives = [...objectives];
      
      for (const objective of updatedObjectives) {
        for (const subObj of objective.subObjectives) {
          const indicatorIndex = subObj.indicators.findIndex(ind => ind.id === editingIndicator.id);
          if (indicatorIndex !== -1) {
            // Update the indicator with new values but keep the original ID
            subObj.indicators[indicatorIndex] = { 
              ...formData,
              id: editingIndicator.id
            };
            // Notify the parent component about the change
            onDataChange(updatedObjectives);
            
            // Show success message
            toast({
              title: "Success",
              description: "Performance measure updated successfully",
            });
            
            break;
          }
        }
      }
      
      // Close modal and reset editing state
      setIsIndicatorModalOpen(false);
      setIsEditing(false);
      setEditingIndicator(null);
    } else if (selectedStrategicObjective) {
      try {
        // Create new performance measure via API
        const result = await dispatch(createPerformanceMeasure(apiData)).unwrap();
        
        // Handle successful creation
        toast({
          title: "Success",
          description: "Performance measure created successfully",
        });
        
        // Add to local state
        const updatedObjectives = [...objectives];
        for (const objective of updatedObjectives) {
          if (objective.id === selectedObjective.id) {
            const subObjIndex = objective.subObjectives.findIndex(
              subObj => subObj.id === selectedStrategicObjective.id
            );
            
            if (subObjIndex !== -1) {
              // Add the new indicator with the API response data
              objective.subObjectives[subObjIndex].indicators.push({
                id: result.id,
                name: result.name,
                targetValue: result.target_value,
                measurementType: result.measurement_type,
                weight: formData.weight || "0%",
                description: formData.description || ""
              });
              
              // Notify the parent component about the change
              onDataChange(updatedObjectives);
              break;
            }
          }
        }
        
        // Close modal
        setIsIndicatorModalOpen(false);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to create performance measure",
          variant: "destructive",
        });
      }
    }
  };

  const handleIndicatorEdit = (indicator, index, indicators) => {
    // Find the parent objective and strategic objective for this indicator
    let parentObjective = null;
    let mainObjective = null;
    
    for (const objective of objectives) {
      for (const subObj of objective.subObjectives) {
        if (subObj.indicators.some(ind => ind.id === indicator.id)) {
          parentObjective = subObj;
          mainObjective = objective;
          break;
        }
      }
      if (parentObjective) break;
    }
    
    if (parentObjective && mainObjective) {
      handleIndicatorModalOpen(mainObjective, parentObjective, indicator, true);
    } else {
      console.error('Could not find parent objective for indicator:', indicator);
    }
  };
  
  const handleDeleteIndicator = async () => {
    if (!selectedIndicator || !selectedIndicator.id) {
      toast({
        title: "Error",
        description: "No indicator selected for deletion",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Delete via API
      await dispatch(deletePerformanceMeasure(selectedIndicator.id)).unwrap();
      
      // Update local state
      const updatedObjectives = [...objectives];
      let indicatorRemoved = false;
      
      for (const objective of updatedObjectives) {
        for (const subObj of objective.subObjectives) {
          const indicatorIndex = subObj.indicators.findIndex(ind => ind.id === selectedIndicator.id);
          if (indicatorIndex !== -1) {
            // Remove the indicator
            subObj.indicators.splice(indicatorIndex, 1);
            indicatorRemoved = true;
            break;
          }
        }
        if (indicatorRemoved) break;
      }
      
      // Notify the parent component about the change
      if (indicatorRemoved) {
        onDataChange(updatedObjectives);
        toast({
          title: "Success",
          description: "Performance measure deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete performance measure",
        variant: "destructive",
      });
    }
    
    // Close the modal and reset state
    setIsAppraisalApprovalModalOpen(false);
    setSelectedIndicator(null);
    setApprovalModalCurrentIndex(0);
  };

  return (
    <>
      <StrategicObjectiveModal 
        isOpen={isStrategicModalOpen}
        closeModal={() => setIsStrategicModalOpen(false)}
      />
      
      <PerformanceIndicatorModal
        isOpen={isIndicatorModalOpen}
        closeModal={() => {
          setIsIndicatorModalOpen(false);
          setIsEditing(false);
          setEditingIndicator(null);
        }}
        strategicObjective={selectedStrategicObjective}
        isEditing={isEditing}
        editData={editingIndicator}
        onSave={handleSaveIndicator}
        isLoading={isCreating}
      />

      <AppraisalModal 
        isOpen={isAppraisalModalOpen}
        closeModal={() => setIsAppraisalModalOpen(false)}
        indicator={selectedIndicator}
        onNavigate={handleIndicatorNavigation}
        hasNext={currentIndicatorIndex < currentIndicators.length - 1}
        hasPrevious={currentIndicatorIndex > 0}
        totalCount={currentIndicators?.length || 0}
        currentIndex={currentIndicatorIndex}
      />

      <AppraisalApprovalModal 
        isOpen={isAppraisalApprovalModalOpen}
        closeModal={() => setIsAppraisalApprovalModalOpen(false)}
        indicator={selectedIndicator}
        onNavigate={handleApprovalModalNavigation}
        hasNext={approvalModalCurrentIndex < currentIndicators.length - 1}
        hasPrevious={approvalModalCurrentIndex > 0}
        totalCount={currentIndicators?.length || 0}
        currentIndex={approvalModalCurrentIndex}
        onApprove={handleDeleteIndicator}
        onReject={() => {
          setIsAppraisalApprovalModalOpen(false);
          setSelectedIndicator(null);
          setApprovalModalCurrentIndex(0);
        }}
        isLoading={isDeleting}
        modalType="delete"
        title="Delete Performance Measure"
        message="Are you sure you want to delete this performance measure? This action cannot be undone."
      />
    </>
  );
});

export default PerformanceMeasureForm;