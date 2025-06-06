import React from 'react';
import { PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

const StrategyPerspectiveActions = ({ 
  weight, 
  onEdit, 
  onDelete, 
  onApprove, 
  showApproveButton = false 
}) => {
  return (
    <div className="flex space-x-3">
      {showApproveButton && (
        <button
          onClick={() => onApprove && onApprove(weight)}
          className="text-green-600 hover:text-green-900 inline-flex items-center gap-x-1.5 cursor-pointer"
        >
          <CheckCircleIcon className="w-4 h-4" />
          <span>Approve</span>
        </button>
      )}
      
      <button
        onClick={() => onEdit && onEdit(weight)}
        className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <PencilIcon className="h-5 w-5" aria-hidden="true" />
        <span>Edit</span>
      </button>
      
      <button
        onClick={() => onDelete && onDelete(weight)}
        className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <TrashIcon className="h-5 w-5" aria-hidden="true" />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default StrategyPerspectiveActions;
