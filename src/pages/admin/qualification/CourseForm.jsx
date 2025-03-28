import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const CourseForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ shortCode: '', name: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log('Form submitted:', formData);
    navigate('/admin/qualification/course');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Add/Edit Course</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="shortCode" className="block text-sm font-medium text-gray-700">
            Short Code
          </label>
          <input
            type="text"
            id="shortCode"
            name="shortCode"
            value={formData.shortCode}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/qualification/course')}>
            Cancel
          </Button>
          <Button type="submit" variant="pride" className="ml-2">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
