import React from 'react';
import Button from '../../components/ui/Button';
import { DocumentPlusIcon, ArrowUpTrayIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/20/solid';

const AssistantToolbar = ({ 
  recordsPerPage, 
  onRecordsPerPageChange, 
  totalRecords,
  onAddDocument,
  onStartChat
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-end mb-4">
      <div className="flex items-center gap-2 mb-4 sm:mb-0">
        <Button
          type="button"
          variant="pride"
          className="flex items-center gap-2"
          onClick={onAddDocument}
        >
          <ArrowUpTrayIcon className="h-5 w-5" aria-hidden="true" />
          Upload Document
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          className="flex items-center gap-2 ml-2"
          onClick={onStartChat}
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />
          Start Chat
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mb-4 sm:mb-0">
        <label htmlFor="recordsPerPage" className="text-sm text-gray-700">
          Records per page:
        </label>
        <select
          id="recordsPerPage"
          value={recordsPerPage}
          onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-1"
        >
          {[5, 10, 15, 20, 50].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <span className="text-sm text-gray-700">
        {totalRecords > 0 ? `(${totalRecords}) Records Found` : 'No Records Found'}
      </span>
    </div>
  );
};

export default AssistantToolbar;
