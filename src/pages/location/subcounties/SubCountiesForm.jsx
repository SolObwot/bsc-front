import React, { useState, useEffect, useMemo } from "react";
import FilterBox from "../../../components/ui/FilterBox";
import Button from "../../../components/ui/Button";
import { useSelector } from "react-redux";

const SubCountiesForm = ({ onSubmit, initialData = null, onCancel, isModal = false, isEditing = false }) => {
  const districts = useSelector((state) => state.districts?.allDistricts || []);
  const counties = useSelector((state) => state.counties?.allCounties || []);
  const [formData, setFormData] = useState({
    short_code: initialData?.short_code || "",
    name: initialData?.name || "",
    county_id: initialData?.county_id || initialData?.county?.id || "",
    district_id: initialData?.county?.district_id || initialData?.county?.district?.id || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      short_code: initialData?.short_code || "",
      name: initialData?.name || "",
      county_id: initialData?.county_id || initialData?.county?.id || "",
      district_id: initialData?.county?.district_id || initialData?.county?.district?.id || "",
    });
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // if district changed, clear county_id
    if (name === "district_id") {
      setFormData(prev => ({ ...prev, district_id: value, county_id: "" }));
      if (errors.county_id) setErrors(prev => ({ ...prev, county_id: null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const availableCounties = useMemo(() => {
    return counties.filter(c => String(c.district_id) === String(formData.district_id));
  }, [counties, formData.district_id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.short_code.toString().trim()) newErrors.short_code = "Short code is required.";
    if (!formData.name.toString().trim()) newErrors.name = "Sub-County name is required.";
    if (!formData.county_id) newErrors.county_id = "County is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // submit only the expected fields (county_id,name,short_code)
    await onSubmit({ short_code: formData.short_code, name: formData.name, county_id: formData.county_id });
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Sub-County Name <span className="text-red-500">*</span></label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} required className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.name ? 'border-red-500' : ''}`} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="district_id" className="block text-sm font-medium text-gray-700">District <span className="text-red-500">*</span></label>
          <select id="district_id" name="district_id" value={formData.district_id} onChange={handleChange} className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm`}>
            <option value="">Select district</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="county_id" className="block text-sm font-medium text-gray-700">County <span className="text-red-500">*</span></label>
          <select id="county_id" name="county_id" value={formData.county_id} onChange={handleChange} className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm sm:text-sm ${errors.county_id ? 'border-red-500' : ''}`}>
            <option value="">Select county</option>
            {availableCounties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.county_id && <p className="mt-1 text-sm text-red-600">{errors.county_id}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="pride" disabled={isSubmitting}>{isEditing ? "Update Sub-County" : "Create Sub-County"}</Button>
        </div>
      </form>
    );
  }

  // non-modal: FilterBox with dynamic filters for district -> county
  const filters = [
    { id: "filterText", label: "Sub-County Name", type: "search", value: "", onChange: () => {} }, // parent FilterBox wiring in list
  ];

  return (
    <FilterBox title="Sub-County" filters={filters} buttons={[]}>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="short_code" value={formData.short_code} />
        <input type="hidden" name="name" value={formData.name} />
        <input type="hidden" name="county_id" value={formData.county_id} />
      </form>
    </FilterBox>
  );
};

export default SubCountiesForm;
