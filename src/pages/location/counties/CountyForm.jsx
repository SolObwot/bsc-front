import React, { useState, useEffect } from "react";
import FilterBox from "../../../components/ui/FilterBox";
import Button from "../../../components/ui/Button";
import { useSelector } from "react-redux";

const CountyForm = ({ onSubmit, initialData = null, onCancel, isModal = false, isEditing = false }) => {
  const districts = useSelector((state) => state.districts?.allDistricts || []);
  const [formData, setFormData] = useState({
    short_code: initialData?.short_code || "",
    name: initialData?.name || "",
    district_id: initialData?.district_id || initialData?.district?.id || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      short_code: initialData?.short_code || "",
      name: initialData?.name || "",
      district_id: initialData?.district_id || initialData?.district?.id || "",
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
    if (!formData.name.toString().trim()) newErrors.name = "County name is required.";
    if (!formData.district_id) newErrors.district_id = "District is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  if (isModal) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="short_code" className="block text-sm font-medium text-gray-700">Short Code <span className="text-red-500">*</span></label>
          <input id="short_code" name="short_code" value={formData.short_code} onChange={handleChange} required className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.short_code ? 'border-red-500' : ''}`} />
          {errors.short_code && <p className="mt-1 text-sm text-red-600">{errors.short_code}</p>}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">County Name <span className="text-red-500">*</span></label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} required className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.name ? 'border-red-500' : ''}`} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="district_id" className="block text-sm font-medium text-gray-700">District <span className="text-red-500">*</span></label>
          <select id="district_id" name="district_id" value={formData.district_id} onChange={handleChange} className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm ${errors.district_id ? 'border-red-500' : ''}`}>
            <option value="">Select district</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          {errors.district_id && <p className="mt-1 text-sm text-red-600">{errors.district_id}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="pride" disabled={isSubmitting}>{isEditing ? "Update County" : "Create County"}</Button>
        </div>
      </form>
    );
  }

  // non-modal: render as FilterBox to match Relation/District UX
  const filters = [
    { id: "short_code", label: "Short Code", type: "text", value: formData.short_code, onChange: (e) => handleChange({ target: { name: "short_code", value: e.target.value } }), name: "short_code", required: true, error: errors.short_code },
    { id: "name", label: "County Name", type: "text", value: formData.name, onChange: (e) => handleChange({ target: { name: "name", value: e.target.value } }), name: "name", required: true, error: errors.name },
    { id: "district_id", label: "District", type: "select", value: formData.district_id, onChange: (e) => handleChange({ target: { name: "district_id", value: e.target.value } }), name: "district_id", options: districts.map(d => ({ value: d.id, label: d.name })), required: true, error: errors.district_id },
  ];

  const buttons = [
    { label: isEditing ? "Update" : "Save", variant: "pride", onClick: handleSubmit, type: "submit", disabled: isSubmitting },
    { label: "Cancel", variant: "secondary", onClick: onCancel, disabled: isSubmitting },
  ];

  return (
    <FilterBox title="County" filters={filters} buttons={buttons}>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="short_code" value={formData.short_code} />
        <input type="hidden" name="name" value={formData.name} />
        <input type="hidden" name="district_id" value={formData.district_id} />
      </form>
    </FilterBox>
  );
};

export default CountyForm;
