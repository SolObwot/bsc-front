import React, { useState, useEffect } from 'react';
import { useToast } from '../../../hooks/useToast';
import Button from '../../../components/ui/Button';
import useUserSearch from '../../../hooks/agreements/useUserSearch';
import SearchableCombobox from '../../../components/ui/SearchableCombobox';

const AgreementForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel,
  isModal = false
}) => {
  const { toast } = useToast();
  const { searchResults, loading, hasMore, searchUsers, loadMoreUsers } = useUserSearch();

  const [formData, setFormData] = useState({
    name: '',
    period: '',
    supervisor: null,
    hod: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        period: initialData.period || '',
        supervisor: initialData.supervisor || null,
        hod: initialData.hod || null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSupervisorChange = (selectedUser) => {
    setFormData(prev => ({ ...prev, supervisor: selectedUser }));
    if (errors.supervisor) {
        setErrors(prev => ({ ...prev, supervisor: null }));
    }
  };

  const handleHodChange = (selectedUser) => {
    setFormData(prev => ({ ...prev, hod: selectedUser }));
     if (errors.hod) {
        setErrors(prev => ({ ...prev, hod: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Agreement name is required.';
    if (!formData.period) newErrors.period = 'Period is required.';
    if (initialData && !formData.supervisor) newErrors.supervisor = 'Supervisor is required.';
    if (initialData && !formData.hod) newErrors.hod = 'HOD is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Create the form data with complete objects
      const submissionData = {
        name: formData.name,
        period: formData.period,
        supervisor_id: formData.supervisor?.id || null, 
        hod_id: formData.hod?.id || null,
        supervisor: formData.supervisor,
        hod: formData.hod
      };
      try {
        await onSubmit(submissionData);
      } catch (error) {
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted errors.",
        variant: "destructive",
      });
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
        
        {initialData && (
          <>
            <SearchableCombobox
              label="Supervisor"
              options={searchResults}
              selected={formData.supervisor}
              onChange={handleSupervisorChange}
              onSearch={searchUsers}
              onLoadMore={loadMoreUsers}
              hasMore={hasMore}
              loading={loading}
              placeholder="Type to search for a supervisor..."
              error={errors.supervisor}
            />
            
            <SearchableCombobox
              label="HOD / Line Manager"
              options={searchResults}
              selected={formData.hod}
              onChange={handleHodChange}
              onSearch={searchUsers}
              onLoadMore={loadMoreUsers}
              hasMore={hasMore}
              loading={loading}
              placeholder="Type to search for a HOD..."
              error={errors.hod}
            />
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
            disabled={isSubmitting || loading}
            className="px-4"
          >
            {isSubmitting ? 'Saving...' : 'Update Agreement'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AgreementForm;