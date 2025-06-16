import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import FilterBox from '../../../components/ui/FilterBox';
import Button from '../../../components/ui/Button';
import { DocumentPlusIcon, PencilSquareIcon, ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfigs = {
    draft: {
      color: 'bg-gray-100 text-gray-700',
      label: 'Draft'
    },
    submitted: {
      color: 'bg-blue-100 text-blue-700',
      label: 'Submitted for Review'
    }
  };

  const config = statusConfigs[status] || statusConfigs.draft;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// Confirmation Modal Component
const SubmitConfirmationModal = ({ isOpen, closeModal, onConfirm, agreement }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all border border-teal-100">
                <div className="bg-teal-50 px-6 py-5 border-b border-teal-100">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold text-gray-700">
                      Submit Agreement For Review
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Are you sure you want to submit your agreement for review to your immdediate supervisor? 
                    </p>
                    <p className="text-amber-600 text-sm">
                      Once submitted, you won't be able to edit the KPIs in this agreement.
                    </p>
                    
                    <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                      <p className="font-medium">Agreement Details:</p>
                      <p>Title: {agreement?.title}</p>
                      <p>Period: {agreement?.period}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={closeModal}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onConfirm();
                        closeModal();
                      }}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                    >
                      <ArrowUpTrayIcon className="w-4 h-4 mr-1.5" />
                      Submit Agreement
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const AgreementList = () => {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  
  // Modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);

  // Sample agreements with both draft and submitted statuses
  const [agreements, setAgreements] = useState([
    {
      id: 1,
      title: 'Performance Agreement 2025',
      period: 'Annual Review',
      createdDate: '2025-05-01',
      submittedDate: null,
      status: 'draft'
    },
    {
      id: 2,
      title: 'Performance Agreement 2024',
      period: 'Probation 6 months',
      createdDate: '2023-12-10',
      submittedDate: '2024-01-05',
      status: 'submitted'
    }
  ]);
  
  const [filteredAgreements, setFilteredAgreements] = useState(agreements);

  // Apply filters when filter state changes
  useEffect(() => {
    let filtered = agreements;
    
    if (filterText) {
      filtered = filtered.filter(agreement => 
        agreement.title.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    
    if (filterStatus) {
      filtered = filtered.filter(agreement => agreement.status === filterStatus);
    }
    
    if (filterPeriod) {
      filtered = filtered.filter(agreement => agreement.period === filterPeriod);
    }
    
    setFilteredAgreements(filtered);
  }, [filterText, filterStatus, filterPeriod, agreements]);

  const handleAddNew = () => {
    navigate('/performance/agreement/new');
  };

  const handleEdit = (agreement) => {
    navigate(`/performance/agreement/edit/${agreement.id}`);
  };

  const handleSubmit = (agreement) => {
    setSelectedAgreement(agreement);
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    // Update agreement status in memory (no localStorage)
    const updatedAgreements = agreements.map(agreement => {
      if (agreement.id === selectedAgreement.id) {
        return {
          ...agreement,
          status: 'submitted',
          submittedDate: new Date().toISOString()
        };
      }
      return agreement;
    });
    
    setAgreements(updatedAgreements);
    alert('Agreement successfully submitted for review!');
  };

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterPeriod('');
  };

  // Get unique periods for the filter dropdown
  const periods = [...new Set(agreements.map(a => a.period))];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4 bg-gray-100">
        <h1 className="text-xl font-bold text-gray-800">My Performance Agreements</h1>
        <OverallProgress progress={90} riskStatus={false} />
      </div>
      
      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="My Performance Agreements Filters"
          filters={[
            {
              id: 'filterText',
              label: 'Search',
              type: 'text',
              placeholder: 'Search by agreement title...',
              value: filterText,
              onChange: (e) => setFilterText(e.target.value),
            },
            {
              id: 'filterStatus',
              label: 'Status',
              type: 'select',
              value: filterStatus,
              onChange: (e) => setFilterStatus(e.target.value),
              options: [
                { value: '', label: '-- All Statuses --' },
                { value: 'draft', label: 'Draft' },
                { value: 'submitted', label: 'Submitted for Review' },
              ],
            },
            {
              id: 'filterPeriod',
              label: 'Period',
              type: 'select',
              value: filterPeriod,
              onChange: (e) => setFilterPeriod(e.target.value),
              options: [
                { value: '', label: '-- All Periods --' },
                ...periods.map(period => ({ value: period, label: period }))
              ],
            },
          ]}
          buttons={[
            {
              label: 'Reset Filters',
              variant: 'secondary',
              onClick: handleReset,
            },
          ]}
        />
        
        {/* Toolbar */}
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-4">
            <Button
              type="button"
              variant="pride"
              className="flex items-center gap-2 mb-4 sm:mb-0"
              onClick={handleAddNew}
            >
              <DocumentPlusIcon className="h-5 w-5" aria-hidden="true" />
              Create New Agreement
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {filteredAgreements.length > 0 
                  ? `(${filteredAgreements.length}) Records Found` 
                  : 'No Records Found'}
              </span>
            </div>
          </div>
          
          {/* Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Agreement Name</TableHeader>
                <TableHeader>Period</TableHeader>
                <TableHeader>Supervisor</TableHeader>
                <TableHeader>HOD/Line Manager</TableHeader>
                <TableHeader>Created</TableHeader>
                <TableHeader>Submitted</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAgreements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No agreements found. Click "Create New Agreement" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgreements.map((agreement) => (
                  <TableRow key={agreement.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{agreement.title}</div>
                    </TableCell>
                    <TableCell>{agreement.period}</TableCell>
                    <TableCell>{agreement.title}</TableCell>
                    <TableCell>{agreement.title}</TableCell>
                    <TableCell>
                      <div>
                        {formatDate(agreement.createdDate)}
                        <span className="block text-xs text-gray-500 mt-1">
                          {getTimeAgo(agreement.createdDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {agreement.submittedDate ? (
                        <div>
                          {formatDate(agreement.submittedDate)}
                          <span className="block text-xs text-gray-500 mt-1">
                            {getTimeAgo(agreement.submittedDate)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Not submitted yet</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={agreement.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {agreement.status === 'draft' && (
                          <>
                            <button
                              onClick={() => handleEdit(agreement)}
                              className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                              <span>Edit</span>
                            </button>
                            
                            <button
                              onClick={() => handleSubmit(agreement)}
                              className="text-teal-600 hover:text-teal-900 flex items-center space-x-1"
                            >
                              <ArrowUpTrayIcon className="h-4 w-4" />
                              <span>Submit</span>
                            </button>
                          </>
                        )}
                        
                        {agreement.status === 'submitted' && (
                          <span className="text-gray-500 text-sm">
                            Under Review
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        closeModal={() => setIsSubmitModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        agreement={selectedAgreement}
      />
    </div>
  );
};

export default AgreementList;
