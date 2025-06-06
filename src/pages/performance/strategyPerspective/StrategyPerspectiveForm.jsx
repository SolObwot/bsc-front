import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../hooks/useToast';

const StrategyPerspectiveForm = ({ 
  departments = [], 
  perspectives = [],
  initialData = null, 
  onSubmit, 
  onCancel,
  isModal = false
}) => {
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
  }, [initialData]);
  
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
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
        weight => weight.strategy_perspective_id?.toString() === formData.strategy_perspective_id.toString()
      );
      
      if (isDuplicate) {
        newErrors.strategy_perspective_id = 'This perspective is already assigned to this department';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
      // Create sanitized submission data
      const submissionData = {
        weight: Number(formData.weight)
      };
      
      // Only include department_id and strategy_perspective_id when creating new weight
      if (!initialData) {
        submissionData.department_id = Number(formData.department_id);
        submissionData.strategy_perspective_id = Number(formData.strategy_perspective_id);
      }
      
      onSubmit(submissionData);
    } else {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
    }
  };
  
  // Filter out perspectives that are already assigned to the selected department
  const availablePerspectives = useMemo(() => {
    if (!formData.department_id) return perspectives;
    
    return perspectives.filter(perspective => {
      // If editing, allow the current perspective
      if (initialData && initialData.strategy_perspective_id === perspective.id) return true;
      
      // Check if the perspective is already assigned
      return !departmentWeights.some(
        weight => weight.strategy_perspective_id === perspective.id
      );
    });
  }, [formData.department_id, perspectives, departmentWeights, initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="department_id" className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <select
          id="department_id"
          name="department_id"
          value={formData.department_id}
          onChange={handleChange}
          className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.department_id ? 'border-red-500' : ''}`}
          disabled={!!initialData}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        {errors.department_id && <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>}
      </div>
      
      <div>
        <label htmlFor="strategy_perspective_id" className="block text-sm font-medium text-gray-700">
          Strategy Perspective
        </label>
        <select
          id="strategy_perspective_id"
          name="strategy_perspective_id"
          value={formData.strategy_perspective_id}
          onChange={handleChange}
          className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.strategy_perspective_id ? 'border-red-500' : ''}`}
          disabled={!!initialData}
        >
          <option value="">Select Perspective</option>
          {availablePerspectives.map((perspective) => (
            <option key={perspective.id} value={perspective.id}>
              {perspective.name} ({perspective.type})
            </option>
          ))}
        </select>
        {errors.strategy_perspective_id && <p className="mt-1 text-sm text-red-600">{errors.strategy_perspective_id}</p>}
      </div>
      
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
          Weight (%)
        </label>
        <input
          type="number"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          min="1"
          max={100 - totalWeight}
          className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.weight ? 'border-red-500' : ''}`}
        />
        {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
        
        {formData.department_id && (
          <div className="mt-2 text-sm text-gray-500">
            Current total weight for this department: {totalWeight}%
            <br />
            Available weight: {100 - totalWeight}%
          </div>
        )}
      </div>
      
      {!isModal && (
        <div className="pt-5 flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? "Update" : "Save"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default StrategyPerspectiveForm;
