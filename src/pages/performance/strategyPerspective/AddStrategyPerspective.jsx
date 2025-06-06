import React, { useState, useEffect } from 'react';
import { useToast } from '../../../hooks/useToast';
import CreateWeightModal from './CreateWeightModal';

const AddStrategyPerspective = ({ isOpen, closeModal, onSubmit, departments = [], perspectives = [], initialData = null }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    department_id: '',
    strategy_perspective_id: '',
    weight: '',
  });
  const [errors, setErrors] = useState({});
  const [totalWeight, setTotalWeight] = useState(0);
  const [departmentWeights, setDepartmentWeights] = useState([]);
  
  // Initialize form with data for editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        department_id: initialData.department_id || '',
        strategy_perspective_id: initialData.strategy_perspective_id || '',
        weight: initialData.weight || '',
      });
    } else {
      setFormData({
        department_id: '',
        strategy_perspective_id: '',
        weight: '',
      });
    }
  }, [initialData, isOpen]);
  
  // Get existing weights for selected department
  useEffect(() => {
    if (formData.department_id) {
      const selectedDepartment = departments.find(dept => dept.id.toString() === formData.department_id.toString());
      if (selectedDepartment && selectedDepartment.active_weights) {
        setDepartmentWeights(selectedDepartment.active_weights);
        
        // Calculate total weight excluding current perspective if editing
        const total = selectedDepartment.active_weights.reduce((sum, weight) => {
          if (initialData && weight.id === initialData.id) {
            return sum;
          }
          return sum + (weight.weight || 0);
        }, 0);
        
        setTotalWeight(total);
      } else {
        setDepartmentWeights([]);
        setTotalWeight(0);
      }
    } else {
      setDepartmentWeights([]);
      setTotalWeight(0);
    }
  }, [formData.department_id, departments, initialData]);
  
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }
    
    if (!formData.strategy_perspective_id) {
      newErrors.strategy_perspective_id = 'Strategy Perspective is required';
    }
    
    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(formData.weight) || Number(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be a positive number';
    } else if (Number(formData.weight) + totalWeight > 100) {
      newErrors.weight = `Total weight cannot exceed 100%. Current total: ${totalWeight}%`;
    }
    
    // Check if perspective is already assigned to this department
    if (formData.department_id && formData.strategy_perspective_id && !initialData) {
      const isDuplicate = departmentWeights.some(
        weight => weight.strategy_perspective_id.toString() === formData.strategy_perspective_id.toString()
      );
      
      if (isDuplicate) {
        newErrors.strategy_perspective_id = 'This perspective is already assigned to this department';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        department_id: Number(formData.department_id),
        strategy_perspective_id: Number(formData.strategy_perspective_id),
        weight: Number(formData.weight)
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
    }
  };
  
  // Filter out perspectives that are already assigned to the selected department
  const availablePerspectives = perspectives.filter(perspective => {
    if (!formData.department_id) return true;
    
    // If editing, allow the current perspective
    if (initialData && initialData.strategy_perspective_id === perspective.id) return true;
    
    // Check if the perspective is already assigned
    return !departmentWeights.some(
      weight => weight.strategy_perspective_id === perspective.id
    );
  });

  // Use the CreateWeightModal component instead of implementing our own modal
  return (
    <CreateWeightModal
      isOpen={isOpen}
      closeModal={closeModal}
      onSubmit={handleSubmit}
      departments={departments}
      perspectives={availablePerspectives}
      initialData={initialData}
      formData={formData}
      errors={errors}
      totalWeight={totalWeight}
      handleChange={handleChange}
    />
  );
};

export default AddStrategyPerspective;
