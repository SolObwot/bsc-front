import React from 'react';
import { PlayIcon, PaperAirplaneIcon, EyeIcon, DocumentArrowDownIcon, ClockIcon, DocumentCheckIcon } from '@heroicons/react/20/solid';

const AppraisalActions = ({ 
  appraisal, 
  onStartRating, 
  onSubmit, 
  onPreview, 
  onDownload, 
  onViewHistory,
  onViewAssessment,
  showOnlyRatingButtons = false
}) => {
  return (
    <div className="flex space-x-3">
      {appraisal.status === 'pending_rating' && (
        <button
          onClick={() => onStartRating(appraisal)}
          className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <PlayIcon className="h-5 w-5" aria-hidden="true" />
          <span>Start Rating</span>
        </button>
      )}
      
      {appraisal.status === 'in_progress' && (
        <button
          onClick={() => onStartRating(appraisal)}
          className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <PlayIcon className="h-5 w-5" aria-hidden="true" />
          <span>Continue Rating</span>
        </button>
      )}
      
      {(appraisal.status === 'in_progress') && (
        <button
          onClick={() => onSubmit(appraisal)}
          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
          <span>Submit</span>
        </button>
      )}

      {appraisal.status === 'supervisor_reviewed' && onViewAssessment && (
        <button
          onClick={() => onViewAssessment(appraisal)}
          className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <DocumentCheckIcon className="h-5 w-5" aria-hidden="true" />
          <span>Overall Assessment</span>
        </button>
      )}
      
      {(!showOnlyRatingButtons || appraisal.status === 'submitted' || appraisal.status === 'supervisor_reviewed') && (
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
