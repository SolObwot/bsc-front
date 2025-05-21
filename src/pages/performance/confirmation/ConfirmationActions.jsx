import React from 'react';
import { PlayIcon, PaperAirplaneIcon, EyeIcon, DocumentArrowDownIcon, ClockIcon, DocumentCheckIcon, DocumentTextIcon } from '@heroicons/react/20/solid';

const ConfirmationActions = ({ 
  confirmation, 
  onStartReview, 
  onSubmit, 
  onPreview, 
  onDownload, 
  onViewHistory,
  onViewAssessment,
  showOnlyReviewButtons = false,
  showReviewAsApprove = false,
  showOnlyReviewAndPreview = false
}) => {
  return (
    <div className="flex space-x-3">
      {/* For HOD Approval view */}
      {showOnlyReviewAndPreview && (
        <>
          {confirmation.status !== 'completed' && (
            <button
              onClick={() => onViewAssessment && onViewAssessment(confirmation)}
              className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
            >
              <DocumentTextIcon className="h-5 w-5" aria-hidden="true" />
              <span>{showReviewAsApprove ? "Approve" : "Review"}</span>
            </button>
          )}
          
          <button
            onClick={() => onPreview && onPreview(confirmation)}
            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
          >
            <EyeIcon className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </>
      )}
      
      {/* Pending Supervisor Status - Show Recommend Button */}
      {!showOnlyReviewAndPreview && confirmation.status === 'pending_supervisor' && (
        <button
          onClick={() => onStartReview && onStartReview(confirmation)}
          className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <DocumentCheckIcon className="h-5 w-5" aria-hidden="true" />
          <span>Recommend</span>
        </button>
      )}

      {/* Continue Review Button (for in-progress statuses) */}
      {!showOnlyReviewAndPreview && (confirmation.status === 'supervisor_in_progress') && (
        <button
          onClick={() => onStartReview && onStartReview(confirmation)}
          className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <PlayIcon className="h-5 w-5" aria-hidden="true" />
          <span>Continue</span>
        </button>
      )}
      
      {/* Submit button for in-progress statuses */}
      {!showOnlyReviewAndPreview && (confirmation.status === 'supervisor_in_progress') && (
        <button
          onClick={() => onSubmit && onSubmit(confirmation)}
          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
          <span>Submit</span>
        </button>
      )}

      {/* Overall Assessment button */}
      {!showOnlyReviewAndPreview && confirmation.status === 'supervisor_reviewed' && onViewAssessment && (
        <button
          onClick={() => onViewAssessment(confirmation)}
          className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <DocumentCheckIcon className="h-5 w-5" aria-hidden="true" />
          <span>Overall Assessment</span>
        </button>
      )}
      
      {/* Preview button - always show for pending_supervisor and pending_hod */}
      {(!showOnlyReviewButtons || 
        confirmation.status === 'pending_supervisor' || 
        confirmation.status === 'pending_hod' || 
        confirmation.status === 'submitted' || 
        confirmation.status === 'supervisor_reviewed') && 
        !showOnlyReviewAndPreview && (
        <button
          onClick={() => onPreview && onPreview(confirmation)}
          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <EyeIcon className="w-4 h-4" />
          <span>Preview</span>
        </button>
      )}
      
      {/* Download and History buttons */}
      {!showOnlyReviewButtons && 
        !showOnlyReviewAndPreview && 
        confirmation.status !== 'submitted' && 
        confirmation.status !== 'pending_supervisor' && (
        <>
          <button
            onClick={() => onDownload && onDownload(confirmation)}
            className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-x-1.5 cursor-pointer"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Download</span>
          </button>
          
          <button
            onClick={() => onViewHistory && onViewHistory(confirmation)}
            className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-x-1.5 cursor-pointer"
          >
            <ClockIcon className="w-4 h-4" />
            <span>History</span>
          </button>
        </>
      )}
    </div>
  );
};

export default ConfirmationActions;
