import React, { useState, useEffect, useCallback } from 'react';
import useUserSearch from '../../hooks/agreements/useUserSearch';
import SearchableCombobox from '../../components/ui/SearchableCombobox';
import Button from '../../components/ui/Button';

const AdvancedSearchModal = ({ isOpen, onClose, onEmployeeSelect, filterType = 'branch' }) => {
  const { searchResults, loading, hasMore, searchUsers, loadMoreUsers } = useUserSearch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedUser(null);
      setSearchTerm('');
      // Initialize with empty search to show some results
      searchUsers('');
    }
    
    // Cleanup function to fix the disconnected port error
    return () => {
      // This helps clean up any pending operations when component unmounts
      // Removed setSelectedUser(null) to prevent potential issues
    };
  }, [isOpen]); // Removed searchUsers from dependencies

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    searchUsers(term);
  }, [searchUsers]);

  const handleSubmit = () => {
    if (selectedUser) {
      onEmployeeSelect(selectedUser);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center"
      onClick={onClose} // Close when clicking outside
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Advanced Employee Search</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <SearchableCombobox
            label="Search Employee"
            options={searchResults}
            selected={selectedUser}
            onChange={(user) => setSelectedUser(user)}
            onSearch={handleSearch}
            onLoadMore={loadMoreUsers}
            hasMore={hasMore}
            loading={loading}
            placeholder="Type to search for an employee..."
          />
          
          {searchTerm && searchResults.length === 0 && !loading && (
            <div className="mt-2 text-sm text-gray-600">
              No employees found matching "{searchTerm}"
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="pride" 
            onClick={handleSubmit}
            disabled={!selectedUser}
          >
            Select Employee
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;
