import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import FilterBox from '../../../components/ui/FilterBox';
import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon, EyeIcon } from '@heroicons/react/20/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, UserCircleIcon, CalendarDaysIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import ConfirmationToolbar from './ConfirmationToolbar';
import Pagination from '../../../components/ui/Pagination';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/ui/Button';
import ConfirmationActions from './ConfirmationActions';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_supervisor: { label: 'Pending Supervisor Review', color: 'bg-amber-100 text-amber-700', icon: ClockIcon },
    pending_hod: { label: 'Pending HOD Approval', color: 'bg-indigo-100 text-indigo-700', icon: ClockIcon }
  };

  const config = statusConfig[status] || statusConfig.pending_supervisor;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </span>
  );
};

// Recommendation Modal Component
const RecommendationModal = ({ isOpen, closeModal, onSubmit, confirmation }) => {
  const [formData, setFormData] = useState({
    strengths: '',
    improvements: '',
    actionPlan: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.strengths.trim()) {
      newErrors.strengths = 'Employee strengths are required';
    }
    if (!formData.improvements.trim()) {
      newErrors.improvements = 'Areas for improvement are required';
    }
    if (!formData.actionPlan.trim()) {
      newErrors.actionPlan = 'Action plan/training required is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all border border-teal-100">
                <div className="bg-teal-50 px-6 py-5 border-b border-teal-100">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold text-gray-700">
                      Submit Recommendation
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-7 pt-7 pb-4 max-h-[80vh] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Enhanced Confirmation Details Section */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                      <h3 className="font-medium text-lg text-gray-800 mb-2">Supervisor Probation Confirmation Review</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <UserCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{confirmation?.employeeName}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Position: {confirmation?.position}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Period: {confirmation?.probationPeriod}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Submitted: {confirmation?.submittedDate ? new Date(confirmation.submittedDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="col-span-2">
                          <StatusBadge status={confirmation?.status} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="strengths" className="block text-sm font-medium text-gray-700 mb-1">
                        Strengths <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="strengths"
                        name="strengths"
                        value={formData.strengths}
                        onChange={handleChange}
                        rows={3}
                        className={`block w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm resize-none p-2 ${
                          errors.strengths ? 'border-red-300' : 'border-gray-300'
                        } border`}
                        placeholder="Enter employee's strengths and positive contributions"
                        required
                      ></textarea>
                      {errors.strengths && (
                        <p className="mt-1 text-sm text-red-600">{errors.strengths}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="improvements" className="block text-sm font-medium text-gray-700 mb-1">
                        Areas for Improvement <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="improvements"
                        name="improvements"
                        value={formData.improvements}
                        onChange={handleChange}
                        rows={3}
                        className={`block w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm resize-none p-2 ${
                          errors.improvements ? 'border-red-300' : 'border-gray-300'
                        } border`}
                        placeholder="Enter areas where the employee needs to improve"
                        required
                      ></textarea>
                      {errors.improvements && (
                        <p className="mt-1 text-sm text-red-600">{errors.improvements}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="actionPlan" className="block text-sm font-medium text-gray-700 mb-1">
                        Action Plan/Training Required <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="actionPlan"
                        name="actionPlan"
                        value={formData.actionPlan}
                        onChange={handleChange}
                        rows={4}
                        className={`block w-full rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm resize-none p-2 ${
                          errors.actionPlan ? 'border-red-300' : 'border-gray-300'
                        } border`}
                        placeholder="Enter specific action plans or training recommendations for the employee"
                        required
                      ></textarea>
                      {errors.actionPlan && (
                        <p className="mt-1 text-sm text-red-600">{errors.actionPlan}</p>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                      >
                        Submit Recommendation
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const SupervisorConfirmation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  // Modal states
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);
  const [selectedConfirmation, setSelectedConfirmation] = useState(null);
  
  // Sample confirmation data - would be fetched from API in real app
  const [confirmations, setConfirmations] = useState([
    {
      id: 1,
      employeeName: 'John Smith',
      position: 'Software Engineer',
      department: 'Information Technology',
      branch: 'Head Office',
      probationPeriod: '6 months',
      startDate: '2023-10-15',
      endDate: '2024-04-15',
      submittedDate: '2024-04-01',
      status: 'pending_supervisor',
      strengths: '',
      improvements: '',
      actionPlan: ''
    },
    {
      id: 4,
      employeeName: 'Jessica Lee',
      position: 'Customer Service Representative',
      department: 'Customer Support',
      branch: 'Entebbe Branch',
      probationPeriod: '3 months',
      startDate: '2023-12-01',
      endDate: '2024-03-01',
      submittedDate: '2024-02-25',
      status: 'pending_hod',
      strengths: 'Excellent customer handling. Resolves issues efficiently.',
      improvements: 'Technical knowledge could be improved.',
      actionPlan: 'Schedule one-on-one training with IT team on system features.'
    }
  ]);
  
  // Filter confirmations based on filter criteria
  const [filteredConfirmations, setFilteredConfirmations] = useState(confirmations);
  
  // Apply filters when filter state changes
  useEffect(() => {
    let filtered = confirmations;
    
    // Filter by text (employee name)
    if (filterText) {
      filtered = filtered.filter(confirmation => 
        confirmation.employeeName.toLowerCase().includes(filterText.toLowerCase()) ||
        confirmation.position.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    
    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter(confirmation => confirmation.status === filterStatus);
    }
    
    // Filter by department
    if (filterDepartment) {
      filtered = filtered.filter(confirmation => confirmation.department === filterDepartment);
    }
    
    // Filter by branch
    if (filterBranch) {
      filtered = filtered.filter(confirmation => confirmation.branch === filterBranch);
    }
    
    setFilteredConfirmations(filtered);
  }, [filterText, filterStatus, filterDepartment, filterBranch, confirmations]);
  
  // Apply pagination
  const totalPages = Math.ceil(filteredConfirmations.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const paginatedConfirmations = filteredConfirmations.slice(indexOfFirstRecord, indexOfLastRecord);
  
  // Handler functions
  const handleRecommend = (confirmation) => {
    setSelectedConfirmation(confirmation);
    setIsRecommendationModalOpen(true);
  };
  
  const handleSubmitRecommendation = (formData) => {
    // In a real app, this would make an API call to submit the recommendation
    const updatedConfirmations = confirmations.map(confirmation => {
      if (confirmation.id === selectedConfirmation.id) {
        return { 
          ...confirmation, 
          status: 'pending_hod',
          strengths: formData.strengths,
          improvements: formData.improvements,
          actionPlan: formData.actionPlan
        };
      }
      return confirmation;
    });
    
    setConfirmations(updatedConfirmations);
    setIsRecommendationModalOpen(false);
    alert('Recommendation submitted successfully. The confirmation is now pending HOD approval.');
  };
  
  const handlePreview = (confirmation) => {
    console.log("Preview confirmation:", confirmation);
    // In a real app, this would navigate to a preview page
  };

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterDepartment('');
    setFilterBranch('');
  };
  
  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleStartReview = (confirmation) => {
    handleRecommend(confirmation);
  };
  
  // Get unique values for filter dropdowns
  const departments = [...new Set(confirmations.map(c => c.department))];
  const branches = [...new Set(confirmations.map(c => c.branch))];
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Calculate remaining days
  const calculateRemainingDays = (endDate) => {
    if (!endDate) return 'N/A';
    
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Expired';
    } else if (diffDays === 0) {
      return 'Today';
    } else {
      return `${diffDays} days`;
    }
  };

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4 bg-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Supervisor Confirmation</h1>
          <p className="text-sm text-gray-600 mt-1">
            Review probation period performance for confirmation of permanent employment
          </p>
        </div>
        <OverallProgress progress={65} riskStatus={false} />
      </div>
      
      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="Confirmation Review Filters"
          filters={[
            {
              id: 'filterText',
              label: 'Search',
              type: 'text',
              placeholder: 'Search by employee name or position...',
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
                { value: 'pending_supervisor', label: 'Pending Supervisor Review' },
                { value: 'pending_hod', label: 'Pending HOD Approval' },
              ],
            },
            {
              id: 'filterDepartment',
              label: 'Department',
              type: 'select',
              value: filterDepartment,
              onChange: (e) => setFilterDepartment(e.target.value),
              options: [
                { value: '', label: '-- All Departments --' },
                ...departments.map(dept => ({ value: dept, label: dept }))
              ],
            },
            {
              id: 'filterBranch',
              label: 'Branch/Unit',
              type: 'select',
              value: filterBranch,
              onChange: (e) => setFilterBranch(e.target.value),
              options: [
                { value: '', label: '-- All Branches --' },
                ...branches.map(branch => ({ value: branch, label: branch }))
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
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
          <ConfirmationToolbar
            recordsPerPage={recordsPerPage}
            onRecordsPerPageChange={handleRecordsPerPageChange}
            totalRecords={filteredConfirmations.length}
            showCreateButton={false}
          />
          
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Employee</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Branch/Unit</TableHeader>
                <TableHeader>Probation Period</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedConfirmations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No confirmations found that require your review.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedConfirmations.map((confirmation) => (
                  <TableRow key={confirmation.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{confirmation.employeeName}</div>
                      <div className="text-xs text-gray-500">{confirmation.position}</div>
                    </TableCell>
                    <TableCell>{confirmation.department}</TableCell>
                    <TableCell>{confirmation.branch}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{confirmation.probationPeriod}</div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={confirmation.status} />
                    </TableCell>
                    <TableCell>
                      <ConfirmationActions
                        confirmation={confirmation}
                        onStartReview={handleStartReview}
                        onPreview={handlePreview}
                        showOnlyReviewButtons={confirmation.status === 'pending_hod'}
                      />
                      
                      {confirmation.status === 'pending_supervisor' && (
                        <span className="text-xs text-gray-500 block mt-1">
                          Awaiting your recommendation
                        </span>
                      )}
                      {confirmation.status === 'pending_hod' && (
                        <span className="text-xs text-gray-500 block mt-1">
                          Awaiting HOD approval
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      
      {/* Recommendation Modal */}
      <RecommendationModal
        isOpen={isRecommendationModalOpen}
        closeModal={() => setIsRecommendationModalOpen(false)}
        onSubmit={handleSubmitRecommendation}
        confirmation={selectedConfirmation}
      />
    </div>
  );
};

export default SupervisorConfirmation;
