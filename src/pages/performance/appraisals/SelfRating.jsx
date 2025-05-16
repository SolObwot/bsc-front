import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import FilterBox from '../../../components/ui/FilterBox';
import Button from '../../../components/ui/Button';
import { DocumentPlusIcon, ClockIcon, CheckCircleIcon, PencilIcon, UserCircleIcon, CalendarDaysIcon, DocumentCheckIcon } from '@heroicons/react/20/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import AppraisalActions from './AppraisalActions';
import AppraisalToolbar from './AppraisalToolbar';
import Pagination from '../../../components/ui/Pagination';
import AppraisalModal from '../../../components/balancescorecard/modals/AppraisalModal';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_rating: { label: 'Pending Rating', color: 'bg-gray-100 text-gray-700', icon: ClockIcon },
    in_progress: { label: 'Rating In Progress', color: 'bg-blue-100 text-blue-700', icon: PencilIcon },
    submitted: { label: 'Submitted to Supervisor', color: 'bg-green-100 text-green-700', icon: CheckCircleIcon },
    supervisor_reviewed: { label: 'Supervisor Reviewed', color: 'bg-purple-100 text-purple-700', icon: DocumentCheckIcon }
  };

  const config = statusConfig[status] || statusConfig.pending_rating;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </span>
  );
};

