import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPerformanceMeasure,
  deletePerformanceMeasure,
  updatePerformanceMeasure,
} from "../../../redux/performanceMeasureSlice";
import PerformanceIndicatorModal from "../../../components/balancescorecard/modals/PerformanceIndicatorModal";
import DeletePerformanceMeasure from "./DeletePerformanceMeasure";
import { useToast } from "../../../hooks/useToast";

const PerformanceMeasureForm = forwardRef(
  ({ objectives, isQualitative, onDataChange, agreementId }, ref) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPerformanceMeasure, setSelectedPerformanceMeasure] =
      useState(null);

    // Get loading and error states from Redux
    const {
      loading: { create: isCreating, delete: isDeleting },
      error: { create: createError, delete: deleteError },
    } = useSelector((state) => state.performanceMeasure);

    // Modal states
    const [isStrategicModalOpen, setIsStrategicModalOpen] = useState(false);
    const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);
    const [isAppraisalModalOpen, setIsAppraisalModalOpen] = useState(false);
    const [isAppraisalApprovalModalOpen, setIsAppraisalApprovalModalOpen] =
      useState(false);

    // Selected items for modals
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [selectedStrategicObjective, setSelectedStrategicObjective] =
      useState(null);
    const [currentIndicatorIndex, setCurrentIndicatorIndex] = useState(0);
    const [approvalModalCurrentIndex, setApprovalModalCurrentIndex] =
      useState(0);
    const [currentIndicators, setCurrentIndicators] = useState([]);

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndicator, setEditingIndicator] = useState(null);

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      handleStrategicModalOpen,
      handleIndicatorModalOpen,
      handleAppraisalModalOpen,
      handleApprovalModalOpen,
      handleActionSelect,
      handleIndicatorEdit,
    }));

    // Event handlers
    const handleStrategicModalOpen = (objective) => {
      setSelectedObjective(objective);
      setIsStrategicModalOpen(true);
    };

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

    const handleAppraisalModalOpen = (indicator, index, indicators) => {
      setSelectedIndicator(indicator);
      setCurrentIndicatorIndex(index);
      setCurrentIndicators(indicators);
      setIsAppraisalModalOpen(true);
    };

    const handleApprovalModalOpen = (indicator, index, indicators) => {
      setSelectedIndicator(indicator);
      setApprovalModalCurrentIndex(index);
      setCurrentIndicators(indicators);
      setIsAppraisalApprovalModalOpen(true);
    };

    const handleActionSelect = (action, objective) => {
      if (action.name === "Delete") {
        setSelectedIndicator(objective);
        setIsAppraisalApprovalModalOpen(true);
      }
    };

    const handleSaveIndicator = async (formData) => {
      // For API integration
      const apiData = {
        name: formData.name,
        net_weight: parseFloat(formData.weight || "0"), // Make sure to use net_weight, not weight
        measurement_type: formData.measurementType,
        target_value: formData.targetValue,
        strategic_objective_id: selectedStrategicObjective.id,
        department_perspective_objective_id:
          selectedStrategicObjective.department_objective_id ||
          (selectedObjective && selectedObjective.department_perspective_id
            ? selectedObjective.department_perspective_id
            : selectedObjective.id),
        agreement_id: agreementId || null,
      };

      if (isEditing && editingIndicator) {
        try {
          const payload = await dispatch(
            updatePerformanceMeasure({ id: editingIndicator.id, data: apiData })
          ).unwrap();

          // Update local state
          const updatedObjectives = [...objectives];
          for (const objective of updatedObjectives) {
            for (const subObj of objective.subObjectives) {
              const indicatorIndex = subObj.indicators.findIndex(
                (ind) => ind.id === editingIndicator.id
              );
              if (indicatorIndex !== -1) {
                subObj.indicators[indicatorIndex] = {
                  ...formData,
                  id: editingIndicator.id,
                };
                onDataChange(updatedObjectives);
                toast({
                  title: "Success",
                  description: "Performance measure updated successfully",
                });
                break;
              }
            }
          }
          setIsIndicatorModalOpen(false);
          setIsEditing(false);
          setEditingIndicator(null);
        } catch (error) {
          toast({
            title: "Error",
            description:
              "Could not update the performance measure. Please check your input and try again.",
            variant: "destructive",
          });
        }
      } else if (selectedStrategicObjective) {
        try {
          const payload = await dispatch(
            createPerformanceMeasure(apiData)
          ).unwrap();
          // Add to local state
          const updatedObjectives = [...objectives];
          for (const objective of updatedObjectives) {
            if (objective.id === selectedObjective.id) {
              const subObjIndex = objective.subObjectives.findIndex(
                (subObj) => subObj.id === selectedStrategicObjective.id
              );
              if (subObjIndex !== -1) {
                objective.subObjectives[subObjIndex].indicators.push({
                  id: payload.id,
                  name: payload.name,
                  targetValue: payload.target_value,
                  measurementType: payload.measurement_type,
                  weight: formData.weight || "0%",
                  description: formData.description || "",
                });
                onDataChange(updatedObjectives);
                break;
              }
            }
          }
          toast({
            title: "Success",
            description: "Performance measure created successfully",
          });
          setIsIndicatorModalOpen(false);
        } catch (e) {
          toast({
            title: "Error",
            description:
              "Could not create the performance measure. Please check your input and try again.",
            variant: "destructive",
          });
        }
      }
    };

    const handleIndicatorEdit = (indicator, index, indicators) => {
      // Find the parent objective and strategic objective for this indicator
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

    const handleDeleteClick = (performanceMeasure) => {
      setSelectedPerformanceMeasure(performanceMeasure);
      setIsDeleteModalOpen(true);
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
          isLoading={isCreating}
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
