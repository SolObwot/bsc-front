import React, { useState, useEffect } from 'react';
import FilterBox from '../../components/ui/FilterBox';


const EmployeeForm = ({ section, onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState(() => {
    console.log('Initial Data received:', initialData); // Log initial data
    return {
      // Personal Details
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      email: initialData?.email || '',
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
      
      // Contact Details - Updated to handle multiple records
      phone: initialData?.contacts?.[0]?.phone || initialData?.phone || '',
      email: initialData?.contacts?.[0]?.email || initialData?.email || '',
      address: initialData?.contacts?.[0]?.address || initialData?.address || '',
      district: initialData?.contacts?.[0]?.district || initialData?.district || '',

      // Emergency Contacts - Updated to handle multiple records
      emergency_contact_name: initialData?.emergency_contacts?.[0]?.name || initialData?.emergency_contact_name || '',
      emergency_contact_phone: initialData?.emergency_contacts?.[0]?.phone || initialData?.emergency_contact_phone || '',
      emergency_contact_relations: initialData?.emergency_contacts?.[0]?.relations || initialData?.emergency_contact_relations || '',
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
        id: 'email', 
        label: 'Email', 
        type: 'email',
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
        id: 'phone', 
        label: 'Phone Number', 
        type: 'tel',
        required: false 
      },
      { 
        id: 'email', 
        label: 'Personal Email', 
        type: 'email',
        required: false 
      },
      { 
        id: 'address', 
        label: 'Address', 
        type: 'text',
        required: false 
      },
      { 
        id: 'district', 
        label: 'District', 
        type: 'text',
        required: false 
      },

    ],
    emergencyContacts: [
      { 
        id: 'emergency_contact_name', 
        label: 'Emergency Contact Name', 
        type: 'text',
        required: false  
      },
      { 
        id: 'emergency_contact_phone', 
        label: 'Emergency Contact Phone', 
        type: 'tel',
        required: false 
      },
      { 
        id: 'emergency_contact_relations', 
        label: 'Emergency Contact Relations', 
        type: 'text',
        required: false 
      },
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
        // { label: 'Cancel', variant: 'secondary', onClick: onCancel },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Any additional form elements if needed */}
      </form>
    </FilterBox>
  );
};

export default EmployeeForm;
