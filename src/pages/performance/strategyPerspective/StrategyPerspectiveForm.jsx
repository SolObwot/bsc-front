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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- New state for quantitative/qualitative totals ---
  const [totalQuantitativeWeight, setTotalQuantitativeWeight] = useState(0);
  const [totalQualitativeWeight, setTotalQualitativeWeight] = useState(0);
  // ----------------------------------------------------

  // Calculate actual totals for display (including the current perspective if editing)
  const actualTotals = useMemo(() => {
    let quantitative = 0;
    let qualitative = 0;
    if (formData.department_id) {
      const selectedDepartment = departments.find(dept => dept.id.toString() === formData.department_id.toString());
      if (selectedDepartment && selectedDepartment.active_weights) {
        selectedDepartment.active_weights.forEach(weight => {
          const perspective = perspectives.find(p => p.id === weight.strategy_perspective_id);
          if (perspective?.type === 'quantitative') {
            quantitative += weight.weight || 0;
          } else if (perspective?.type === 'qualitative') {
            qualitative += weight.weight || 0;
          }
        });
      }
    }
    return { quantitative, qualitative };
  }, [formData.department_id, departments, perspectives]);

  // Initialize form with data for editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        department_id: String(initialData.department_id || initialData.department?.id || ''),
        strategy_perspective_id: String(initialData.strategy_perspective_id || initialData.perspective?.id || ''),
        weight: String(initialData.weight || ''),
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

        // --- New logic for quantitative/qualitative totals ---
        let quantitative = 0;
        let qualitative = 0;
        selectedDepartment.active_weights.forEach(weight => {
          if (initialData && weight.id === initialData.id) return;
          const perspective = perspectives.find(p => p.id === weight.strategy_perspective_id);
          if (perspective?.type === 'quantitative') {
            quantitative += weight.weight || 0;
          } else if (perspective?.type === 'qualitative') {
            qualitative += weight.weight || 0;
          }
        });
        setTotalQuantitativeWeight(quantitative);
        setTotalQualitativeWeight(qualitative);
        // ----------------------------------------------------

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
        setTotalQuantitativeWeight(0);
        setTotalQualitativeWeight(0);
      }
    } else {
      setDepartmentWeights([]);
      setTotalWeight(0);
      setTotalQuantitativeWeight(0);
      setTotalQualitativeWeight(0);
    }
  }, [formData.department_id, departments, initialData, perspectives]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }
    
    if (!formData.strategy_perspective_id) {
      newErrors.strategy_perspective_id = 'Strategy Perspective is required';
    }

    // --- New logic for type-based validation ---
    const selectedPerspective = perspectives.find(
      p => p.id?.toString() === formData.strategy_perspective_id?.toString()
    );
    const type = selectedPerspective?.type;
    // ------------------------------------------

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(formData.weight) || Number(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be a positive number';
    } else if (
      type === 'quantitative' &&
      Number(formData.weight) + totalQuantitativeWeight > 100
    ) {
      newErrors.weight = `Total quantitative weight cannot exceed 100%. Current total: ${totalQuantitativeWeight}%`;
    } else if (
      type === 'qualitative' &&
      Number(formData.weight) + totalQualitativeWeight > 10
    ) {
      newErrors.weight = `Total qualitative weight cannot exceed 10%. Current total: ${totalQualitativeWeight}%`;
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Create sanitized submission data
      const payload = {
        ...formData,
        weight: parseFloat(formData.weight),
      };
      
      // Only include department_id and strategy_perspective_id when creating new weight
      if (!initialData) {
        payload.department_id = Number(formData.department_id);
        payload.strategy_perspective_id = Number(formData.strategy_perspective_id);
      }
      
      await onSubmit(payload);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Error",
        description: "Failed to save the data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Filter out perspectives that are already assigned to the selected department
  const availablePerspectives = useMemo(() => {
    if (!formData.department_id) return [];
    
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
    <form onSubmit={handleSubmit} className={`space-y-4 ${isModal ? '' : 'bg-white p-6 rounded-lg shadow-sm border border-gray-200'}`}>
      <div className="space-y-5">
        <div>
          <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            id="department_id"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.department_id ? 'border-red-500' : ''}`}
            disabled={!!initialData}
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.department_id && <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>}
        </div>
        
        <div>
          <label htmlFor="strategy_perspective_id" className="block text-sm font-medium text-gray-700 mb-1">
            Strategy Perspective <span className="text-red-500">*</span>
          </label>
          <select
            id="strategy_perspective_id"
            name="strategy_perspective_id"
            value={formData.strategy_perspective_id}
            onChange={handleChange}
            className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.strategy_perspective_id ? 'border-red-500' : ''}`}
            disabled={!!initialData}
          >
            <option value="">-- Select Perspective --</option>
            {perspectives.map((perspective) => (
              <option 
                key={perspective.id} 
                value={perspective.id}
                disabled={formData.department_id && departmentWeights.some(
                  weight => weight.strategy_perspective_id === perspective.id
                )}
              >
                {perspective.name} ({perspective.type})
                {formData.department_id && departmentWeights.some(
                  weight => weight.strategy_perspective_id === perspective.id
                ) ? ' - Already assigned' : ''}
              </option>
            ))}
          </select>
          {errors.strategy_perspective_id && <p className="mt-1 text-sm text-red-600">{errors.strategy_perspective_id}</p>}
          {formData.department_id && formData.strategy_perspective_id && departmentWeights.some(
            weight => weight.strategy_perspective_id?.toString() === formData.strategy_perspective_id.toString()
          ) && (
            <p className="mt-1 text-sm text-amber-600">This strategy perspective is already assigned to this department</p>
          )}
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Perspective Weight (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="1"
            max={
              (() => {
                const selectedPerspective = perspectives.find(
                  p => p.id?.toString() === formData.strategy_perspective_id?.toString()
                );
                if (selectedPerspective?.type === 'qualitative') {
                  return 10 - totalQualitativeWeight;
                } else if (selectedPerspective?.type === 'quantitative') {
                  return 100 - totalQuantitativeWeight;
                }
                return 100;
              })()
            }
            placeholder="Enter weight"
            className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.weight ? 'border-red-500' : ''}`}
          />
          {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}

          {/* Use actualTotals for display */}
          {formData.department_id && (() => {
            const selectedPerspective = perspectives.find(
              p => p.id?.toString() === formData.strategy_perspective_id?.toString()
            );
            if (selectedPerspective?.type === 'quantitative') {
              const remaining = 100 - actualTotals.quantitative;
              return (
                <div className="mt-2 text-sm">
                  <span className="text-gray-500">
                    Quantitative total: {actualTotals.quantitative}% (max 100%)
                  </span>
                  <br />
                  {remaining > 0 ? (
                    <span className="text-green-600">
                      Remaining quantitative weight: {remaining}%
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Total quantitative weight already reached
                    </span>
                  )}
                </div>
              );
            }
            if (selectedPerspective?.type === 'qualitative') {
              const remaining = 10 - actualTotals.qualitative;
              return (
                <div className="mt-2 text-sm">
                  <span className="text-gray-500">
                    Qualitative total: {actualTotals.qualitative}% (max 10%)
                  </span>
                  <br />
                  {remaining > 0 ? (
                    <span className="text-green-600">
                      Remaining qualitative weight: {remaining}%
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Total qualitative weight already reached
                    </span>
                  )}
                </div>
              );
            }
            return (
              <div className="mt-2 text-sm text-gray-500">
                Quantitative total: {actualTotals.quantitative}% (max 100%)<br />
                Qualitative total: {actualTotals.qualitative}% (max 10%)
              </div>
            );
          })()}
        </div>
        
        <div className={`flex ${isModal ? 'justify-end' : 'justify-start'} space-x-3 pt-6`}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="pride"
            disabled={isSubmitting}
            className="px-4"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Weight' : 'Save Weight'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default StrategyPerspectiveForm;