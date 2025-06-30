import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPerformanceMeasure,
  updatePerformanceMeasure,
} from "../../../redux/performanceMeasureSlice";
import PerformanceIndicatorModal from "../../../components/balancescorecard/modals/PerformanceIndicatorModal";
import DeletePerformanceMeasure from "./DeletePerformanceMeasure";
import { useToast } from "../../../hooks/useToast";
import QualitativeRubricModal from "../../../components/balancescorecard/modals/QualitativeRubricModal";

const PerformanceMeasureForm = forwardRef(
  ({ objectives, isQualitative, onDataChange, agreementId }, ref) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPerformanceMeasure, setSelectedPerformanceMeasure] = useState(null);
    const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);
    const [rubricMeasureId, setRubricMeasureId] = useState(null);
    const [rubricInitialLevels, setRubricInitialLevels] = useState([]);

    const {
      loading: { create: isCreating },
    } = useSelector((state) => state.performanceMeasure);

    // Modal states
    const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);

    // Selected items for modals
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [selectedStrategicObjective, setSelectedStrategicObjective] = useState(null);

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
      isEdit = false
    ) => {
      setSelectedObjective(objective);
      setSelectedStrategicObjective(strategicObjective);
      setIsEditing(isEdit);
      setEditingIndicator(indicator);
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
          true
        );
      } else {
        console.error(
          "Could not find parent objective for indicator:",
          indicator
        );
      }
    };

    // Save handler
    const handleSaveIndicator = async (formData) => {
      // Compose API data
      const apiData = {
        name: formData.name,
        type: isQualitative ? "qualitative" : "quantitative",
        net_weight: !isQualitative ? parseFloat(formData.weight || "0") : undefined,
        measurement_type: !isQualitative ? formData.measurementType : undefined,
        target_value: !isQualitative ? formData.targetValue : undefined,
        strategic_objective_id: selectedStrategicObjective.id,
        department_perspective_objective_id:
          selectedStrategicObjective.department_objective_id ||
          (selectedObjective && selectedObjective.department_perspective_id
            ? selectedObjective.department_perspective_id
            : selectedObjective.id),
        agreement_id: agreementId || null,
      };

      try {
        let payload;
        if (isEditing && editingIndicator) {
          payload = await dispatch(
            updatePerformanceMeasure({ id: editingIndicator.id, data: apiData })
          ).unwrap();
        } else {
          payload = await dispatch(
            createPerformanceMeasure(apiData)
          ).unwrap();
        }

        // Update local state
        const updatedObjectives = [...objectives];
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
        onDataChange(updatedObjectives);

        toast({
          title: "Success",
          description: isEditing ? "Performance measure updated successfully" : "Performance measure created successfully",
        });

        setIsIndicatorModalOpen(false);
        setIsEditing(false);
        setEditingIndicator(null);
      } catch (error) {
        toast({
          title: "Error",
          description:
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
          isQualitative={isQualitative}
          isLoading={isCreating}
        />

        <QualitativeRubricModal
          isOpen={isRubricModalOpen}
          closeModal={() => setIsRubricModalOpen(false)}
          performanceMeasureId={rubricMeasureId}
          initialLevels={rubricInitialLevels}
          onSave={() => {
            setIsRubricModalOpen(false);
            // Optionally, refresh objectives or call onDataChange
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