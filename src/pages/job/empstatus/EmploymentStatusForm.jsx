import React, { useState } from "react";
import FilterBox from "../../../components/ui/FilterBox";
import Button from "../../../components/ui/Button";

const EmploymentStatusForm = ({ onSubmit, initialData = null, onCancel, isModal, isEditing }) => {
  const [formData, setFormData] = useState({
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
    if (!formData.name.trim()) newErrors.name = "Status name is required.";
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
    if (onCancel) onCancel();
  };

  if (isModal) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Status Name <span className="text-red-500">*</span>
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
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="pride" disabled={isSubmitting}>
            {isEditing ? "Update Status" : "Create Status"}
          </Button>
        </div>
      </form>
    );
  }

  const filters = [
    {
      id: "name",
      label: "Status Name",
      type: "text",
      value: formData.name,
      onChange: handleChange,
      name: "name",
      required: true,
      error: errors.name,
    },
  ];

  const buttons = [
    {
      label: isEditing ? "Update" : "Save",
      variant: "pride",
      onClick: handleSubmit,
      type: "submit",
      disabled: isSubmitting,
    },
    {
      label: "Cancel",
      variant: "secondary",
      onClick: handleCancel,
      disabled: isSubmitting,
    },
  ];

  return (
    <FilterBox title="Employment Status" filters={filters} buttons={buttons}>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="name" value={formData.name} />
      </form>
    </FilterBox>
  );
};

export default EmploymentStatusForm;