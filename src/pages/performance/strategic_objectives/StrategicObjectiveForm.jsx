import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';

const StrategicObjectiveForm = ({ 
  initialData = null, 
  perspectives = [],
  departments = [],
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    perspective_id: '',
    department_id: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        perspective_id: initialData.perspective_id || '',
        department_id: initialData.department_id || '',
        description: initialData.description || ''
      });
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
      newErrors.name = 'Objective name is required';
    }
    
    if (!formData.perspective_id) {
      newErrors.perspective_id = 'Perspective is required';
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
      console.error('Error submitting form:', error);
      // Handle error (show message, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Objective Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`block w-full rounded-md shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            id="department_id"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className={`block w-full rounded-md shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 ${
              errors.department_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">-- Select Department --</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
          {errors.department_id && (
            <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="perspective_id" className="block text-sm font-medium text-gray-700 mb-1">
            Perspective <span className="text-red-500">*</span>
          </label>
          <select
            id="perspective_id"
            name="perspective_id"
            value={formData.perspective_id}
            onChange={handleChange}
            className={`block w-full rounded-md shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500 ${
              errors.perspective_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">-- Select Perspective --</option>
            {perspectives.map(perspective => (
              <option key={perspective.id} value={perspective.id}>
                {perspective.name} ({perspective.type} - {perspective.weight}%)
              </option>
            ))}
          </select>
          {errors.perspective_id && (
            <p className="mt-1 text-sm text-red-600">{errors.perspective_id}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="pride"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Objective' : 'Create Objective'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default StrategicObjectiveForm;
