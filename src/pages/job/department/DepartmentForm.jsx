import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const DepartmentForm = ({ initialData, onSubmit, onCancel, isModal, isEditing }) => {
  const [formData, setFormData] = useState({
    short_code: '',
    name: '',
    hod_id: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        short_code: initialData.short_code || '',
        name: initialData.name || '',
        hod_id: initialData.hod_id || '',
      });
    } else {
      setFormData({
        short_code: '',
        name: '',
        hod_id: '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Short Code</label>
        <Input
          type="text"
          value={formData.short_code}
          onChange={(e) => setFormData({ ...formData, short_code: e.target.value })}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Department Name</label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">HOD ID</label>
        <Input
          type="text"
          value={formData.hod_id}
          onChange={(e) => setFormData({ ...formData, hod_id: e.target.value })}
          className="mt-1"
        />
      </div>
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