// Confirmation Modal Component
const SubmitConfirmationModal = ({ isOpen, closeModal, onConfirm, appraisal }) => {
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
                      Submit Self-Rating
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Are you sure you want to submit your self-rating for supervisor review?
                    </p>
                    <p className="text-amber-600 text-sm">
                      Once submitted, you won't be able to modify your ratings.
                    </p>
                    
                    <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                      <p className="font-medium">Appraisal Details:</p>
                      <p>Agreement: {appraisal?.agreementTitle}</p>
                      <p>Period: {appraisal?.period}</p>
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
                      Submit Self-Rating
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

// Overall Assessment Modal Component
const OverallAssessmentModal = ({ isOpen, closeModal, appraisal }) => {
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
                      Overall Assessment Score
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-7 pt-7 pb-4">
                  <div className="space-y-6">
                    {/* Enhanced Summary Section */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-lg text-gray-800 mb-2">{appraisal?.agreementTitle}</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <UserCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{appraisal?.employeeName || 'Current User'} - {appraisal?.employeeTitle || 'Position'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Period: {appraisal?.period}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Submitted: {appraisal?.submittedDate ? new Date(appraisal.submittedDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div>
                          <StatusBadge status={appraisal?.status} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th colSpan="4" className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider border-b">
                              OVERALL ASSESSMENT: (Overall assessment to be obtained by getting a total of Part A and B of the KPIs)
                            </th>
                          </tr>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                              SCORE
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                              Part A (Quantative Objectives)
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                              Part B (Qualitative Objectives)
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r">TOTAL POINTS</td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r">{appraisal?.totalPartA || '0'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r">{appraisal?.totalPartB || '0'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{appraisal?.totalScore || '0'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                              Total Score Points
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                              100 – 91
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                              90 – 76
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                              75 – 60
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                              59 – 50
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              49-40
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900 border-r">Assessment</td>
                            <td className="px-4 py-2 text-sm text-center font-medium text-green-700 border-r">Excellent</td>
                            <td className="px-4 py-2 text-sm text-center font-medium text-blue-700 border-r">Very Good</td>
                            <td className="px-4 py-2 text-sm text-center font-medium text-teal-700 border-r">Good</td>
                            <td className="px-4 py-2 text-sm text-center font-medium text-amber-700 border-r">Fair</td>
                            <td className="px-4 py-2 text-sm text-center font-medium text-red-700">Below Average</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900 border-r">Overall Assessment</td>
                            <td colSpan="5" className={`px-4 py-2 text-sm text-center font-bold ${
                              appraisal?.totalScore >= 91 ? 'bg-green-100 text-green-800' :
                              appraisal?.totalScore >= 76 ? 'bg-blue-100 text-blue-800' :
                              appraisal?.totalScore >= 60 ? 'bg-teal-100 text-teal-800' :
                              appraisal?.totalScore >= 50 ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {
                                appraisal?.totalScore >= 91 ? 'Excellent' :
                                appraisal?.totalScore >= 76 ? 'Very Good' :
                                appraisal?.totalScore >= 60 ? 'Good' :
                                appraisal?.totalScore >= 50 ? 'Fair' :
                                appraisal?.totalScore >= 40 ? 'Below Average' : 'Not Rated'
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={closeModal}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Close
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

const SelfRating = () => {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  
  // Modal states
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  const [isAppraisalModalOpen, setIsAppraisalModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  
  // Sample appraisal data
  const [appraisals, setAppraisals] = useState([
    {
      id: 1,
      agreementTitle: 'Performance Agreement 2025',
      agreementId: 1,
      period: 'Annual Review',
      createdDate: '2025-05-01',
      submittedDate: null,
      status: 'pending_rating',
      indicators: [
        { id: 101, name: "Revenue Growth Rate", targetValue: "15%", actualValue: "", weight: "15%", self_rating: "", supervisor_rating: "", measurement_type: "percentage" },
        { id: 102, "name": "Customer Satisfaction Score", targetValue: "4.5", actualValue: "", weight: "10%", self_rating: "", supervisor_rating: "", measurement_type: "number" },
        { id: 103, name: "Employee Retention Rate", targetValue: "90%", actualValue: "", weight: "10%", self_rating: "", supervisor_rating: "", measurement_type: "percentage" }
      ]
    },
    {
      id: 2,
      agreementTitle: 'Performance Agreement 2024',
      agreementId: 2,
      period: 'Probation 6 months',
      createdDate: '2023-12-10',
      submittedDate: '2024-01-05',
      status: 'in_progress',
      indicators: [
        { id: 201, name: "New Product Launch", targetValue: "2024-06-30", actualValue: "", weight: "20%", self_rating: "4", supervisor_rating: "", measurement_type: "date" },
        { id: 202, name: "Cost Reduction", targetValue: "10%", actualValue: "", weight: "15%", self_rating: "", supervisor_rating: "", measurement_type: "percentage" }
      ]
    },
    {
      id: 3,
      agreementTitle: 'Performance Agreement 2023',
      agreementId: 3,
      period: 'Annual Review',
      createdDate: '2023-01-15',
      submittedDate: '2023-12-15',
      status: 'submitted',
      indicators: [
        { id: 301, name: "Market Share Growth", targetValue: "5%", actualValue: "6%", weight: "25%", self_rating: "5", supervisor_rating: "4", measurement_type: "percentage" },
        { id: 302, name: "Team Training Hours", targetValue: "40", actualValue: "35", weight: "10%", self_rating: "3", supervisor_rating: "3", measurement_type: "number" }
      ]
    },
    {
      id: 4,
      agreementTitle: 'Performance Agreement 2022',
      agreementId: 4,
      period: 'Annual Review',
      createdDate: '2022-01-10',
      submittedDate: '2022-12-10',
      reviewedDate: '2023-01-15',
      status: 'supervisor_reviewed',
      totalPartA: '78',
      totalPartB: '85',
      totalScore: '84',
      employeeName: 'John Smith',
      employeeTitle: 'Senior Developer',
      department: 'Information Technology',
      branch: 'Head Office',
      indicators: [
        { id: 401, name: "Sales Revenue", targetValue: "$1M", actualValue: "$1.2M", weight: "30%", self_rating: "5", supervisor_rating: "4", measurement_type: "currency" },
        { id: 402, name: "Customer Retention", targetValue: "85%", actualValue: "87%", weight: "20%", self_rating: "4", supervisor_rating: "4", measurement_type: "percentage" },
        { id: 403, name: "Project Completion", targetValue: "12", actualValue: "10", weight: "15%", self_rating: "3", supervisor_rating: "3", measurement_type: "number" }
      ]
    }
  ]);
  
  // Filter appraisals based on filter criteria
  const [filteredAppraisals, setFilteredAppraisals] = useState(appraisals);
  
  // Apply filters when filter state changes
  useEffect(() => {
    let filtered = appraisals;
    
    if (filterText) {
      filtered = filtered.filter(appraisal => 
        appraisal.agreementTitle.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    
    if (filterStatus) {
      filtered = filtered.filter(appraisal => appraisal.status === filterStatus);
    }
    
    if (filterPeriod) {
      filtered = filtered.filter(appraisal => appraisal.period === filterPeriod);
    }
    
    setFilteredAppraisals(filtered);
  }, [filterText, filterStatus, filterPeriod, appraisals]);
  
  // Apply pagination
  const totalPages = Math.ceil(filteredAppraisals.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const paginatedAppraisals = filteredAppraisals.slice(indexOfFirstRecord, indexOfLastRecord);
  
  // Handler functions
  const handleStartRating = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setIsAppraisalModalOpen(true);
  };
  
  const handleSubmitRating = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setIsSubmitModalOpen(true);
  };
  
  const handleViewAssessment = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setIsAssessmentModalOpen(true);
  };
  
  const handlePreview = (appraisal) => {
    console.log("Preview appraisal:", appraisal);
  };

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterPeriod('');
  };
  
  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Get unique periods for filter dropdown
  const periods = [...new Set(appraisals.map(a => a.period))];
  
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
        <div>
          <h1 className="text-xl font-bold text-gray-800">Self-Rating</h1>
          <p className="text-sm text-gray-600 mt-1">
            Rate your performance against your agreed KPIs
          </p>
        </div>
        <OverallProgress progress={75} riskStatus={false} />
      </div>
      
      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="Self-Rating Filters"
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
                { value: 'pending_rating', label: 'Pending Rating' },
                { value: 'in_progress', label: 'Rating In Progress' },
                { value: 'submitted', label: 'Submitted to Supervisor' },
                { value: 'supervisor_reviewed', label: 'Supervisor Reviewed' },
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
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
          <AppraisalToolbar
            recordsPerPage={recordsPerPage}
            onRecordsPerPageChange={handleRecordsPerPageChange}
            totalRecords={filteredAppraisals.length}
            showCreateButton={false}
          />
          
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Agreement</TableHeader>
                <TableHeader>Period</TableHeader>
                <TableHeader>Created Date</TableHeader>
                <TableHeader>Submitted Date</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAppraisals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No appraisals found. Please contact your supervisor if you believe this is an error.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAppraisals.map((appraisal) => (
                  <TableRow key={appraisal.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{appraisal.agreementTitle}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {appraisal.indicators.length} KPIs to rate
                      </div>
                    </TableCell>
                    <TableCell>{appraisal.period}</TableCell>
                    <TableCell>
                      <div>
                        {formatDate(appraisal.createdDate)}
                        <span className="block text-xs text-gray-500 mt-1">
                          {getTimeAgo(appraisal.createdDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {appraisal.submittedDate ? (
                        <div>
                          {formatDate(appraisal.submittedDate)}
                          <span className="block text-xs text-gray-500 mt-1">
                            {getTimeAgo(appraisal.submittedDate)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Not submitted yet</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={appraisal.status} />
                    </TableCell>
                    <TableCell>
                      {appraisal.status === 'submitted' ? (
                        <button
                          onClick={() => handlePreview(appraisal)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
                        >
                          <DocumentCheckIcon className="w-4 h-4" />
                          <span>Preview</span>
                        </button>
                      ) : appraisal.status === 'supervisor_reviewed' ? (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handlePreview(appraisal)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
                          >
                            <DocumentCheckIcon className="w-4 h-4" />
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => handleViewAssessment(appraisal)}
                            className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
                          >
                            <DocumentCheckIcon className="w-4 h-4" />
                            <span>Overall Assessment</span>
                          </button>
                        </div>
                      ) : (
                        <AppraisalActions
                          appraisal={appraisal}
                          onStartRating={handleStartRating}
                          onSubmit={handleSubmitRating}
                          onPreview={handlePreview}
                          showOnlyRatingButtons={true}
                        />
                      )}
                      
                      {appraisal.status === 'submitted' && (
                        <span className="text-xs text-gray-500 block mt-1">
                          Waiting for supervisor rating
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
      
      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        closeModal={() => setIsSubmitModalOpen(false)}
        onConfirm={() => {}}
        appraisal={selectedAppraisal}
      />
      
      {/* Performance Rating Modal */}
      {selectedAppraisal && (
        <AppraisalModal 
          isOpen={isAppraisalModalOpen}
          closeModal={() => setIsAppraisalModalOpen(false)}
          indicator={selectedAppraisal.indicators[0]}
          onNavigate={() => {}}
          hasNext={false}
          hasPrevious={false}
          totalCount={selectedAppraisal.indicators.length}
          currentIndex={0}
          onSave={() => {}}
        />
      )}
      
      {/* Overall Assessment Modal */}
      <OverallAssessmentModal
        isOpen={isAssessmentModalOpen}
        closeModal={() => setIsAssessmentModalOpen(false)}
        appraisal={selectedAppraisal}
      />
    </div>
  );
};

export default SelfRating;
