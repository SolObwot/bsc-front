import React from 'react';
import { PlayIcon, PaperAirplaneIcon, EyeIcon, DocumentArrowDownIcon, ClockIcon, DocumentCheckIcon, DocumentTextIcon } from '@heroicons/react/20/solid';

const AppraisalActions = ({ 
  appraisal, 
  onStartRating, 
  onSubmit, 
  onPreview, 
  onDownload, 
  onViewHistory,
  onViewAssessment,
  showOnlyRatingButtons = false,
  showReviewAsApprove = false,
  showOnlyReviewAndPreview = false
}) => {
  return (
    <div className="flex space-x-3">
      {/* For HOD Approval view */}
      {showOnlyReviewAndPreview && (
        <>
          {appraisal.status !== 'completed' && (
            <button
              onClick={() => onViewAssessment && onViewAssessment(appraisal)}
              className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
            >
              <DocumentTextIcon className="h-5 w-5" aria-hidden="true" />
              <span>{showReviewAsApprove ? "Approve" : "Review"}</span>
            </button>
          )}
          
          <button
            onClick={() => onPreview && onPreview(appraisal)}
            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
          >
            <EyeIcon className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </>
      )}

      {/* Start/Continue Rating buttons for pending or in-progress statuses */}
      {!showOnlyReviewAndPreview && (appraisal.status === 'pending_rating' || appraisal.status === 'pending_supervisor') && (
        <button
          onClick={() => onStartRating && onStartRating(appraisal)}
          className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <PlayIcon className="h-5 w-5" aria-hidden="true" />
          <span>Start Rating</span>
        </button>
      )}
      
      {!showOnlyReviewAndPreview && (appraisal.status === 'in_progress' || appraisal.status === 'supervisor_in_progress') && (
        <button
          onClick={() => onStartRating && onStartRating(appraisal)}
          className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <PlayIcon className="h-5 w-5" aria-hidden="true" />
          <span>Continue</span>
        </button>
      )}
      
      {/* Submit button for in-progress statuses */}
      {!showOnlyReviewAndPreview && (appraisal.status === 'in_progress' || appraisal.status === 'supervisor_in_progress') && (
        <button
          onClick={() => onSubmit && onSubmit(appraisal)}
          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
          <span>Submit</span>
        </button>
      )}

      {!showOnlyReviewAndPreview && appraisal.status === 'supervisor_reviewed' && onViewAssessment && (
        <button
          onClick={() => onViewAssessment(appraisal)}
          className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <DocumentCheckIcon className="h-5 w-5" aria-hidden="true" />
          <span>Overall Assessment</span>
        </button>
      )}
      
      {(!showOnlyRatingButtons || appraisal.status === 'submitted' || appraisal.status === 'supervisor_reviewed') && !showOnlyReviewAndPreview && (
        <>
          <button
            onClick={() => onPreview && onPreview(appraisal)}
            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
          >
            <EyeIcon className="w-4 h-4" />
            <span>Preview</span>
          </button>
          
          {!showOnlyRatingButtons && appraisal.status !== 'submitted' && (
            <>
              <button
                onClick={() => onDownload && onDownload(appraisal)}
                className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-x-1.5 cursor-pointer"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span>Download</span>
              </button>
              
              <button
                onClick={() => onViewHistory && onViewHistory(appraisal)}
                className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-x-1.5 cursor-pointer"
              >
                <ClockIcon className="w-4 h-4" />
                <span>History</span>
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AppraisalActions;
