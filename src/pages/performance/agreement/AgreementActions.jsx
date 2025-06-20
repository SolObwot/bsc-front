import React from 'react';
import { 
  EyeIcon, 
  DocumentArrowDownIcon, 
  ClockIcon, 
  DocumentTextIcon,
  PencilSquareIcon, 
  ArrowUpTrayIcon,  
  TrashIcon,        
  PlusIcon          
} from '@heroicons/react/20/solid';

const AgreementActions = ({ 
  agreement, 
  onReview, 
  onPreview, 
  onDownload, 
  onViewHistory,
  onEdit,
  onSubmit,
  onDelete,
  onAddKPI,
  showReviewAsApprove = false,
  showOnlyReviewAndPreview = false
}) => {
  const buttonClass = "inline-flex items-center gap-x-1.5 cursor-pointer text-sm";
  const iconClass = "h-4 w-4";

  return (
    <div className="flex space-x-3">
      {/* Edit action */}
      {onEdit && (
        <button
          onClick={() => onEdit(agreement)}
          className={`${buttonClass} text-blue-600 hover:text-blue-900`}
        >
          <PencilSquareIcon className={iconClass} />
          <span>Edit</span>
        </button>
      )}
      
      {/* Submit action */}
      {onSubmit && (
        <button
          onClick={() => onSubmit(agreement)}
          className={`${buttonClass} text-teal-600 hover:text-teal-900`}
        >
          <ArrowUpTrayIcon className={iconClass} />
          <span>Submit</span>
        </button>
      )}

      {/* Add KPI action */}
      {onAddKPI && (
        <button
          onClick={() => onAddKPI(agreement)}
          className={`${buttonClass} text-yellow-600 hover:text-yellow-900`}
        >
          <PlusIcon className={iconClass} />
          <span className="whitespace-nowrap">Add KPI</span>
        </button>
      )}
      
      {/* Delete action */}
      {onDelete && (
        <button
          onClick={() => onDelete(agreement)}
          className={`${buttonClass} text-red-600 hover:text-red-900`}
        >
          <TrashIcon className={iconClass} />
          <span>Delete</span>
        </button>
      )}

      {/* Existing actions */}
      {onReview && (
        <button
          onClick={() => onReview(agreement)}
          className={`${buttonClass} text-teal-600 hover:text-teal-900`}
        >
          <DocumentTextIcon className="h-5 w-5" aria-hidden="true" /> {/* Note: h-5 w-5 as per original */}
          <span>{showReviewAsApprove ? 'Review' : 'Review'}</span>
        </button>
      )}
      
      {onPreview && (
        <button
          onClick={() => onPreview(agreement)}
          className={`${buttonClass} text-blue-600 hover:text-blue-900`}
        >
          <EyeIcon className={iconClass} />
          <span>Preview</span>
        </button>
      )}
      
      {/* {!showOnlyReviewAndPreview && onDownload && (
        <button
          onClick={() => onDownload && onDownload(agreement)}
          className={`${buttonClass} text-gray-600 hover:text-gray-900`}
        >
          <DocumentArrowDownIcon className={iconClass} />
          <span>Download</span>
        </button>
      )} */}
      
      {/* {!showOnlyReviewAndPreview && onViewHistory && (
        <button
          onClick={() => onViewHistory && onViewHistory(agreement)}
          className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <ClockIcon className="w-4 h-4" />
          <span>History</span>
        </button>
      )} */}
    </div>
  );
};

export default AgreementActions;
