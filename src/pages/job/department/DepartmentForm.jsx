import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import useUserSearch from '../../../hooks/agreements/useUserSearch';
import SearchableCombobox from '../../../components/ui/SearchableCombobox';

const DepartmentForm = ({ initialData, onSubmit, onCancel, isModal, isEditing }) => {
  const { searchResults, loading, hasMore, searchUsers, loadMoreUsers } = useUserSearch();

  const [formData, setFormData] = useState({
    short_code: '',
    name: '',
    hod: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        short_code: initialData.short_code || '',
        name: initialData.name || '',
        hod: initialData.hod || null,
      });
    } else {
      setFormData({
        short_code: '',
        name: '',
        hod: null,
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

  const validate = () => {
    const newErrors = {};
    if (!formData.short_code.trim()) newErrors.short_code = 'Short Code is required.';
    if (!formData.name.trim()) newErrors.name = 'Department Name is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submissionData = {
        short_code: formData.short_code,
        name: formData.name,
        hod_id: formData.hod?.id || null,
        hod: formData.hod,
      };
      onSubmit(submissionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Short Code <span className="text-red-500">*</span></label>
        <Input
          type="text"
          name="short_code"
          value={formData.short_code}
          onChange={handleChange}
          className={`mt-1 ${errors.short_code ? 'border-red-500' : ''}`}
        />
        {errors.short_code && <p className="mt-1 text-sm text-red-600">{errors.short_code}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Department Name <span className="text-red-500">*</span></label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      <SearchableCombobox
        label="HOD"
        options={searchResults}
        selected={formData.hod}
        onChange={(selectedUser) => setFormData({ ...formData, hod: selectedUser })}
        onSearch={searchUsers}
        onLoadMore={loadMoreUsers}
        hasMore={hasMore}
        loading={loading}
        placeholder="Type to search for a HOD..."
      />
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="pride">
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default DepartmentForm;
