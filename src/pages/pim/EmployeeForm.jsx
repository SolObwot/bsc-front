import React, { useState } from 'react';
import FilterBox from '../../components/ui/FilterBox';

const EmployeeForm = ({ section, onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState(() => {
    console.log('Initial Data received:', initialData); // Log initial data
    return {
      // Personal Details
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      username: initialData?.username || '',
      staff_number: initialData?.staff_number || '',
      dob: initialData?.dob || '',
      gender: initialData?.gender || '',
      nin: initialData?.nin || '',
      place_of_birth: initialData?.place_of_birth || '',
      religion: initialData?.religion || '',
      tribe: initialData?.tribe || '',
      marital_status: initialData?.marital_status || '',
      status: initialData?.status || '',
      
      // Contact Details
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      country: initialData?.country || '',
      
      // System Access
      roles: initialData?.roles || [],
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roles' ? [value] : value,
    }));
  };

  const formSections = {
    personalDetails: [
      { 
        id: 'first_name', 
        label: 'First Name', 
        type: 'text',
        required: true 
      },
      { 
        id: 'last_name', 
        label: 'Last Name', 
        type: 'text',
        required: true 
      },
      { 
        id: 'username', 
        label: 'Username', 
        type: 'text',
        required: true 
      },
      { 
        id: 'staff_number', 
        label: 'Employee ID', 
        type: 'text',
        required: true 
      },
      { 
        id: 'nin', 
        label: 'National ID Number', 
        type: 'text',
        required: true 
      },
      { 
        id: 'dob', 
        label: 'Date of Birth', 
        type: 'date',
        required: true 
      },
      { 
        id: 'gender', 
        label: 'Gender', 
        type: 'select', 
        required: true,
        options: [
          { value: '', label: '-- Select --' },
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ]
      },
      { 
        id: 'marital_status', 
        label: 'Marital Status', 
        type: 'select',
        required: true, 
        options: [
          { value: '', label: '-- Select --' },
          { value: 'single', label: 'Single' },
          { value: 'married', label: 'Married' },
          { value: 'divorced', label: 'Divorced' },
          { value: 'widowed', label: 'Widowed' },
        ]
      },
      { 
        id: 'religion', 
        label: 'Religion', 
        type: 'select',
        required: true, 
        options: [
          { value: '', label: '-- Select --' },   
          { value: 'Christianity', label: 'Christianity' },
          { value: 'Islam', label: 'Islam' },
          { value: 'Buddhism', label: 'Buddhism' },
          { value: 'Hinduism', label: 'Hinduism' },
          { value: 'Traditional', label: 'Traditional' },
          { value: 'Other', label: 'Other' },
        ]
      },
      { id: 'tribe', label: 'Tribe', type: 'text' },
      { id: 'place_of_birth', label: 'Place of Birth', type: 'text' },
    ],
    contactDetails: [
      { 
        id: 'email', 
        label: 'Email', 
        type: 'email',
        required: true 
      },
      { 
        id: 'phone', 
        label: 'Phone Number', 
        type: 'tel',
        required: true 
      },
      { 
        id: 'address', 
        label: 'Address', 
        type: 'text',
        required: true 
      },
      { id: 'city', label: 'City', type: 'text' },
      { id: 'country', label: 'Country', type: 'text' },
    ],
    // Add more sections as needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const currentFields = formSections[section] || [];

  return (
    <FilterBox
      className="bg-white p-4"
      filters={currentFields.map(field => ({
        ...field,
        label: field.required ? (
          <span>
            {field.label}
            <span className="text-red-500 ml-1">*</span>
          </span>
        ) : field.label,
        value: formData[field.id],
        onChange: handleChange,
      }))}
      buttons={[
        { label: 'Save', variant: 'pride', onClick: handleSubmit, type: 'submit' },
        { label: 'Cancel', variant: 'secondary', onClick: onCancel },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Any additional form elements if needed */}
      </form>
    </FilterBox>
  );
};

export default EmployeeForm;
