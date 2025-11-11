import React, { useState, useEffect } from "react";
import { useToast } from "../../../hooks/useToast";
import Button from "../../../components/ui/Button";

const AppraisalForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isModal = false,
  isEditing = false,
  agreements = [], // Assuming agreements are passed as props
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    agreement_id: "",
    period: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        agreement_id: initialData.agreement_id || "",
        period: initialData.period || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.agreement_id)
      newErrors.agreement_id = "Performance Agreement is required.";
    if (!formData.period) newErrors.period = "Period is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        // Error is handled by the parent component
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted errors.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-5">
        <div>
          <label
            htmlFor="agreement_id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Performance Agreement <span className="text-red-500">*</span>
          </label>
          <select
            id="agreement_id"
            name="agreement_id"
            value={formData.agreement_id}
            onChange={handleChange}
            className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              errors.agreement_id ? "border-red-500" : ""
            }`}
          >
            <option value="">-- Select Agreement --</option>
            {agreements.map((agreement) => (
              <option key={agreement.id} value={agreement.id}>
                {agreement.name}
              </option>
            ))}
          </select>
          {errors.agreement_id && (
            <p className="mt-1 text-sm text-red-600">{errors.agreement_id}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="period"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Period <span className="text-red-500">*</span>
          </label>
          <select
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              errors.period ? "border-red-500" : ""
            }`}
          >
            <option value="">-- Select Period --</option>
            <option value="mid-year">Mid-year Review</option>
            <option value="annual">Annual Review</option>
            <option value="probation">Probation 6 months</option>
          </select>
          {errors.period && (
            <p className="mt-1 text-sm text-red-600">{errors.period}</p>
          )}
        </div>

        <div
          className={`flex ${
            isModal ? "justify-end" : "justify-start"
          } space-x-3 pt-6`}
        >
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
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
            {isEditing ? "Update Appraisal" : "Create Appraisal"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AppraisalForm;
