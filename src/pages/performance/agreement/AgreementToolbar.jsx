import React from 'react';
import Button from '../../../components/ui/Button';
import { DocumentPlusIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

const AgreementToolbar = ({ 
  recordsPerPage, 
  onRecordsPerPageChange, 
  totalRecords,
  showCreateButton = true, // Default value of true
  showRecordsPerPage = true // New prop with default value of true
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-end mb-4">
      {showCreateButton && (
        <Link to="/performance/agreement/new">
          <Button
            type="button"
            variant="pride"
            className="flex items-center gap-2 mb-4 sm:mb-0"
          >
            <DocumentPlusIcon className="h-5 w-5" aria-hidden="true" />
            Create New Agreement
          </Button>
        </Link>
      )}
      
      <div className={`flex items-center space-x-4 ${!showCreateButton ? 'ml-auto' : ''}`}>
        {showRecordsPerPage && (
          <div className="flex items-center gap-2">
            <label htmlFor="recordsPerPage" className="text-sm text-gray-700">
              Records per page:
            </label>
            <select
              id="recordsPerPage"
              value={recordsPerPage}
              onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md p-1"
            >
              {[5, 10, 15, 20, 50, 100].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        )}
        
        <span className="text-sm text-gray-700">
          {totalRecords > 0 ? `(${totalRecords}) Records Found` : 'No Records Found'}
        </span>
      </div>
    </div>
  );
};

export default AgreementToolbar;
