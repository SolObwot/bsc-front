import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';

const AgreementForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel,
  isModal = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    period: '',
    supervisorName: '',
    hodName: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with data for editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.title || '',
        period: initialData.period === 'Annual Review' ? 'annual' : 'probation',
        supervisorName: initialData.supervisorName || '',
        hodName: initialData.hodName || '',
      });
    } else {
      setFormData({
        name: '',
        period: '',
        supervisorName: '',
        hodName: '',
      });
    }
  }, [initialData]);

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Agreement name is required';
    }
    
    if (!formData.period) {
      newErrors.period = 'Period is required';
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
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Agreement Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter agreement name"
            className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
            Period <span className="text-red-500">*</span>
          </label>
          <select
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.period ? 'border-red-500' : ''}`}
          >
            <option value="">-- Select Period --</option>
            <option value="annual">Annual Review</option>
            <option value="probation">Probation 6 months</option>
          </select>
          {errors.period && <p className="mt-1 text-sm text-red-600">{errors.period}</p>}
        </div>
        
        {/* Only show these fields when editing */}
        {initialData && (
          <>
            <div>
              <label htmlFor="supervisorName" className="block text-sm font-medium text-gray-700 mb-1">
                Supervisor Name
              </label>
              <input
                type="text"
                id="supervisorName"
                name="supervisorName"
                value={formData.supervisorName}
                onChange={handleChange}
                placeholder="Enter supervisor name"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="hodName" className="block text-sm font-medium text-gray-700 mb-1">
                HOD Name
              </label>
              <input
                type="text"
                id="hodName"
                name="hodName"
                value={formData.hodName}
                onChange={handleChange}
                placeholder="Enter HOD name"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </>
        )}
        
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
            {isSubmitting ? 'Saving...' : initialData ? 'Update Agreement' : 'Create Agreement'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AgreementForm;