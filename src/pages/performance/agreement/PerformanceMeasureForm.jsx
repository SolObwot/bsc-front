import React, { useState, forwardRef, useImperativeHandle } from 'react';
import StrategicObjectiveModal from '../../../components/balancescorecard/modals/StrategicObjectiveModal';
import PerformanceIndicatorModal from '../../../components/balancescorecard/modals/PerformanceIndicatorModal';
import AppraisalModal from '../../../components/balancescorecard/modals/AppraisalModal';
import AppraisalApprovalModal from '../../../components/balancescorecard/modals/AppraisalApprovalModal';

const PerformanceMeasureForm = forwardRef(({ objectives, isQualitative, onDataChange }, ref) => {
  // Modal statessd
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

  const handleSaveIndicator = (formData) => {
    const updatedObjectives = [...objectives];
    
    if (isEditing && editingIndicator) {
      // Update existing indicator
      for (const objective of updatedObjectives) {
        for (const subObj of objective.subObjectives) {
          const indicatorIndex = subObj.indicators.findIndex(ind => ind.id === formData.id);
          if (indicatorIndex !== -1) {
            // Update the indicator
            subObj.indicators[indicatorIndex] = { ...subObj.indicators[indicatorIndex], ...formData };
            // Notify the parent component about the change
            onDataChange(updatedObjectives);
            break;
          }
        }
      }
    } else if (selectedStrategicObjective) {
      // Add new indicator
      for (const objective of updatedObjectives) {
        const subObjIndex = objective.subObjectives.findIndex(
          subObj => subObj.id === selectedStrategicObjective.id
        );
        
        if (subObjIndex !== -1) {
          // Generate a new ID (in a real app, this would be handled by the backend)
          const newId = Math.max(
            ...objective.subObjectives[subObjIndex].indicators.map(ind => ind.id), 
            0
          ) + 1;
          
          // Add the new indicator
          objective.subObjectives[subObjIndex].indicators.push({
            ...formData,
            id: newId
          });
          
          // Notify the parent component about the change
          onDataChange(updatedObjectives);
          break;
        }
      }
    }
    
    // Reset modal state
    setIsIndicatorModalOpen(false);
    setIsEditing(false);
    setEditingIndicator(null);
  };

  const handleIndicatorEdit = (indicator, index, indicators) => {
    let parentObjective = null;
    for (const objective of objectives) {
      for (const subObj of objective.subObjectives) {
        if (subObj.indicators.some(ind => ind.id === indicator.id)) {
          parentObjective = subObj;
          break;
        }
      }
      if (parentObjective) break;
    }
    
    if (parentObjective) {
      handleIndicatorModalOpen(selectedObjective, parentObjective, indicator, true);
    } else {
      console.error('Could not find parent objective for indicator:', indicator);
    }
  };
  
  const handleDeleteIndicator = () => {
    if (!selectedIndicator) return;
    
    const updatedObjectives = [...objectives];
    
    // Find and remove the indicator
    for (const objective of updatedObjectives) {
      for (const subObj of objective.subObjectives) {
        const indicatorIndex = subObj.indicators.findIndex(ind => ind.id === selectedIndicator.id);
        if (indicatorIndex !== -1) {
          // Remove the indicator
          subObj.indicators.splice(indicatorIndex, 1);
          // Notify the parent component about the change
          onDataChange(updatedObjectives);
          break;
        }
      }
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
      />
    </>
  );
});
export default PerformanceMeasureForm;
