import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPerformanceMeasure,
  updatePerformanceMeasure,
  fetchAllPerformanceMeasuresByAgreement,
} from "../../../redux/performanceMeasureSlice";
import PerformanceIndicatorModal from "../../../components/balancescorecard/modals/PerformanceIndicatorModal";
import DeletePerformanceMeasure from "./DeletePerformanceMeasure";
import { useToast } from "../../../hooks/useToast";
import QualitativeRubricModal from "../../../components/balancescorecard/modals/QualitativeRubricModal";

const PerformanceMeasureForm = forwardRef(
  (
    {
      objectives,
      isQualitative: initialIsQualitative,
      onDataChange,
      agreementId,
    },
    ref
  ) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPerformanceMeasure, setSelectedPerformanceMeasure] =
      useState(null);
    const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
    const [rubricMeasureId, setRubricMeasureId] = useState(null);
    const [rubricInitialLevels, setRubricInitialLevels] = useState([]);
    const [isQualitativeState, setIsQualitative] = useState(
      initialIsQualitative || false
    );

    // Sync with parent's isQualitative prop
    useEffect(() => {
      setIsQualitative(initialIsQualitative || false);
    }, [initialIsQualitative]);

    const {
      loading: { create: isCreating },
    } = useSelector((state) => state.performanceMeasure);

    // Modal states
    const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);

    // Selected items for modals
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [selectedStrategicObjective, setSelectedStrategicObjective] =
      useState(null);

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndicator, setEditingIndicator] = useState(null);

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      handleIndicatorModalOpen,
      handleIndicatorEdit,
    }));

    // Open modal for add/edit
    const handleIndicatorModalOpen = (
      objective,
      strategicObjective,
      indicator = null,
      isEdit = false,
      isQual = initialIsQualitative
    ) => {
      setSelectedObjective(objective);
      setSelectedStrategicObjective(strategicObjective);
      setIsEditing(isEdit);
      setEditingIndicator(indicator);
      setIsQualitative(isQual); // Allow overriding qualitative state
      setIsIndicatorModalOpen(true);
    };

    // Edit handler
    const handleIndicatorEdit = (indicator, index, indicators) => {
      let parentObjective = null;
      let mainObjective = null;
      for (const objective of objectives) {
        for (const subObj of objective.subObjectives) {
          if (subObj.indicators.some((ind) => ind.id === indicator.id)) {
            parentObjective = subObj;
            mainObjective = objective;
            break;
          }
        }
        if (parentObjective) break;
      }
      if (parentObjective && mainObjective) {
        handleIndicatorModalOpen(
          mainObjective,
          parentObjective,
          indicator,
          true,
          indicator.type === "qualitative" // Pass correct isQualitative value
        );
      } else {
        // Could not find parent objective for indicator
      }
    };

    // Save handler
    const handleSaveIndicator = async (formData) => {
      // Compose API data
      const apiData = {
        name: formData.name,
        type: formData.type,
        net_weight:
          formData.type === "quantitative"
            ? parseFloat(formData.weight || "0")
            : undefined,
        measurement_type:
          formData.type === "quantitative"
            ? formData.measurementType
            : undefined,
        target_value:
          formData.type === "quantitative" ? formData.targetValue : undefined,
        qualitative_levels:
          formData.type === "qualitative"
            ? formData.qualitative_levels
            : undefined,
        strategic_objective_id: selectedStrategicObjective.id,
        department_perspective_objective_id:
          selectedStrategicObjective.strategy_perspective_id,
        agreement_id: agreementId || null,
      };

      try {
        let payload;
        if (isEditing && editingIndicator) {
          payload = await dispatch(
            updatePerformanceMeasure({ id: editingIndicator.id, data: apiData })
          ).unwrap();
        } else {
          payload = await dispatch(createPerformanceMeasure(apiData)).unwrap();
        }

        // Create a deep copy to avoid reference issues
        const updatedObjectives = JSON.parse(JSON.stringify(objectives));

        // Update local state
        for (const objective of updatedObjectives) {
          for (const subObj of objective.subObjectives) {
            if (subObj.id === selectedStrategicObjective.id) {
              if (isEditing && editingIndicator) {
                const indicatorIndex = subObj.indicators.findIndex(
                  (ind) => ind.id === editingIndicator.id
                );
                if (indicatorIndex !== -1) {
                  subObj.indicators[indicatorIndex] = {
                    ...formData,
                    id: editingIndicator.id,
                  };
                }
              } else {
                // Add new indicator
                subObj.indicators.push({
                  id: payload.id,
                  name: payload.name,
                  targetValue: payload.target_value,
                  measurementType: payload.measurement_type,
                  weight: payload.net_weight ? `${payload.net_weight}%` : "",
                  description: payload.description || "",
                  qualitative_levels: payload.qualitative_levels || [],
                  type: payload.type,
                });
              }
              break;
            }
          }
        }

        // Tell parent about the update, with explicit type information
        onDataChange(
          updatedObjectives,
          formData.type === "qualitative" ? "qualitative" : "quantitative"
        );

        // Also refresh data from server to ensure UI is synchronized
        await dispatch(
          fetchAllPerformanceMeasuresByAgreement({ agreement_id: agreementId })
        );

        toast({
          title: "Success",
          description: isEditing
            ? "Performance measure updated successfully"
            : `${
                formData.type === "qualitative" ? "Qualitative" : "Quantitative"
              } performance measure created successfully`,
        });

        setIsIndicatorModalOpen(false);
        setIsEditing(false);
        setEditingIndicator(null);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error?.message ||
            "Could not save the performance measure. Please check your input and try again.",
          variant: "destructive",
        });
      }
    };

    return (
      <>
        <PerformanceIndicatorModal
          isOpen={isIndicatorModalOpen}
          closeModal={() => {
            setIsIndicatorModalOpen(false);
            setIsEditing(false);
            setEditingIndicator(null);
          }}
          strategicObjective={selectedStrategicObjective}
          isEditing={isEditing}
          editData={editingIndicator}
          onSave={handleSaveIndicator}
          isQualitative={isQualitativeState}
          isLoading={isCreating}
          perspectiveWeight={parseFloat(selectedObjective?.totalWeight) || 100}
          existingIndicators={
            selectedObjective?.subObjectives
              ?.flatMap((subObj) => subObj.indicators)
              ?.filter((ind) => ind.type === "quantitative") || []
          }
        />

        <QualitativeRubricModal
          isOpen={isRubricModalOpen}
          closeModal={() => setIsRubricModalOpen(false)}
          performanceMeasureId={rubricMeasureId}
          initialLevels={rubricInitialLevels}
          onSave={() => {
            setIsRubricModalOpen(false);
          }}
        />

        <DeletePerformanceMeasure
          isOpen={isDeleteModalOpen}
          closeModal={() => setIsDeleteModalOpen(false)}
          performanceMeasure={selectedPerformanceMeasure}
        />
      </>
    );
  }
);

export default PerformanceMeasureForm;
