import React from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  EyeIcon, 
  DocumentArrowDownIcon, 
  TrashIcon, 
  PencilIcon
} from '@heroicons/react/20/solid';

const AssistantActions = ({ 
  document, 
  onChat, 
  onView, 
  onDownload, 
  onDelete,
  onEdit
}) => {
  return (
    <div className="flex space-x-3">
      {/* <button
        onClick={() => onChat && onChat(document)}
        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
        <span>Chat</span>
      </button> */}
      
      <button
        onClick={() => onView && onView(document)}
        className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <EyeIcon className="w-4 h-4" />
        <span>Preview</span>
      </button>
      
      <button
        onClick={() => onDownload && onDownload(document)}
        className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <DocumentArrowDownIcon className="w-4 h-4" />
        <span>Download</span>
      </button>
      
      {/* <button
        onClick={() => onEdit && onEdit(document)}
        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <PencilIcon className="w-4 h-4" />
        <span>Edit</span>
      </button> */}
      
      {/* <button
        onClick={() => onDelete && onDelete(document)}
        className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <TrashIcon className="w-4 h-4" />
        <span>Delete</span>
      </button> */}
    </div>
  );
};

export default AssistantActions;
