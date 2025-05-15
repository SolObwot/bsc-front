import React from 'react';
import { EyeIcon, DocumentArrowDownIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/20/solid';

const AgreementActions = ({ 
  agreement, 
  onReview, 
  onPreview, 
  onDownload, 
  onViewHistory,
  showReviewAsApprove = false,
  showOnlyReviewAndPreview = false
}) => {
  return (
    <div className="flex space-x-3">
      <button
        onClick={() => onReview(agreement)}
        className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <DocumentTextIcon className="h-5 w-5" aria-hidden="true" />
        <span>{showReviewAsApprove ? 'Review & Approve' : 'Review'}</span>
      </button>
      
      <button
        onClick={() => onPreview(agreement)}
        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <EyeIcon className="w-4 h-4" />
        <span>Preview</span>
      </button>
      
      {!showOnlyReviewAndPreview && (
        <>
          <button
            onClick={() => onDownload && onDownload(agreement)}
            className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-x-1.5 cursor-pointer"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Download</span>
          </button>
          
          {/* <button
            onClick={() => onViewHistory && onViewHistory(agreement)}
            className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-x-1.5 cursor-pointer"
          >
            <ClockIcon className="w-4 h-4" />
            <span>History</span>
          </button> */}
        </>
      )}
    </div>
  );
};

export default AgreementActions;
