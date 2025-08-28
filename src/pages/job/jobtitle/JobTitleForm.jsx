import React, { useState } from "react";
import FilterBox from "../../../components/ui/FilterBox";
import Button from "../../../components/ui/Button";

const JobTitleForm = ({ section, onSubmit, initialData = null, onCancel, isModal, isEditing }) => {
  const [formData, setFormData] = useState({
    short_code: initialData?.short_code || "",
    name: initialData?.name || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.short_code.trim()) newErrors.short_code = "Short code is required.";
    if (!formData.name.trim()) newErrors.name = "Job title name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      onSubmit(formData);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (isModal) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="short_code" className="block text-sm font-medium text-gray-700">
              Short Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="short_code"
              name="short_code"
              value={formData.short_code}
              onChange={handleChange}
              required
              className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.short_code ? 'border-red-500' : ''}`}
            />
            {errors.short_code && <p className="mt-1 text-sm text-red-600">{errors.short_code}</p>}
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Job Title Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="pride"
            disabled={isSubmitting}
            className="px-4"
          >
            {isEditing ? "Update Job Title" : "Create Job Title"}
          </Button>
        </div>
      </form>
    );
  }

  const filters = [
    { 
      id: "short_code", 
      label: "Short Code", 
      type: "text", 
      value: formData.short_code, 
      onChange: handleChange, 
      name: "short_code",
      required: true,
      error: errors.short_code 
    },
    { 
      id: "name", 
      label: "Job Title Name", 
      type: "text", 
      value: formData.name, 
      onChange: handleChange, 
      name: "name",
      required: true,
      error: errors.name 
    },
  ];

  const buttons = [
    { 
      label: isEditing ? "Update" : "Save", 
      variant: "pride", 
      onClick: handleSubmit, 
      type: "submit",
      disabled: isSubmitting 
    },
    { 
      label: "Cancel", 
      variant: "secondary", 
      onClick: handleCancel,
      disabled: isSubmitting 
    },
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

export default JobTitleForm;