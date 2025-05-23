import React from 'react';
import { 
  EyeIcon, 
  PencilSquareIcon, 
  DocumentArrowDownIcon, 
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/20/solid';

const UndertakingActions = ({ 
  undertaking, 
  onView, 
  onSign, 
  onDownload, 
  onCheckHistory,
  hideSignButton = false
}) => {
  const isPending = undertaking.status === 'pending';
  const isSigned = undertaking.status === 'signed';

  return (
    <div className="flex space-x-3">
      <button
        onClick={() => onView && onView(undertaking)}
        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <EyeIcon className="h-5 w-5" aria-hidden="true" />
        <span>View</span>
      </button>
      
      {!hideSignButton && isPending && (
        <button
          onClick={() => onSign && onSign(undertaking)}
          className="text-green-600 hover:text-green-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
          <span>Sign</span>
        </button>
      )}
      
      {isSigned && (
        <>
          {/* <button
            onClick={() => onDownload && onDownload(undertaking)}
            className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-x-1.5 cursor-pointer"
          >
            <DocumentArrowDownIcon className="h-5 w-5" aria-hidden="true" />
            <span>Download</span>
          </button> */}
          
          <button
            className="text-green-600 hover:text-green-900 inline-flex items-center gap-x-1.5 cursor-pointer"
            disabled={true}
          >
            <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
            <span>Completed</span>
          </button>
        </>
      )}
      
      {/* <button
        onClick={() => onCheckHistory && onCheckHistory(undertaking)}
        className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <ClockIcon className="h-5 w-5" aria-hidden="true" />
        <span>History</span>
      </button> */}
    </div>
  );
};

export default UndertakingActions;
