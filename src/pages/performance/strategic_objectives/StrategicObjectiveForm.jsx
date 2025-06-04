import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import { 
  DocumentTextIcon, 
  BuildingOfficeIcon, 
  ChartPieIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const StrategicObjectiveForm = ({ 
  initialData = null, 
  perspectives = [],
  departments = [],
  onSubmit,
  onCancel,
  isModal = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    strategy_perspective_id: '',
    department_id: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (initialData) {
      // Ensure we're handling all possible data structures
      const formValues = {
        name: initialData.name || initialData.objective?.name || '',
        strategy_perspective_id: String(initialData.strategy_perspective_id || initialData.perspective?.id || ''),
        department_id: String(initialData.department_id || '')
      };
      
      setFormData(formValues);
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Strategic objective is required';
    }
    
    if (!formData.strategy_perspective_id) {
      newErrors.strategy_perspective_id = 'Perspective is required';
    }
    
    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      // Handle error (show message, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`${isModal ? '' : 'bg-white p-6 rounded-lg shadow-sm border border-gray-200'}`}>
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Strategic Objective <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter strategic objective"
              rows={3}
              className={`block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors resize-none ${
                errors.name 
                  ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400'
              }`}
            />
            {errors.name && (
              <div className="absolute top-3 right-0 pr-3 flex items-start pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="department_id"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-2 rounded-md appearance-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors ${
                errors.department_id 
                  ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400'
              }`}
            >
              <option value="">-- Select Department --</option>
              {departments.map(department => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            {errors.department_id && (
              <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.department_id && (
            <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="strategy_perspective_id" className="block text-sm font-medium text-gray-700 mb-1">
            Strategy Perspective <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ChartPieIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="strategy_perspective_id"
              name="strategy_perspective_id"
              value={formData.strategy_perspective_id}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-2 rounded-md appearance-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors ${
                errors.strategy_perspective_id 
                  ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500 hover:border-gray-400'
              }`}
            >
              <option value="">-- Select Perspective --</option>
              {perspectives.map(perspective => (
                <option key={perspective.id} value={perspective.id}>
                  {perspective.name} ({perspective.type} - {perspective.weight}%)
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            {errors.strategy_perspective_id && (
              <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.strategy_perspective_id && (
            <p className="mt-1 text-sm text-red-600">{errors.strategy_perspective_id}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-6">
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
            {isSubmitting ? 'Saving...' : initialData ? 'Update Objective' : 'Create Objective'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default StrategicObjectiveForm;
