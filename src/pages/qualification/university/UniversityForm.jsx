import React, { useState } from 'react';
import FilterBox from '../../../components/ui/FilterBox';

const UniversityForm = ({ section, onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState({
    short_code: initialData.short_code || '',
    name: initialData.name || '',
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
    { id: 'short_code', label: 'Short Code', type: 'text', value: formData.short_code, onChange: handleChange },
    { id: 'name', label: 'University Name', type: 'text', value: formData.name, onChange: handleChange },
  ];

  const buttons = [
    { label: 'Save', variant: 'pride', onClick: handleSubmit, type: 'submit' },
    { label: 'Cancel', variant: 'secondary', onClick: handleCancel },
  ];

  return (
    <FilterBox title={section} filters={filters} buttons={buttons}>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="short_code" value={formData.short_code} />
        <input type="hidden" name="name" value={formData.name} />
      </form>
    </FilterBox>
  );
};

export default UniversityForm;