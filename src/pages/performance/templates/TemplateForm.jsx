import React, { useState } from 'react';
import FilterBox from '../../../components/ui/FilterBox';

const TemplateForm = ({ section, onSubmit, initialData = {}, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    strategic_objective: initialData.strategic_objective || '',
    review_period: initialData.review_period || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    { id: 'name', label: 'Template Name', type: 'text', value: formData.name, onChange: handleChange },
    { id: 'strategic_objective', label: 'Strategic Objective', type: 'text', value: formData.strategic_objective, onChange: handleChange },
    {
      id: 'review_period',
      label: 'Review Period',
      type: 'select',
      value: formData.review_period,
      onChange: handleChange,
      options: [
        { value: '', label: '-- Select --' },
        { value: 'Probation 6 months', label: 'Probation 6 months' },
        { value: 'Mid Term Review', label: 'Mid Term Review' },
        { value: 'Annual Review', label: 'Annual Review' },
      ],
    },
  ];

  const buttons = [
    { label: isLoading ? 'Saving...' : 'Save', variant: 'pride', onClick: handleSubmit, type: 'submit', disabled: isLoading },
    { label: 'Cancel', variant: 'secondary', onClick: handleCancel },
  ];

  return (
    <FilterBox title={section} filters={filters} buttons={buttons}>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="name" value={formData.name} />
        <input type="hidden" name="strategic_objective" value={formData.strategic_objective} />
        <input type="hidden" name="review_period" value={formData.review_period} />
      </form>
    </FilterBox>
  );
};

export default TemplateForm;
