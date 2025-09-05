import React, { useState, useEffect } from "react";
import FilterBox from "../../../components/ui/FilterBox";
import Button from "../../../components/ui/Button";

const TribeForm = ({ onSubmit, initialData = null, onCancel, isModal = false, isEditing = false }) => {
  const [formData, setFormData] = useState({
    short_code: initialData?.short_code || "",
    name: initialData?.name || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      short_code: initialData?.short_code || "",
      name: initialData?.name || "",
    });
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.short_code.toString().trim()) newErrors.short_code = "Short code is required.";
    if (!formData.name.toString().trim()) newErrors.name = "Tribe name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await onSubmit({ short_code: formData.short_code, name: formData.name });
    setIsSubmitting(false);
  };

  if (isModal) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="short_code" className="block text-sm font-medium text-gray-700">Short Code</label>
          <input id="short_code" name="short_code" value={formData.short_code} onChange={handleChange} className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md sm:text-sm ${errors.short_code ? 'border-red-500' : ''}`} />
          {errors.short_code && <p className="mt-1 text-sm text-red-600">{errors.short_code}</p>}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tribe Name</label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md sm:text-sm ${errors.name ? 'border-red-500' : ''}`} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="pride" disabled={isSubmitting}>{isEditing ? "Update Tribe" : "Create Tribe"}</Button>
        </div>
      </form>
    );
  }

  return <FilterBox title="Tribe" filters={[]} buttons={[]} />;
};

export default TribeForm;
