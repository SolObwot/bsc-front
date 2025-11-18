import React from "react";
import {
  PencilSquareIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

const AppraisalActions = ({
  appraisal,
  onEdit,
  onSubmit,
  onStartRating,
  onContinueRating,
  onOverallAssessment,
  onPreview,
  onDelete,
}) => {
  const status = (appraisal?.status || "").toLowerCase();
  const isDraft = status === "draft";
  const isRejected = status === "rejected";
  const hasRatings =
    Array.isArray(appraisal?.kpis) &&
    appraisal.kpis.some(
      (kpi) =>
        kpi?.pivot?.self_rating !== null &&
        kpi?.pivot?.self_rating !== undefined
    );

  const buttonClass =
    "inline-flex items-center gap-x-1.5 cursor-pointer text-sm";
  const iconClass = "h-4 w-4";

  const actions = [];

  const pushAction = (condition, handler, icon, label, extraClasses = "") => {
    if (!condition || !handler) return;
    actions.push(
      <button
        key={label}
        onClick={() => handler(appraisal)}
        className={`${buttonClass} ${extraClasses}`}
      >
        {React.createElement(icon, { className: iconClass })}
        <span>{label}</span>
      </button>
    );
  };

  if (status === "draft") {
    pushAction(
      true,
      onEdit,
      PencilSquareIcon,
      "Edit",
      "text-blue-600 hover:text-blue-900"
    );

    const selfRatingHandler = hasRatings ? onContinueRating : onStartRating;
    pushAction(
      Boolean(selfRatingHandler),
      selfRatingHandler,
      ChartBarIcon,
      "Self Rating",
      "text-yellow-600 hover:text-yellow-900"
    );

    pushAction(
      true,
      onSubmit,
      ArrowUpTrayIcon,
      "Submit",
      "text-teal-600 hover:text-teal-900"
    );
    pushAction(
      true,
      onDelete,
      TrashIcon,
      "Delete",
      "text-red-600 hover:text-red-900"
    );
  } else if (["submitted", "completed", "rejected"].includes(status)) {
    pushAction(
      true,
      onPreview,
      EyeIcon,
      "Preview",
      "text-blue-600 hover:text-blue-900"
    );
    pushAction(
      true,
      onEdit,
      PencilSquareIcon,
      "Edit",
      "text-blue-600 hover:text-blue-900"
    );
  } else if (["supervisor_reviewed", "peer_reviewed"].includes(status)) {
    pushAction(
      true,
      onOverallAssessment,
      ChartBarIcon,
      "Overall Assessment",
      "text-purple-600 hover:text-purple-900"
    );
    pushAction(
      true,
      onPreview,
      EyeIcon,
      "Preview",
      "text-blue-600 hover:text-blue-900"
    );
  } else if (["branch_reviewed", "hod_reviewed"].includes(status)) {
    pushAction(
      true,
      onPreview,
      EyeIcon,
      "Preview",
      "text-blue-600 hover:text-blue-900"
    );
  } else {
    pushAction(
      true,
      onPreview,
      EyeIcon,
      "Preview",
      "text-blue-600 hover:text-blue-900"
    );
  }

  return (
    <div className="flex lg:flex-nowrap space-x-2 sm:space-x-5 sm:flex-wrap">
      {actions.length > 0 ? (
        actions
      ) : (
        <span className="text-xs text-gray-400">No actions available</span>
      )}
    </div>
  );
};

export default AppraisalActions;
