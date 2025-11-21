import React from "react";
import {
  PencilSquareIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  EyeIcon,
  TrashIcon,
  DocumentTextIcon
} from "@heroicons/react/20/solid";

const AppraisalActions = ({
  appraisal,
  onEdit,
  onSubmit,
  onSelfRating,
  onSupervisorRating,
  onApprove,
  onOverallAssessment,
  onPreview,
  onDelete,
}) => {
  const buttonClass =
    "inline-flex items-center gap-x-1.5 cursor-pointer text-sm";
  const iconClass = "h-4 w-4";

  return (
    <div className="flex lg:flex-nowrap space-x-2 sm:space-x-5 sm:flex-wrap">
      {/* Edit action */}
      {onEdit && (
        <button
          onClick={() => onEdit(appraisal)}
          className={`${buttonClass} text-blue-600 hover:text-blue-900`}
        >
          <PencilSquareIcon className={iconClass} />
          <span>Edit</span>
        </button>
      )}

      {/* Submit action */}
      {onSubmit && (
        <button
          onClick={() => onSubmit(appraisal)}
          className={`${buttonClass} text-teal-600 hover:text-teal-900`}
        >
          <ArrowUpTrayIcon className={iconClass} />
          <span>Submit</span>
        </button>
      )}

      {/* Self Rating */}
      {onSelfRating && (
        <button
          onClick={() => onSelfRating(appraisal)}
          className={`${buttonClass} text-yellow-600 hover:text-yellow-900`}
        >
          <ChartBarIcon className={iconClass} />
          <span>Self Rating</span>
        </button>
      )}

      {/* Supervisor's Rating */}
      {onSupervisorRating && (
        <button
          onClick={() => onSupervisorRating(appraisal)}
          className={`${buttonClass} text-yellow-600 hover:text-yellow-900`}
        >
          <ChartBarIcon className={iconClass} />
          <span>Supervisor's Rating</span>
        </button>
      )}

      {/* Approve Button */}
      {onApprove && (
        <button
          onClick={() => onApprove(appraisal)}
          className={`${buttonClass} text-teal-600 hover:text-teal-900`}
        >
          <DocumentTextIcon className={iconClass} />
          <span>Approve</span>
        </button>
      )}

      {/* Overall Assessment action */}
      {onOverallAssessment && (
        <button
          onClick={() => onOverallAssessment(appraisal)}
          className={`${buttonClass} text-purple-600 hover:text-purple-900`}
        >
          <ChartBarIcon className={iconClass} />
          <span>Overall Assessment</span>
        </button>
      )}

      {/* Preview action */}
      {onPreview && (
        <button
          onClick={() => onPreview(appraisal)}
          className={`${buttonClass} text-blue-600 hover:text-blue-900`}
        >
          <EyeIcon className={iconClass} />
          <span>Preview</span>
        </button>
      )}

      {/* Delete action */}
      {onDelete && (
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
