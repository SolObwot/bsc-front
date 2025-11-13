import React from "react";
import {
  PencilSquareIcon,
  ArrowUpTrayIcon,
  PlayIcon,
  ForwardIcon,
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

  const canEdit = (isDraft || isRejected) && onEdit;
  const canSubmit = isDraft && onSubmit;
  const canStartRating =
    (isDraft || isRejected) && !hasRatings && onStartRating;
  const canContinueRating =
    (isDraft || isRejected) && hasRatings && onContinueRating;
  const canOverallAssess =
    [
      "submitted",
      "supervisor_reviewed",
      "peer_reviewed",
      "branch_reviewed",
      "hod_reviewed",
      "completed",
    ].includes(status) && onOverallAssessment;
  const canPreview = !!onPreview;
  const canDelete = (isDraft || isRejected) && onDelete;

  return (
    <div className="flex lg:flex-nowrap space-x-2 sm:space-x-5 sm:flex-wrap">
      {canEdit && (
        <button
          onClick={() => onEdit(appraisal)}
          className={`${buttonClass} text-blue-600 hover:text-blue-900`}
        >
          <PencilSquareIcon className={iconClass} />
          <span>Edit</span>
        </button>
      )}
      {canSubmit && (
        <button
          onClick={() => onSubmit(appraisal)}
          className={`${buttonClass} text-teal-600 hover:text-teal-900`}
        >
          <ArrowUpTrayIcon className={iconClass} />
          <span>Submit</span>
        </button>
      )}
      {canStartRating && (
        <button
          onClick={() => onStartRating(appraisal)}
          className={`${buttonClass} text-teal-600 hover:text-teal-900`}
        >
          <PlayIcon className={iconClass} />
          <span>Start Rating</span>
        </button>
      )}
      {canContinueRating && (
        <button
          onClick={() => onContinueRating(appraisal)}
          className={`${buttonClass} text-teal-600 hover:text-teal-900`}
        >
          <ForwardIcon className={iconClass} />
          <span>Continue Rating</span>
        </button>
      )}
      {canOverallAssess && (
        <button
          onClick={() => onOverallAssessment(appraisal)}
          className={`${buttonClass} text-purple-600 hover:text-purple-900`}
        >
          <ChartBarIcon className={iconClass} />
          <span>Overall Assessment</span>
        </button>
      )}
      {canPreview && (
        <button
          onClick={() => onPreview(appraisal)}
          className={`${buttonClass} text-blue-600 hover:text-blue-900`}
        >
          <EyeIcon className={iconClass} />
          <span>Preview</span>
        </button>
      )}
      {canDelete && (
        <button
          onClick={() => onDelete(appraisal)}
          className={`${buttonClass} text-red-600 hover:text-red-900`}
        >
          <TrashIcon className={iconClass} />
          <span>Delete</span>
        </button>
      )}
    </div>
  );
};

export default AppraisalActions;
