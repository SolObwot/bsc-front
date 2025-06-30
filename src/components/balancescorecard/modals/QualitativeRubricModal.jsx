import React, { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import { performanceMeasureService } from "../../../services/performanceMeasure.service";
import { useToast } from "../../../hooks/useToast";

const defaultLevels = [
  { level: 1, label: "", description: "" },
  { level: 2, label: "", description: "" },
  { level: 3, label: "", description: "" },
  { level: 4, label: "", description: "" },
  { level: 5, label: "", description: "" },
];

const QualitativeRubricModal = ({
  isOpen,
  closeModal,
  performanceMeasureId,
  initialLevels = [],
  onSave,
}) => {
  const { toast } = useToast();
  const [levels, setLevels] = useState(defaultLevels);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialLevels && initialLevels.length > 0) {
      setLevels(
        [1, 2, 3, 4, 5].map((lvl) => {
          const found = initialLevels.find((l) => l.level === lvl);
          return (
            found || { level: lvl, label: "", description: "" }
          );
        })
      );
    } else {
      setLevels(defaultLevels);
    }
  }, [initialLevels, isOpen]);

  const handleChange = (idx, field, value) => {
    setLevels((prev) =>
      prev.map((l, i) =>
        i === idx ? { ...l, [field]: value } : l
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = levels.map((l) => ({
        ...l,
        performance_measure_id: performanceMeasureId,
      }));
      await performanceMeasureService.addQualitativeLevels(payload);
      toast({
        title: "Success",
        description: "Qualitative rubric saved.",
      });
      onSave && onSave(payload);
      closeModal();
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to save rubric.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Edit Qualitative Rubric"
      footer={
        <>
          <button
            onClick={closeModal}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex justify-center rounded-md border border-teal-600 bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Rubric"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {levels.map((level, idx) => (
          <div key={level.level} className="flex flex-col gap-2 border-b pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-teal-700">Level {level.level}</span>
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                placeholder="Label"
                value={level.label}
                onChange={(e) => handleChange(idx, "label", e.target.value)}
              />
            </div>
            <textarea
              className="border rounded px-2 py-1 w-full"
              placeholder="Description"
              value={level.description}
              onChange={(e) => handleChange(idx, "description", e.target.value)}
              rows={2}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default QualitativeRubricModal;