import React, { useState, useEffect } from "react";
import { useToast } from "../../../hooks/useToast";
import Button from "../../../components/ui/Button";
import useUserSearch from "../../../hooks/agreements/useUserSearch";
import SearchableCombobox from "../../../components/ui/SearchableCombobox";

const AppraisalForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isModal = false,
  isEditing = false,
  agreements = [], // Assuming agreements are passed as props
}) => {
  const { toast } = useToast();
  const {
    searchResults,
    loading: searchLoading,
    hasMore,
    searchUsers,
    loadMoreUsers,
  } = useUserSearch();

  const [formData, setFormData] = useState({
    agreement_id: "",
    type: "",
  });
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [supervisor, setSupervisor] = useState(null);
  const [hod, setHod] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        agreement_id: initialData.agreement_id || "",
        type: initialData.type || "",
      });
      if (initialData.agreement_id) {
        const agreement = agreements.find(
          (a) => a.id == initialData.agreement_id
        );
        setSelectedAgreement(agreement);
      }
      if (initialData.supervisor) {
        setSupervisor(initialData.supervisor);
      }
      if (initialData.hod) {
        setHod(initialData.hod);
      }
    }
  }, [initialData, agreements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAgreementChange = (e) => {
    const agreementId = e.target.value;
    const agreement = agreements.find((a) => a.id == agreementId);
    setSelectedAgreement(agreement);
    setFormData((prev) => ({
      ...prev,
      agreement_id: agreementId,
      type: agreement?.period === "probation" ? "probation" : prev.type,
    }));
    if (!isEditing && agreement) {
      setSupervisor(agreement.supervisor);
      setHod(agreement.hod);
    }
    if (errors.agreement_id) {
      setErrors((prev) => ({ ...prev, agreement_id: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.agreement_id)
      newErrors.agreement_id = "Please select a performance agreement.";
    if (!formData.type) newErrors.type = "Please select an appraisal type.";
    if (isEditing && !supervisor)
      newErrors.supervisor = "Supervisor selection is required.";
    if (isEditing && !hod) newErrors.hod = "HOD selection is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const composePerformanceMeasuresPayload = () => {
    if (isEditing && initialData?.performance_measures?.length) {
      return initialData.performance_measures.map((measure) => ({
        performance_measure_id: measure.performance_measure_id ?? measure.id,
        self_rating: measure.self_rating ?? null,
        actual_value: measure.actual_value ?? null,
        employee_comments: measure.employee_comments ?? "",
      }));
    }

    if (selectedAgreement?.performance_measures?.length) {
      return selectedAgreement.performance_measures.map((measure) => ({
        performance_measure_id: measure.id,
        self_rating: null,
        actual_value: null,
        employee_comments: "",
      }));
    }

    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const submissionData = {
        agreement_id: formData.agreement_id,
        type: formData.type,
        employee_comments: initialData?.employee_comments ?? "",
        performance_measures: composePerformanceMeasuresPayload(),
      };
      if (isEditing) {
        submissionData.supervisor_id = supervisor?.id;
        submissionData.hod_id = hod?.id;
      }
      try {
        await onSubmit(submissionData);
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
            onChange={handleAgreementChange}
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

        {selectedAgreement && (
          <>
            {selectedAgreement.period === "annual" ? (
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Appraisal Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.type ? "border-red-500" : ""
                  }`}
                >
                  <option value="">-- Select Type --</option>
                  <option value="mid_term">Mid-Term Review</option>
                  <option value="annual">Annual Review</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>
            ) : selectedAgreement.period === "probation" ? (
              <div className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm sm:text-sm">
                Probation Review
                <input type="hidden" name="type" value="probation" />
              </div>
            ) : null}
          </>
        )}

        {isEditing && (
          <>
            <SearchableCombobox
              label="Supervisor"
              options={searchResults}
              selected={supervisor}
              onChange={setSupervisor}
              onSearch={searchUsers}
              onLoadMore={loadMoreUsers}
              hasMore={hasMore}
              loading={searchLoading}
              placeholder="Type to search for a supervisor..."
              error={errors.supervisor}
            />

            <SearchableCombobox
              label="HOD / Line Manager"
              options={searchResults}
              selected={hod}
              onChange={setHod}
              onSearch={searchUsers}
              onLoadMore={loadMoreUsers}
              hasMore={hasMore}
              loading={searchLoading}
              placeholder="Type to search for a HOD..."
              error={errors.hod}
            />
          </>
        )}

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
