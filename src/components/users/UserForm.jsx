import React, { useState } from 'react';
import FilterBox from '../ui/FilterBox';

const UserForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState(() => ({
    last_name: '',
    surname: '',
    other_name: '',
    username: '',
    email: '',
    roles: [],
    staff_number: '',
    dob: '',
    gender: '',
    nin: '',
    religion: '',
    tribe: '',
    blood_group: '',
    fathers_name: '',
    fathers_status: '',
    mothers_name: '',
    mothers_status: '',
    marital_status: '',
    parish_residence: '',
    parish_origin: '',
    subcounty_residence: '',
    subcounty_origin: '',
    county_residence: '',
    county_origin: '',
    district_residence: '',
    district_origin: '',
    village_residence: '',
    village_origin: '',
    place_of_birth: '',
    supervisor_job_title_id: '',
    job_title_id: '',
    unit_or_branch_id: '',
    status: '',
    ...initialData,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value,
    };

    // Auto-generate username when last_name or surname changes
    if (name === 'last_name' || name === 'surname') {
      const lastName = name === 'last_name' ? value : formData.last_name;
      const surname = name === 'surname' ? value : formData.surname;
      
      if (lastName && surname) {
        const generatedUsername = `${lastName.charAt(0).toLowerCase()}.${surname.toLowerCase()}`;
        updatedData.username = generatedUsername;
      }
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit Triggered', formData);
    onSubmit(formData);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const filters = [
    { id: 'last_name', label: 'Last Name', type: 'text', value: formData.last_name, onChange: handleChange },
    { id: 'surname', label: 'Surname', type: 'text', value: formData.surname, onChange: handleChange },
    { id: 'other_name', label: 'Other Name', type: 'text', value: formData.other_name, onChange: handleChange },
    { id: 'email', label: 'Email', type: 'email', value: formData.email, onChange: handleChange },
    { id: 'staff_number', label: 'Employee ID', type: 'text', value: formData.staff_number, onChange: handleChange },
    { id: 'gender', label: 'Gender', type: 'text', value: formData.gender, onChange: handleChange },
    { id: 'dob', label: 'Date of Birth', type: 'date', value: formData.dob, onChange: handleChange },
    { id: 'nin', label: 'NIN', type: 'text', value: formData.nin, onChange: handleChange },
    { id: 'religion', label: 'Religion', type: 'text', value: formData.religion, onChange: handleChange },
    { id: 'tribe', label: 'Tribe', type: 'text', value: formData.tribe, onChange: handleChange },
    { id: 'blood_group', label: 'Blood Group', type: 'text', value: formData.blood_group, onChange: handleChange },
    { id: 'fathers_name', label: 'Father\'s Name', type: 'text', value: formData.fathers_name, onChange: handleChange },
    { id: 'fathers_status', label: 'Father\'s Status', type: 'text', value: formData.fathers_status, onChange: handleChange },
    { id: 'mothers_name', label: 'Mother\'s Name', type: 'text', value: formData.mothers_name, onChange: handleChange },
    { id: 'mothers_status', label: 'Mother\'s Status', type: 'text', value: formData.mothers_status, onChange: handleChange },
    { id: 'marital_status', label: 'Marital Status', type: 'text', value: formData.marital_status, onChange: handleChange },
    { id: 'parish_residence', label: 'Parish Residence', type: 'text', value: formData.parish_residence, onChange: handleChange },
    { id: 'parish_origin', label: 'Parish Origin', type: 'text', value: formData.parish_origin, onChange: handleChange },
    { id: 'subcounty_residence', label: 'Subcounty Residence', type: 'text', value: formData.subcounty_residence, onChange: handleChange },
    { id: 'subcounty_origin', label: 'Subcounty Origin', type: 'text', value: formData.subcounty_origin, onChange: handleChange },
    { id: 'county_residence', label: 'County Residence', type: 'text', value: formData.county_residence, onChange: handleChange },
    { id: 'county_origin', label: 'County Origin', type: 'text', value: formData.county_origin, onChange: handleChange },
    { id: 'district_residence', label: 'District Residence', type: 'text', value: formData.district_residence, onChange: handleChange },
    { id: 'district_origin', label: 'District Origin', type: 'text', value: formData.district_origin, onChange: handleChange },
    { id: 'village_residence', label: 'Village Residence', type: 'text', value: formData.village_residence, onChange: handleChange },
    { id: 'village_origin', label: 'Village Origin', type: 'text', value: formData.village_origin, onChange: handleChange },
    { id: 'place_of_birth', label: 'Place of Birth', type: 'text', value: formData.place_of_birth, onChange: handleChange },
    { id: 'supervisor_job_title_id', label: 'Supervisor Job Title ID', type: 'text', value: formData.supervisor_job_title_id, onChange: handleChange },
    { id: 'job_title_id', label: 'Job Title ID', type: 'text', value: formData.job_title_id, onChange: handleChange },
    { id: 'unit_or_branch_id', label: 'Unit or Branch ID', type: 'text', value: formData.unit_or_branch_id, onChange: handleChange },
  ];

  const buttons = [
    { label: 'Save', variant: 'pride', onClick: handleSubmit, type: 'submit' }, 
    { label: 'Cancel', variant: 'secondary', onClick: handleCancel },
  ];

  return (
    <FilterBox title="System Users" filters={filters} buttons={buttons}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="username" value={formData.username || ''} />
        <input type="hidden" name="roles" value={formData.roles.join(',')} />
      </form>
    </FilterBox>
  );
};

export default UserForm;
