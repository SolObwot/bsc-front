import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { fetchMyAgreements } from "../../../redux/agreementSlice";
import { useToast } from "../../../hooks/useToast";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { Select, Label } from "../../../components/ui/FormControls";

const StartAppraisalModal = ({ isOpen, closeModal, onSubmit, agreementId }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [selectedAgreementId, setSelectedAgreementId] = useState(
    agreementId || ""
  );
  const [appraisalType, setAppraisalType] = useState("");
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // We only want to fetch agreements if they are not passed via a direct action
      if (!agreementId) {
        dispatch(fetchMyAgreements())
          .unwrap()
          .then((fetchedAgreements) => {
            const currentYear = new Date().getFullYear();
            const approvedAgreements = fetchedAgreements.filter(
              (a) =>
                a.status === "approved" &&
                new Date(a.created_at).getFullYear() === currentYear
            );
            setAgreements(approvedAgreements);
          })
          .catch(() => {
            toast({
              title: "Error",
              description: "Could not fetch approved agreements.",
              variant: "destructive",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // If an agreement is passed, we can just use it
        // This assumes the parent component (AgreementList) has the full agreement object
        // For simplicity, we will still fetch to ensure we have the latest data.
        dispatch(fetchMyAgreements())
          .unwrap()
          .then((fetchedAgreements) => {
            setAgreements(
              fetchedAgreements.filter((a) => a.status === "approved")
            );
            setSelectedAgreementId(agreementId);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [isOpen, dispatch, toast, agreementId]);

  const selectedAgreement = useMemo(() => {
    return agreements.find(
      (a) => a.id.toString() === selectedAgreementId.toString()
    );
  }, [selectedAgreementId, agreements]);

  const appraisalTypeOptions = useMemo(() => {
    if (!selectedAgreement) return [];
    if (selectedAgreement.period === "annual") {
      return [
        { value: "mid_term", label: "Mid-Term Review" },
        { value: "annual", label: "Annual Review" },
      ];
    }
    if (selectedAgreement.period === "probation") {
      return [{ value: "probation", label: "Probation Review" }];
    }
    return [];
  }, [selectedAgreement]);

  useEffect(() => {
    if (selectedAgreement) {
      if (selectedAgreement.period === "probation") {
        setAppraisalType("probation");
      } else {
        // Reset type when agreement changes, unless it's probation
        setAppraisalType("");
      }
    } else {
      setAppraisalType("");
    }
  }, [selectedAgreement]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAgreementId || !appraisalType) {
      toast({
        title: "Missing Information",
        description: "Please select an agreement and appraisal type.",
        variant: "destructive",
      });
      return;
    }
    onSubmit({
      agreement_id: parseInt(selectedAgreementId, 10),
      type: appraisalType,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      title="Start New Performance Appraisal"
    >
      <form onSubmit={handleSubmit}>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="agreement">Performance Agreement</Label>
            <Select
              id="agreement"
              value={selectedAgreementId}
              onChange={(e) => setSelectedAgreementId(e.target.value)}
              disabled={loading || !!agreementId}
            >
              <option value="">
                {loading ? "Loading agreements..." : "-- Select Agreement --"}
              </option>
              {agreements.map((agreement) => (
                <option key={agreement.id} value={agreement.id}>
                  {agreement.name || agreement.title}
                </option>
              ))}
            </Select>
          </div>

          {selectedAgreement && (
            <div>
              <Label htmlFor="appraisalType">Appraisal Type</Label>
              <Select
                id="appraisalType"
                value={appraisalType}
                onChange={(e) => setAppraisalType(e.target.value)}
                disabled={selectedAgreement.period === "probation"}
              >
                <option value="">-- Select Type --</option>
                {appraisalTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit" variant="pride" disabled={loading}>
            Start Appraisal
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StartAppraisalModal;
