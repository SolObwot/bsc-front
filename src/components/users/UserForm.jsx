import React, { useState } from 'react';
import FilterBox from '../ui/FilterBox';

const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    roles: '',
    username: '',
    employee_id: '',
    date_of_birth: '',
    gender: '',
    status: 'enabled',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCancel = () => {
    
  };

  const filters = [
    { id: 'first_name', label: 'First Name', type: 'text', value: formData.first_name, onChange: handleChange },
    { id: 'last_name', label: 'Last Name', type: 'text', value: formData.last_name, onChange: handleChange },
    { id: 'email', label: 'Email', type: 'email', value: formData.email, onChange: handleChange },
    { id: 'employee_id', label: 'Employee ID', type: 'text', value: formData.employee_id, onChange: handleChange },
    { id: 'roles', label: 'Roles', type: 'select', value: formData.roles, onChange: handleChange, options: [
      { value: '', label: '-- Select --' },
      { value: 'superadmin', label: 'Superadmin' },
      { value: 'manager', label: 'Manager' },
      { value: 'head_of_department', label: 'Head of Department' },
      { value: 'officer', label: 'Officer' },
    ]},
    { id: 'status', label: 'Status', type: 'select', value: formData.status, onChange: handleChange, options: [
      { value: 'enabled', label: 'Enabled' },
      { value: 'disabled', label: 'Disabled' },
    ]},
  ];

  const buttons = [
    { label: 'Save', variant: 'pride', onClick: handleSubmit },
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
