import React, { useState } from "react";
import Button from "../../../components/ui/Button";

const JobOrScaleForm = ({ onSubmit, initialData = null, onCancel, isModal, isEditing }) => {
  const [formData, setFormData] = useState({
    short_code: initialData?.short_code || "",
    name: initialData?.name || "",
    notch: initialData?.notch || "",
    sub_notch: initialData?.sub_notch || "",
    basic_pay: initialData?.basic_pay || "",
    basic_pay_to: initialData?.basic_pay_to || "",
    annual_leave: initialData?.annual_leave || "",
    carry_forward: initialData?.carry_forward || "",
    next_higher: initialData?.next_higher || "",
    percentile: initialData?.percentile || "",
    position: initialData?.position || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.short_code.trim()) newErrors.short_code = "Short code is required.";
    if (!formData.name.trim()) newErrors.name = "Name is required.";
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
            Name <span className="text-red-500">*</span>
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
        {/* Add other fields similarly */}
        <div>
          <label htmlFor="notch" className="block text-sm font-medium text-gray-700">Notch</label>
          <input type="text" name="notch" id="notch" value={formData.notch} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="sub_notch" className="block text-sm font-medium text-gray-700">Sub Notch</label>
          <input type="text" name="sub_notch" id="sub_notch" value={formData.sub_notch} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="basic_pay" className="block text-sm font-medium text-gray-700">Basic Pay</label>
          <input type="text" name="basic_pay" id="basic_pay" value={formData.basic_pay} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="basic_pay_to" className="block text-sm font-medium text-gray-700">Basic Pay To</label>
          <input type="text" name="basic_pay_to" id="basic_pay_to" value={formData.basic_pay_to} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="annual_leave" className="block text-sm font-medium text-gray-700">Annual Leave</label>
          <input type="text" name="annual_leave" id="annual_leave" value={formData.annual_leave} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="carry_forward" className="block text-sm font-medium text-gray-700">Carry Forward</label>
          <input type="text" name="carry_forward" id="carry_forward" value={formData.carry_forward} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="next_higher" className="block text-sm font-medium text-gray-700">Next Higher</label>
          <input type="text" name="next_higher" id="next_higher" value={formData.next_higher} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="percentile" className="block text-sm font-medium text-gray-700">Percentile</label>
          <input type="text" name="percentile" id="percentile" value={formData.percentile} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
          <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md" />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSubmitting} className="px-4">Cancel</Button>
        <Button type="submit" variant="pride" disabled={isSubmitting} className="px-4">
          {isEditing ? "Update Grade/Scale" : "Create Grade/Scale"}
        </Button>
      </div>
    </form>
  );
};

export default JobOrScaleForm;