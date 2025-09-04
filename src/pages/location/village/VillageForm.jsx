import React, { useState, useEffect, useMemo } from "react";
import FilterBox from "../../../components/ui/FilterBox";
import Button from "../../../components/ui/Button";
import { useSelector } from "react-redux";

const VillageForm = ({ onSubmit, initialData = null, onCancel, isModal = false, isEditing = false }) => {
  const districts = useSelector((state) => state.districts?.allDistricts || []);
  const counties = useSelector((state) => state.counties?.allCounties || []);
  const subCounties = useSelector((state) => state.subCounties?.allSubCounties || []);
  const parishes = useSelector((state) => state.parishes?.allParishes || []);

  const [formData, setFormData] = useState({
    short_code: initialData?.short_code || "",
    name: initialData?.name || "",
    parish_id: initialData?.parish_id || initialData?.parish?.id || "",
    subcounty_id: initialData?.parish?.subcounty_id || initialData?.parish?.subcounty?.id || "",
    county_id: initialData?.parish?.subcounty?.county_id || initialData?.parish?.subcounty?.county?.id || "",
    district_id: initialData?.parish?.subcounty?.county?.district_id || initialData?.parish?.subcounty?.county?.district?.id || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      short_code: initialData?.short_code || "",
      name: initialData?.name || "",
      parish_id: initialData?.parish_id || initialData?.parish?.id || "",
      subcounty_id: initialData?.parish?.subcounty_id || initialData?.parish?.subcounty?.id || "",
      county_id: initialData?.parish?.subcounty?.county_id || initialData?.parish?.subcounty?.county?.id || "",
      district_id: initialData?.parish?.subcounty?.county?.district_id || initialData?.parish?.subcounty?.county?.district?.id || "",
    });
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "district_id") {
      setFormData((prev) => ({ ...prev, district_id: value, county_id: "", subcounty_id: "", parish_id: "" }));
    } else if (name === "county_id") {
      setFormData((prev) => ({ ...prev, county_id: value, subcounty_id: "", parish_id: "" }));
    } else if (name === "subcounty_id") {
      setFormData((prev) => ({ ...prev, subcounty_id: value, parish_id: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const availableCounties = useMemo(() => counties.filter(c => String(c.district_id) === String(formData.district_id)), [counties, formData.district_id]);
  const availableSubCounties = useMemo(() => subCounties.filter(sc => String(sc.county_id) === String(formData.county_id)), [subCounties, formData.county_id]);
  const availableParishes = useMemo(() => parishes.filter(p => String(p.subcounty_id) === String(formData.subcounty_id)), [parishes, formData.subcounty_id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.short_code.toString().trim()) newErrors.short_code = "Short code is required.";
    if (!formData.name.toString().trim()) newErrors.name = "Village name is required.";
    if (!formData.parish_id) newErrors.parish_id = "Parish is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await onSubmit({ short_code: formData.short_code, name: formData.name, parish_id: formData.parish_id });
    setIsSubmitting(false);
  };

  if (isModal) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="short_code" className="block text-sm font-medium text-gray-700">Short Code <span className="text-red-500">*</span></label>
          <input id="short_code" name="short_code" value={formData.short_code} onChange={handleChange} required className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm ${errors.short_code ? 'border-red-500' : ''}`} />
          {errors.short_code && <p className="mt-1 text-sm text-red-600">{errors.short_code}</p>}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Village Name <span className="text-red-500">*</span></label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} required className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm ${errors.name ? 'border-red-500' : ''}`} />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="district_id" className="block text-sm font-medium text-gray-700">District</label>
          <select id="district_id" name="district_id" value={formData.district_id} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md sm:text-sm">
            <option value="">Select district</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="county_id" className="block text-sm font-medium text-gray-700">County</label>
          <select id="county_id" name="county_id" value={formData.county_id} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md sm:text-sm">
            <option value="">Select county</option>
            {availableCounties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="subcounty_id" className="block text-sm font-medium text-gray-700">Sub-County</label>
          <select id="subcounty_id" name="subcounty_id" value={formData.subcounty_id} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md sm:text-sm">
            <option value="">Select sub-county</option>
            {availableSubCounties.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="parish_id" className="block text-sm font-medium text-gray-700">Parish <span className="text-red-500">*</span></label>
          <select id="parish_id" name="parish_id" value={formData.parish_id} onChange={handleChange} className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md sm:text-sm ${errors.parish_id ? 'border-red-500' : ''}`}>
            <option value="">Select parish</option>
            {availableParishes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {errors.parish_id && <p className="mt-1 text-sm text-red-600">{errors.parish_id}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="pride" disabled={isSubmitting}>{isEditing ? "Update Village" : "Create Village"}</Button>
        </div>
      </form>
    );
  }

  // non-modal: keep simple FilterBox placeholder (list manages filters)
  return <FilterBox title="Village" filters={[]} buttons={[]} />;
};

export default VillageForm;