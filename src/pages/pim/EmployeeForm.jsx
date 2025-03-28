import React, { useState, useEffect } from 'react';
import FilterBox from '../../components/ui/FilterBox';

const EmployeeForm = ({ section, onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState(() => {
    const initialFormData = {
      // Personal Details
      surname: initialData?.surname || '',
      last_name: initialData?.last_name || '',
      other_name: initialData?.other_name || '', 
      email: initialData?.email || '',
      username: initialData?.username || '',
      staff_number: initialData?.staff_number || '',
      dob: initialData?.dob || '',
      gender: initialData?.gender || '',
      nin: initialData?.nin || '',
      place_of_birth: initialData?.place_of_birth?.name || initialData?.place_of_birth || '',
      religion: initialData?.religion || '',
      tribe: initialData?.tribe || '',
      marital_status: initialData?.marital_status || '',
      status: initialData?.status || '', 
      blood_group: initialData?.blood_group || '',
    
      // Family & Other Details
      personal_email: initialData?.contact_details?.[0]?.personal_email || '', 
      fathers_name: initialData?.fathers_name || '',
      fathers_status: initialData?.fathers_status || '',
      mothers_name: initialData?.mothers_name || '',
      mothers_status: initialData?.mothers_status || '',
      phone: initialData?.contact_details?.[0]?.phone || '', 

      // Residence & Origin (nested objects)
      parish_residence: initialData?.parish_residence?.name || initialData?.parish_residence || '',
      parish_origin: initialData?.parish_origin?.name || initialData?.parish_origin || '',
      subcounty_residence: initialData?.subcounty_residence?.name || initialData?.subcounty_residence || '',
      subcounty_origin: initialData?.subcounty_origin?.name || initialData?.subcounty_origin || '',
      county_residence: initialData?.county_residence?.name || initialData?.county_residence || '',
      county_origin: initialData?.county_origin?.name || initialData?.county_origin || '',
      district_residence: initialData?.district_residence?.name || initialData?.district_residence || '',
      district_origin: initialData?.district_origin?.name || initialData?.district_origin || '',
      village_residence: initialData?.village_residence?.name || initialData?.village_residence || '',
      village_origin: initialData?.village_origin?.name || initialData?.village_origin || '',
    
      // Contact Details (handles multiple records)
      emergency_contact_name: initialData?.contact_details?.[0]?.emergency_contact_name || '',
      emergency_contact_phone: initialData?.contact_details?.[0]?.emergency_contact_phone || '',
      emergency_contact_relations: initialData?.contact_details?.[0]?.emergency_contact_relations?.name || '',
    
      // Next of Kin (from contact_details)
      next_of_kin_name: initialData?.contact_details?.[0]?.next_of_kin_name || '',
      next_of_kin_phone: initialData?.contact_details?.[0]?.next_of_kin_phone || '',
      next_of_kin_email: initialData?.contact_details?.[0]?.next_of_kin_email || '',
      next_of_kin_dob: initialData?.contact_details?.[0]?.next_of_kin_dob || '',
      next_of_kin_occupation: initialData?.contact_details?.[0]?.next_of_kin_occupation || '',
      next_of_kin_place_of_work: initialData?.contact_details?.[0]?.next_of_kin_place_of_work || '',
      next_of_kin_nin: initialData?.contact_details?.[0]?.next_of_kin_nin || '',
      next_of_kin_office_address: initialData?.contact_details?.[0]?.next_of_kin_office_address || '',
      next_of_kin_home_address: initialData?.contact_details?.[0]?.next_of_kin_home_address || '',
      next_of_kin_physical_address: initialData?.contact_details?.[0]?.next_of_kin_physical_address || '',
      next_of_kin_relations: initialData?.contact_details?.[0]?.next_of_kin_relations?.name || '',
    
      // Employment Details
      
      // System Access
      roles: initialData?.roles || [],

      // Qualifications
      qualifications: initialData?.qualification?.map(q => ({
        id: q.id,
        award: q.award,
        class: q.class,
        year_of_award: q.year_of_award,
        is_proof_of_award: q.is_proof_of_award,
        is_proof_of_transcripts: q.is_proof_of_transcripts,
        start_date: q.start_date,
        end_date: q.end_date,
        institution: q.institution?.name || '',
        course: q.course?.name || '',
      })) || [],

      // Dependents
      dependents: initialData?.dependents?.map(d => ({
        id: d.id,
        name: d.name,
        gender: d.gender,
        dob: d.dob,
        contact: d.contact,
        is_medical_applicable: d.is_medical_applicable,
        relationship: d.relationship?.name || '',
      })) || [],

      // Work History
      work_history: initialData?.work_history?.map(w => ({
        id: w.id,
        company_name: w.company_name,
        business_type: w.business_type,
        last_designation: w.last_designation,
        start_date: w.start_date,
        end_date: w.end_date,
        reason_for_exit: w.reason_for_exit,
      })) || [],

      // Referee Details
      refereeDetails: initialData?.referees?.map(r => ({
        id: r.id,
        name: r.name,
        position: r.position,
        address: r.address,
        phone: r.phone,
        email: r.email,
      })) || [],
    };
    return initialFormData; // Ensure the initialFormData is returned
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
      { id: 'surname', label: 'Surname', type: 'text', required: true },
      { id: 'last_name', label: 'Last Name', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'username', label: 'Username', type: 'text', required: true },
      { id: 'staff_number', label: 'Employee ID', type: 'text', required: true },
      { id: 'nin', label: 'National ID Number', type: 'text', required: true },
      { id: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { id: 'gender', label: 'Gender', type: 'select', required: true, options: [
        { value: '', label: '-- Select --' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ]},
      { id: 'marital_status', label: 'Marital Status', type: 'select', required: true, options: [
        { value: '', label: '-- Select --' },
        { value: 'single', label: 'Single' },
        { value: 'married', label: 'Married' },
        { value: 'divorced', label: 'Divorced' },
        { value: 'widowed', label: 'Widowed' },
      ]},
      { id: 'religion', label: 'Religion', type: 'select', required: true, options: [
        { value: '', label: '-- Select --' },
        { value: 'Christianity', label: 'Christianity' },
        { value: 'Islam', label: 'Islam' },
        { value: 'Buddhism', label: 'Buddhism' },
        { value: 'Hinduism', label: 'Hinduism' },
        { value: 'Traditional', label: 'Traditional' },
        { value: 'Other', label: 'Other' },
      ]},
      { id: 'tribe', label: 'Tribe', type: 'text' },
      { id: 'place_of_birth', label: 'Place of Birth', type: 'text' },
    ],
    otherDetails: [
      {id: 'personal_email', label:'Personal Email', type:'text'},
      {id: 'phone', label:'Phone Number', type:'text'},
      { id: 'blood_group', label: 'Blood Group', type: 'text' },
       // Parents Information
      { id: 'fathers_name', label: 'Father\'s Name', type: 'text' },
      { id: 'fathers_status', label: 'Father\'s Status', type: 'select', options: [
        { value: '', label: '-- Select --' },
        { value: 'alive', label: 'Alive' },
        { value: 'deceased', label: 'Deceased' },
      ]},
      { id: 'mothers_name', label: 'Mother\'s Name', type: 'text' },
      { id: 'mothers_status', label: 'Mother\'s Status', type: 'select', options: [
        { value: '', label: '-- Select --' },
        { value: 'alive', label: 'Alive' },
        { value: 'deceased', label: 'Deceased' },
      ]},
      // Residence Details
      { id: 'parish_residence', label: 'Parish (Residence)', type: 'text' },
      { id: 'subcounty_residence', label: 'Subcounty (Residence)', type: 'text' },
      { id: 'county_residence', label: 'County (Residence)', type: 'text' },
      { id: 'district_residence', label: 'District (Residence)', type: 'text' },
      { id: 'village_residence', label: 'Village (Residence)', type: 'text' },

      // Origin Details
      { id: 'parish_origin', label: 'Parish (Origin)', type: 'text' },
      { id: 'subcounty_origin', label: 'Subcounty (Origin)', type: 'text' },
      { id: 'county_origin', label: 'County (Origin)', type: 'text' },
      { id: 'district_origin', label: 'District (Origin)', type: 'text' },
      { id: 'village_origin', label: 'Village (Origin)', type: 'text' },
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
        type: 'text', // Ensure this is a text field to display the name
        required: false 
      },
    ],
    nextOfKin: [
      { id: 'next_of_kin_name', label: 'Name', type: 'text' },
      { id: 'next_of_kin_phone', label: 'Phone', type: 'text' },
      { id: 'next_of_kin_email', label: 'Email', type: 'email' },
      { id: 'next_of_kin_dob', label: 'Date of Birth', type: 'date' },
      { id: 'next_of_kin_occupation', label: 'Occupation', type: 'text' },
      { id: 'next_of_kin_place_of_work', label: 'Place of Work', type: 'text' },
      { id: 'next_of_kin_nin', label: 'National ID Number', type: 'text' },
      { id: 'next_of_kin_office_address', label: 'Office Address', type: 'text' },
      { id: 'next_of_kin_home_address', label: 'Home Address', type: 'text' },
      { id: 'next_of_kin_physical_address', label: 'Physical Address', type: 'text' },
      { id: 'next_of_kin_relations', label: 'Relations', type: 'text' },
    ],
    qualificationDetails: [
      { id: 'award', label: 'Award', type: 'text', required: true },
      { id: 'class', label: 'Class', type: 'text', required: true },
      { id: 'year_of_award', label: 'Year of Award', type: 'number', required: true },
      { id: 'start_date', label: 'Start Date', type: 'date', required: true },
      { id: 'end_date', label: 'End Date', type: 'date', required: true },
      { id: 'institution', label: 'Institution', type: 'text', required: true },
      { id: 'course', label: 'Course', type: 'text', required: true },
      { id: 'is_proof_of_award', label: 'Proof of Award', type: 'checkbox' },
      { id: 'is_proof_of_transcripts', label: 'Proof of Transcripts', type: 'checkbox' },
    ],
    dependantDetails: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'gender', label: 'Gender', type: 'select', required: true, options: [
        { value: '', label: '-- Select --' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ]},
      { id: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { id: 'contact', label: 'Contact', type: 'text', required: true },
      { id: 'relationship', label: 'Relationship', type: 'text', required: true },
      { id: 'is_medical_applicable', label: 'Medical Applicable', type: 'checkbox' },
    ],
    workHistory: [
      { id: 'company_name', label: 'Company Name', type: 'text', required: true },
      { id: 'business_type', label: 'Business Type', type: 'text', required: true },
      { id: 'last_designation', label: 'Last Designation', type: 'text', required: true },
      { id: 'start_date', label: 'Start Date', type: 'date', required: true },
      { id: 'end_date', label: 'End Date', type: 'date', required: true },
      { id: 'reason_for_exit', label: 'Reason for Exit', type: 'text', required: true },
    ],
    refereeDetails: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'position', label: 'Position', type: 'text', required: true },
      { id: 'address', label: 'Address', type: 'text', required: true },
      { id: 'phone', label: 'Phone', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
    ],
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
