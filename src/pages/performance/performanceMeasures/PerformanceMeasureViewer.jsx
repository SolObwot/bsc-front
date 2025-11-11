import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartmentObjectives,
  fetchAllPerformanceMeasuresByAgreement,
  fetchAgreementById,
} from "../../../redux/performanceMeasureSlice";
import ObjectiveHeader from "../../../components/balancescorecard/Header";
import ObjectiveTabs from "../../../components/balancescorecard/Tabs";
import ObjectiveListHeader from "../../../components/balancescorecard/ListHeader";
import ObjectiveItem from "../../../components/balancescorecard/Item";
import PerformanceMeasureForm from "./PerformanceMeasureForm";
import PreviewModal from "../../../components/balancescorecard/modals/PreviewModal";
import { useToast } from "../../../hooks/useToast";

export const PerformanceMeasureViewer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { id: agreementId } = useParams();
  const [activeTab, setActiveTab] = useState("active");
  const [fetchingMeasures, setFetchingMeasures] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPerformanceMeasure, setSelectedPerformanceMeasure] =
    useState(null);
  const [currentIndicatorIndex, setCurrentIndicatorIndex] = useState(0);
  const [currentIndicators, setCurrentIndicators] = useState([]);

  const {
    department,
    perspectives,
    loading: {
      department: isLoading,
      allDashboardMeasures: isDashboardLoading,
    },
    error: { department: error, allDashboardMeasures: dashboardError },
    selectedAgreement: agreement, // Use selectedAgreement from state
  } = useSelector((state) => state.performanceMeasure);

  const [objectives, setObjectives] = useState({
    quantitative: [],
    qualitative: [],
  });

  const [dashboardMeasures, setDashboardMeasures] = useState([]);

  const formRef = useRef();

  useEffect(() => {
    // Fetch agreement details first
    dispatch(fetchAgreementById(agreementId));

    dispatch(fetchDepartmentObjectives())
      .unwrap()
      .then(() => {})
      .catch((error) => {
        toast({
          title: "Error",
          description:
            "Failed to load department objectives. Please try again.",
          variant: "destructive",
        });
      });
  }, [dispatch, agreementId]);

  useEffect(() => {
    setFetchingMeasures(true);
    dispatch(
      fetchAllPerformanceMeasuresByAgreement({ agreement_id: agreementId })
    )
      .unwrap()
      .then((measures) => {
        setDashboardMeasures(measures);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description:
            error.message ||
            "Failed to load dashboard performance measures. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setFetchingMeasures(false);
      });
  }, [dispatch, agreementId]);

  useEffect(() => {
    if (department && perspectives) {
      const quantitativePerspectives = perspectives.filter(
        (p) => p.type === "quantitative"
      );
      const qualitativePerspectives = perspectives.filter(
        (p) => p.type === "qualitative"
      );

      let creator = null;
      if (dashboardMeasures.length > 0 && dashboardMeasures[0].creator) {
        creator = dashboardMeasures[0].creator;
      }

      const transformPerspectiveToObjective = (perspective) => {
        const perspectiveObjectives = perspective.objectives || {};
        const objectivesArray = Array.isArray(perspectiveObjectives)
          ? perspectiveObjectives
          : Object.values(perspectiveObjectives);
        const safeObjectivesArray =
          objectivesArray.length > 0
            ? objectivesArray
            : [
                {
                  id: `default-${perspective.id}`,
                  name: "General Objectives",
                  weight: perspective.weight,
                },
              ];

        return {
          id: perspective.id,
          title: perspective.name,
          totalWeight: `${perspective.weight}%`,
          progress: 0,
          dueDate: "31 Dec, 2024",
          assignee: creator
            ? {
                name: `${creator.surname || ""} ${
                  creator.first_name || ""
                }`.trim(),
                surname: creator.surname || "",
                lastName: creator.first_name || "",
                avatar: creator.profile_photo_url || "/placeholder.svg",
              }
            : null,
          lastUpdated: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          created: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          keyResults: safeObjectivesArray.length,
          status: "In Progress",
          comments: 0,
          department_perspective_id: perspective.id,
          subObjectives: safeObjectivesArray.map((obj) => ({
            id: obj.id,
            name: obj.name,
            weight: `${
              Math.round(
                (perspective.weight / safeObjectivesArray.length) * 10
              ) / 10
            }%`,
            department_objective_id: obj.department_objective_id || obj.id,
            strategy_perspective_id: obj.strategy_perspective_id,
            indicators: [],
          })),
        };
      };

      setObjectives({
        quantitative: quantitativePerspectives.map(
          transformPerspectiveToObjective
        ),
        qualitative: qualitativePerspectives.map(
          transformPerspectiveToObjective
        ),
      });
    }
  }, [department, perspectives]);

  useEffect(() => {
    if (
      dashboardMeasures.length > 0 &&
      objectives.quantitative.length > 0 &&
      objectives.qualitative.length > 0
    ) {
      const updatedQuantitativeObjectives = JSON.parse(
        JSON.stringify(objectives.quantitative)
      );
      const updatedQualitativeObjectives = JSON.parse(
        JSON.stringify(objectives.qualitative)
      );

      dashboardMeasures.forEach((measure) => {
        // Decide which objectives array to use
        let targetObjectives =
          measure.type === "quantitative"
            ? updatedQuantitativeObjectives
            : updatedQualitativeObjectives;

        // Find the correct perspective (objective)
        for (const objective of targetObjectives) {
          if (
            measure.department_objective &&
            objective.department_perspective_id ===
              measure.department_objective.strategy_perspective_id
          ) {
            // Find the correct subObjective (strategic objective)
            const subObjIndex = objective.subObjectives.findIndex(
              (subObj) => subObj.id === measure.strategic_objective_id
            );

            if (subObjIndex !== -1) {
              const existingIndicator = objective.subObjectives[
                subObjIndex
              ].indicators.find((ind) => ind.id === measure.id);

              if (!existingIndicator) {
                objective.subObjectives[subObjIndex].indicators.push({
                  id: measure.id,
                  name: measure.name,
                  targetValue: measure.target_value,
                  measurementType: measure.measurement_type,
                  weight: measure.net_weight ? `${measure.net_weight}%` : "",
                  description: measure.description || "",
                  qualitative_levels: measure.qualitative_levels || [],
                  type: measure.type,
                  // Add additional fields needed for performance levels
                  outstanding_threshold: measure.outstanding_threshold,
                  exceeds_expectations_threshold:
                    measure.exceeds_expectations_threshold,
                  meets_expectations_threshold:
                    measure.meets_expectations_threshold,
                  needs_improvement_threshold:
                    measure.needs_improvement_threshold,
                  unsatisfactory_threshold: measure.unsatisfactory_threshold,
                });
              }
            }
          }
        }
      });

      setObjectives({
        quantitative: updatedQuantitativeObjectives,
        qualitative: updatedQualitativeObjectives,
      });
    }
  }, [
    dashboardMeasures,
    objectives.quantitative.length,
    objectives.qualitative.length,
  ]);

  const handleDataChange = (newObjectives, type = null) => {
    // If type is explicitly passed, use that, otherwise infer from active tab
    const objectiveType =
      type || (activeTab === "active" ? "quantitative" : "qualitative");

    setObjectives((prev) => ({
      ...prev,
      [objectiveType]: Array.isArray(newObjectives) ? newObjectives : [],
    }));
  };

  const handleIndicatorPreview = (indicator, index, indicators) => {
    setSelectedPerformanceMeasure(indicator);
    setCurrentIndicatorIndex(index);
    setCurrentIndicators(indicators || []);
    setIsPreviewModalOpen(true);
  };

  const handlePreviewModalNavigation = (direction) => {
    if (
      direction === "next" &&
      currentIndicatorIndex < currentIndicators.length - 1
    ) {
      setCurrentIndicatorIndex((prev) => prev + 1);
      setSelectedPerformanceMeasure(
        currentIndicators[currentIndicatorIndex + 1]
      );
    } else if (direction === "prev" && currentIndicatorIndex > 0) {
      setCurrentIndicatorIndex((prev) => prev - 1);
      setSelectedPerformanceMeasure(
        currentIndicators[currentIndicatorIndex - 1]
      );
    }
  };

  const findParentObjective = (indicator) => {
    for (const objective of displayedObjectives) {
      for (const subObj of objective.subObjectives) {
        if (subObj.indicators.some((ind) => ind.id === indicator.id)) {
          return subObj;
        }
      }
    }
    return null;
  };

  const findMainObjective = (indicator) => {
    for (const objective of displayedObjectives) {
      for (const subObj of objective.subObjectives) {
        if (subObj.indicators.some((ind) => ind.id === indicator.id)) {
          return objective;
        }
      }
    }
    return null;
  };

  const displayedObjectives =
    activeTab === "active"
      ? objectives.quantitative || []
      : activeTab === "draft"
      ? objectives.qualitative || []
      : [];

  // Create a custom render function for ObjectiveItem indicators
  const renderCustomIndicator = (
    indicator,
    index,
    indicators,
    isQualitative
  ) => {
    return (
      <li
        key={indicator.id || `temp-${index}`}
        className="flex items-center bg-white p-1.5 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
        onClick={() => handleIndicatorPreview(indicator, index, indicators)}
      >
        <div className="min-w-0 flex-1 mr-2">
          <div title={indicator.name}>
            <span className="text-sm/7 text-gray-700 line-clamp-2 capitalize">
              {indicator.name}
            </span>
          </div>
        </div>
        {!isQualitative && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center whitespace-nowrap">
              <span className="text-xs text-gray-700 px-1.5 py-0.5">
                <span className="text-purple-700">
                  {formatDateIfNeeded(
                    indicator.targetValue,
                    indicator.measurementType
                  )}
                </span>{" "}
                | <span className="text-teal-700">{indicator.weight}</span>
              </span>
            </div>
          </div>
        )}
        <div className="flex items-center space-x-1 ml-2">
          <button
            className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded font-medium"
            onClick={(e) => {
              e.stopPropagation(); // Prevent double triggering
              handleIndicatorPreview(indicator, index, indicators);
            }}
          >
            Preview
          </button>
        </div>
      </li>
    );
  };

  // Add this helper function to format dates properly
  const formatDateIfNeeded = (value, measurementType) => {
    if (measurementType === "date") {
      try {
        // Handle Date objects
        if (value instanceof Date) {
          return value.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }

        // Handle ISO date strings
        if (typeof value === "string" && !isNaN(Date.parse(value))) {
          return new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      } catch (e) {
        console.error("Error formatting date:", e);
      }
    }

    return value;
  };

  return (
    <div className="min-h-screen bg-gray-100 shadow-md rounded-lg">
      <ObjectiveHeader perspective={agreement?.name || "Annual"} />
      <div className="flex justify-between">
        <ObjectiveTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <ObjectiveListHeader activeTab={activeTab} />

      <div className="px-4 py-2">
        {isLoading || fetchingMeasures ? (
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
              <div className="h-32 bg-gray-200 rounded-lg mt-8" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mt-6" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto" />
            </div>
          </div>
        ) : displayedObjectives.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg shadow-sm">
            <p className="text-gray-500">
              No {activeTab === "active" ? "quantitative" : "qualitative"}{" "}
              objectives found.
            </p>
          </div>
        ) : (
          displayedObjectives.map((objective, index) => (
            <ObjectiveItem
              key={index}
              objective={objective}
              subObjectives={objective.subObjectives || []}
              showAddStrategicButton={false}
              showAddKPIButton={false} // Hide the Add KPI button
              showTargetValue={true}
              displayMode={
                activeTab === "active" ? "standard" : "direct-indicators"
              }
              isQualitative={activeTab !== "active"}
              onIndicatorClick={(indicator, index, indicators) =>
                handleIndicatorPreview(indicator, index, indicators)
              }
              renderCustomIndicator={(
                indicator,
                index,
                indicators,
                isQualitative
              ) =>
                renderCustomIndicator(
                  indicator,
                  index,
                  indicators,
                  isQualitative
                )
              }
              renderStrategicModal={false}
              renderIndicatorModal={false}
              renderAppraisalModal={false}
              renderAppraisalApprovalModal={false}
            />
          ))
        )}
      </div>

      {/* Preview Modal for performance measure details */}
      {isPreviewModalOpen && selectedPerformanceMeasure && (
        <PreviewModal
          isOpen={isPreviewModalOpen}
          closeModal={() => setIsPreviewModalOpen(false)}
          indicator={selectedPerformanceMeasure}
          onNavigate={handlePreviewModalNavigation}
          hasNext={currentIndicatorIndex < currentIndicators.length - 1}
          hasPrevious={currentIndicatorIndex > 0}
          totalCount={currentIndicators.length}
          currentIndex={currentIndicatorIndex}
        />
      )}

      <PerformanceMeasureForm
        objectives={displayedObjectives}
        isQualitative={activeTab !== "active"}
        onDataChange={handleDataChange}
        agreementId={agreementId}
        ref={formRef}
      />
    </div>
  );
};

export default PerformanceMeasureViewer;
