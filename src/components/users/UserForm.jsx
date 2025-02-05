import React, { useState } from 'react';
import FilterBox from '../ui/FilterBox';

const UserForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState(() => ({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    roles: [],
    username: '',
    employee_id: '',
    date_of_birth: '',
    gender: '',
    status: 'enabled',
    ...initialData,
  }));

  const handleChange = (e) => {
    const { name, value, multiple, options } = e.target;
    if (multiple) {
      const selectedValues = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData({
        ...formData,
        [name]: selectedValues,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const filters = [
    { id: 'first_name', label: 'First Name', type: 'text', value: formData.first_name, onChange: handleChange },
    { id: 'last_name', label: 'Last Name', type: 'text', value: formData.last_name, onChange: handleChange },
    { id: 'email', label: 'Email', type: 'email', value: formData.email, onChange: handleChange },
    { id: 'employee_id', label: 'Employee ID', type: 'text', value: formData.employee_id, onChange: handleChange },
    { id: 'roles', label: 'System Role', type: 'select', value: formData.roles, multiple: true, onChange: handleChange, options: [
      { value: 'manager', label: 'Superadmin' },
      { value: 'officer', label: 'HR' },
    ]},
    { id: 'status', label: 'Status', type: 'select', value: formData.status, onChange: handleChange, options: [
      { value: 'enabled', label: 'Enabled' },
      { value: 'disabled', label: 'Disabled' },
    ]},
  ];

  const buttons = [
    { label: 'Save', variant: 'pride', onClick: handleSubmit, type: 'submit' }, 
    { label: 'Cancel', variant: 'secondary', onClick: handleCancel },
  ];

  return (
    <FilterBox title="System Users" filters={filters} buttons={buttons}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields are now managed by FilterBox */}
      </form>
    </FilterBox>
  );
};

export default UserForm;
