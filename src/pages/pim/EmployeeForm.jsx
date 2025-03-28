import React, { useState, useEffect } from 'react';
import FilterBox from '../../components/ui/FilterBox';
import SensitiveData from '../../components/ui/SensitiveData';

const EmployeeForm = ({ section, onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState(() => {
    const initialFormData = {
      // Personal Details
      surname: initialData?.surname || 'N/A',
      last_name: initialData?.last_name || 'N/A',
      other_name: initialData?.other_name || 'N/A', 
      email: initialData?.email || 'N/A',
      username: initialData?.username || 'N/A',
      staff_number: initialData?.staff_number || 'N/A',
      dob: initialData?.dob || 'N/A',
      gender: initialData?.gender || 'N/A',
      nin: initialData?.nin || 'N/A',
      place_of_birth: initialData?.place_of_birth?.name || initialData?.place_of_birth || 'N/A',
      religion: initialData?.religion || 'N/A',
      tribe: initialData?.tribe || 'N/A',
      marital_status: initialData?.marital_status || 'N/A',
      status: initialData?.status || 'N/A', 
      blood_group: initialData?.blood_group || 'N/A',
    
      // Family & Other Details
      personal_email: initialData?.contact_details?.[0]?.personal_email || 'N/A', 
      fathers_name: initialData?.fathers_name || 'N/A',
      fathers_status: initialData?.fathers_status || 'N/A',
      mothers_name: initialData?.mothers_name || 'N/A',
      mothers_status: initialData?.mothers_status || 'N/A',
      phone: initialData?.contact_details?.[0]?.phone || 'N/A', 

      // Residence & Origin (nested objects)
      parish_residence: initialData?.parish_residence?.name || initialData?.parish_residence || 'N/A',
      parish_origin: initialData?.parish_origin?.name || initialData?.parish_origin || 'N/A',
      subcounty_residence: initialData?.subcounty_residence?.name || initialData?.subcounty_residence || 'N/A',
      subcounty_origin: initialData?.subcounty_origin?.name || initialData?.subcounty_origin || 'N/A',
      county_residence: initialData?.county_residence?.name || initialData?.county_residence || 'N/A',
      county_origin: initialData?.county_origin?.name || initialData?.county_origin || 'N/A',
      district_residence: initialData?.district_residence?.name || initialData?.district_residence || 'N/A',
      district_origin: initialData?.district_origin?.name || initialData?.district_origin || 'N/A',
      village_residence: initialData?.village_residence?.name || initialData?.village_residence || 'N/A',
      village_origin: initialData?.village_origin?.name || initialData?.village_origin || 'N/A',
    
      // Contact Details (handles multiple records)
      emergency_contact_name: initialData?.contact_details?.[0]?.emergency_contact_name || 'N/A',
      emergency_contact_phone: initialData?.contact_details?.[0]?.emergency_contact_phone || 'N/A',
      emergency_contact_relations: initialData?.contact_details?.[0]?.emergency_contact_relations?.name || 'N/A',
    
      // Next of Kin (from contact_details)
      next_of_kin_name: initialData?.contact_details?.[0]?.next_of_kin_name || 'N/A',
      next_of_kin_phone: initialData?.contact_details?.[0]?.next_of_kin_phone || 'N/A',
      next_of_kin_email: initialData?.contact_details?.[0]?.next_of_kin_email || 'N/A',
      next_of_kin_dob: initialData?.contact_details?.[0]?.next_of_kin_dob || 'N/A',
      next_of_kin_occupation: initialData?.contact_details?.[0]?.next_of_kin_occupation || 'N/A',
      next_of_kin_place_of_work: initialData?.contact_details?.[0]?.next_of_kin_place_of_work || 'N/A',
      next_of_kin_nin: initialData?.contact_details?.[0]?.next_of_kin_nin || 'N/A',
      next_of_kin_office_address: initialData?.contact_details?.[0]?.next_of_kin_office_address || 'N/A',
      next_of_kin_home_address: initialData?.contact_details?.[0]?.next_of_kin_home_address || 'N/A',
      next_of_kin_physical_address: initialData?.contact_details?.[0]?.next_of_kin_physical_address || 'N/A',
      next_of_kin_relations: initialData?.contact_details?.[0]?.next_of_kin_relations?.name || 'N/A',
    
      // Employment Details (from employment_details)
      employment_category: initialData?.employment_details?.[0]?.employment_category || 'N/A',
      appointment_date: initialData?.employment_details?.[0]?.appointment_date || 'N/A',
      first_appointment_date: initialData?.employment_details?.[0]?.first_appointment_date || 'N/A',
      with_effect_from: initialData?.employment_details?.[0]?.with_effect_from || 'N/A',
      contract_period_from: initialData?.employment_details?.[0]?.contract_period_from || 'N/A',
      contract_period_to: initialData?.employment_details?.[0]?.contract_period_to || 'N/A',
      effective_period_from: initialData?.employment_details?.[0]?.effective_period_from || 'N/A',
      effective_period_to: initialData?.employment_details?.[0]?.effective_period_to || 'N/A',
      remarks: initialData?.employment_details?.[0]?.remarks || 'N/A',
      pay_type: initialData?.employment_details?.[0]?.pay_type || 'N/A',
      basic_pay: initialData?.employment_details?.[0]?.basic_pay || 'N/A',
      account_type: initialData?.employment_details?.[0]?.account_type || 'N/A',
      account_number: initialData?.employment_details?.[0]?.account_number || 'N/A',
      is_nssf: initialData?.employment_details?.[0]?.is_nssf || false,
      nssf_number: initialData?.employment_details?.[0]?.nssf_number || 'N/A',
      is_tin: initialData?.employment_details?.[0]?.is_tin || false,
      tin_number: initialData?.employment_details?.[0]?.tin_number || 'N/A',
      is_saye: initialData?.employment_details?.[0]?.is_saye || false,
      saye_number: initialData?.employment_details?.[0]?.saye_number || 'N/A',
      is_lst: initialData?.employment_details?.[0]?.is_lst || false,
      lst_pay_loc: initialData?.employment_details?.[0]?.lst_pay_loc || 'N/A',
      is_active: initialData?.employment_details?.[0]?.is_active || false,
      is_probation: initialData?.employment_details?.[0]?.is_probation || false,
      probation_period: initialData?.employment_details?.[0]?.probation_period || 'N/A',
      confirm_date: initialData?.employment_details?.[0]?.confirm_date || 'N/A',
      last_transfer_date: initialData?.employment_details?.[0]?.last_transfer_date || 'N/A',
      exit_date: initialData?.employment_details?.[0]?.exit_date || 'N/A',
      employment_status: initialData?.employment_details?.[0]?.employment_status?.name || 'N/A',
      grade_or_scale: initialData?.employment_details?.[0]?.grade_or_scale?.name || 'N/A',
      notch: initialData?.employment_details?.[0]?.grade_or_scale?.notch || 'N/A',
      sub_notch: initialData?.employment_details?.[0]?.grade_or_scale?.sub_notch || 'N/A',
      department: initialData?.unit_or_branch?.department?.name || 'N/A',
      job_title: initialData?.job_title?.name || 'N/A',
      region: initialData?.unit_or_branch?.region?.name || 'N/A',
      unit_or_branch_name: initialData?.unit_or_branch?.name || 'N/A',
      unit_or_branch_type: initialData?.unit_or_branch?.type || 'N/A',

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
        institution: q.institution?.name || 'N/A',
        course: q.course?.name || 'N/A',
      })) || [],

      // Dependents
      dependents: initialData?.dependents?.map(d => ({
        id: d.id,
        name: d.name,
        gender: d.gender,
        dob: d.dob,
        contact: d.contact,
        is_medical_applicable: d.is_medical_applicable,
        relationship: d.relationship?.name || 'N/A',
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
      { id: 'staff_number', label: 'Employee ID', type: 'text'},
      { id: 'nin', label: 'National ID Number', type: 'text', required: true, sensitive: true },
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
      { id: 'tribe', label: 'Tribe', type: 'text', sensitive: true },
      { id: 'place_of_birth', label: 'Place of Birth', type: 'text' },
    ],
    otherDetails: [
      {id: 'personal_email', label:'Personal Email', type:'text'},
      {id: 'phone', label:'Phone Number', type:'text'},
      { id: 'blood_group', label: 'Blood Group', type: 'select', options: [
          { value: '', label: '-- Select --' },
          { value: 'A+', label: 'A+' },
          { value: 'A-', label: 'A-' },
          { value: 'B+', label: 'B+' },
          { value: 'B-', label: 'B-' },
          { value: 'AB+', label: 'AB+' },
          { value: 'AB-', label: 'AB-' },
          { value: 'O+', label: 'O+' },
          { value: 'O-', label: 'O-' },
        ] },
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
    employementDetails: [
      { id: 'department', label: 'Department', type: 'text', required: true },
      { id: 'job_title', label: 'Job Title', type: 'text', required: true },
      { id: 'unit_or_branch_name', label: 'Unit/Branch Name', type: 'text'},
      { id: 'unit_or_branch_type', label: 'Unit/Branch Type', type: 'text'},
      { id: 'region', label: 'Region', type: 'select', options: [
          { value: '', label: '-- Select --' },
          { value: 'Central A', label: 'Central A' },
          { value: 'Central B', label: 'Central B' },
          { value: 'Western', label: 'Western' },
          { value: 'Northern', label: 'Northern' },
          { value: 'Eastern', label: 'Eastern' },
          { value: 'Head Office', label: 'Head Office' },
        ]},
      { id: 'employment_category', label: 'Employment Category', type: 'select',  required: true,  options: [
          { value: '', label: '-- Select --' },
          { value: 'permanent', label: 'Permanent' },
          { value: 'contract', label: 'Contract' },
          { value: 'temporary', label: 'Temporary' },
          { value: 'interns', label: 'Interns' },
          { value: 'contract staff', label: 'Contract Staff' },
          { value: 'volunteers', label: 'Volunteers' },
          { value: 'research', label: 'Research' },
        ]},
      { id: 'appointment_date', label: 'Appointment Date', type: 'date', required: true },
      { id: 'first_appointment_date', label: 'First Appointment Date', type: 'date' },
      { id: 'with_effect_from', label: 'With Effect From', type: 'date' },
      { id: 'contract_period_from', label: 'Contract Period From', type: 'date' },
      { id: 'contract_period_to', label: 'Contract Period To', type: 'date' },
      { id: 'effective_period_from', label: 'Effective Period From', type: 'date' },
      { id: 'effective_period_to', label: 'Effective Period To', type: 'date' },
      { id: 'remarks', label: 'Remarks', type: 'text' },
      { id: 'pay_type', label: 'Pay Type', type: 'select', options: [
        { value: '', label: '-- Select --' },
        { value: 'credit transfer', label: 'Credit Transfer' },
      ]},
      { id: 'basic_pay', label: 'Basic Pay', type: 'text', required: true, sensitive: true },
      { id: 'account_type', label: 'Account Type', type: 'select', options: [ 
        { value: '', label: '-- Select --' },
        { value: 'savings', label: 'Savings' },
      ]},
      { id: 'account_number', label: 'Account Number', type: 'text', sensitive: true },
      { id: 'is_nssf', label: 'NSSF', type: 'checkbox' },
      { id: 'nssf_number', label: 'NSSF Number', type: 'text' },
      { id: 'is_tin', label: 'TIN', type: 'checkbox' },
      { id: 'tin_number', label: 'TIN Number', type: 'text' },
      { id: 'is_saye', label: 'SAYE', type: 'checkbox' },
      { id: 'saye_number', label: 'SAYE Number', type: 'text' },
      { id: 'is_lst', label: 'LST', type: 'checkbox' },
      { id: 'lst_pay_loc', label: 'LST Pay Location', type: 'text' },
      { id: 'is_active', label: 'Active', type: 'checkbox' },
      { id: 'is_probation', label: 'Probation', type: 'checkbox' },
      { id: 'probation_period', label: 'Probation Period', type: 'text' },
      { id: 'confirm_date', label: 'Confirmation Date', type: 'date' },
      { id: 'last_transfer_date', label: 'Last Transfer Date', type: 'date' },
      { id: 'exit_date', label: 'Exit Date', type: 'date' },
      { id: 'employment_status', label: 'Employment Status', type: 'select', options: [
          { value: '', label: '-- Select --' },
          { value: 'Active', label: 'Active' },
          { value: 'Suspended on Full Pay', label: 'Suspended on Full Pay' },
          { value: 'Suspended on Half Pay', label: 'Suspended on Half Pay' },
          { value: 'Suspended on No Pay', label: 'Suspended on No Pay' },
          { value: 'Resigned', label: 'Resigned' },
          { value: 'Retired', label: 'Retired' },
          { value: 'Terminated', label: 'Terminated' },
          { value: 'Dismissed', label: 'Dismissed' },
          { value: 'Deceased', label: 'Deceased' },
          { value: 'Absconded', label: 'Absconded' },
          { value: 'Unpaid leave', label: 'Unpaid Leave' },
          { value: 'Paid Leave', label: 'Paid Leave' },
          { value: 'Resignation Notice', label: 'Resignation Notice' },
          { value: 'Annual Leave on Half Pay', label: 'Annual Leave on Half Pay' },
          { value: 'Sick Leave on Half Pay', label: 'Sick Leave on Half Pay' },
          { value: 'Sick Leave on Quarter Pay', label: 'Sick Leave on Quarter Pay' },
          { value: 'Employee Category Changed', label: 'Employee Category Changed' },
        ] },
      { id: 'grade_or_scale', label: 'Grade or Scale', type: 'text' },
      { id: 'notch', label: 'Notch', type: 'text' },
      { id: 'sub_notch', label: 'Sub Notch', type: 'text' },
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
        value: formData[field.id], // Pass raw value as a string
        sensitive: field.sensitive || false, // Pass sensitive flag
        onChange: handleChange,
      }))}
      buttons={[
        { label: 'Save', variant: 'pride', onClick: handleSubmit, type: 'submit' },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Any additional form elements if needed */}
      </form>
    </FilterBox>
  );
};

export default EmployeeForm;
