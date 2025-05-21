import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import FilterBox from '../../../components/ui/FilterBox';
import { DocumentPlusIcon, ClockIcon, CheckCircleIcon, PencilIcon, UserCircleIcon, CalendarDaysIcon, DocumentCheckIcon, PlayIcon, PaperAirplaneIcon, EyeIcon } from '@heroicons/react/20/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AppraisalActions from './AppraisalActions';
import AppraisalToolbar from './AppraisalToolbar';
import Pagination from '../../../components/ui/Pagination';
import { useAuth } from '../../../hooks/useAuth';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_supervisor: { label: 'Pending Supervisor Rating', color: 'bg-amber-100 text-amber-700', icon: ClockIcon },
    supervisor_in_progress: { label: 'Rating In Progress', color: 'bg-blue-100 text-blue-700', icon: PencilIcon },
    supervisor_completed: { label: 'Rating Completed', color: 'bg-green-100 text-green-700', icon: CheckCircleIcon },
    employee_reviewing: { label: 'Employee Reviewing', color: 'bg-purple-100 text-purple-700', icon: DocumentCheckIcon },
    pending_hod: { label: 'Pending HOD Approval', color: 'bg-indigo-100 text-indigo-700', icon: ClockIcon },
    completed: { label: 'Completed', color: 'bg-teal-100 text-teal-700', icon: CheckCircleIcon }
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
                      Submit Supervisor Rating
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Are you sure you want to submit your supervisor rating for this appraisal?
                    </p>
                    <p className="text-amber-600 text-sm">
                      Once submitted, the employee will be able to review your rating. You won't be able to make changes after submission.
                    </p>
                    
                    <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                      <p className="font-medium">Appraisal Details:</p>
                      <p>Employee: {appraisal?.employeeName}</p>
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
                      Submit Rating
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
                          <span>{appraisal?.employeeName} - {appraisal?.employeeTitle}</span>
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
                            <td className="px-4 py-3 text-sm text-gray-900 border-r">{appraisal?.totalPartA || '78'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r">{appraisal?.totalPartB || '85'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{appraisal?.totalScore || '83'}</td>
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
                              (appraisal?.totalScore || 83) >= 91 ? 'bg-green-100 text-green-800' :
                              (appraisal?.totalScore || 83) >= 76 ? 'bg-blue-100 text-blue-800' :
                              (appraisal?.totalScore || 83) >= 60 ? 'bg-teal-100 text-teal-800' :
                              (appraisal?.totalScore || 83) >= 50 ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {
                                (appraisal?.totalScore || 83) >= 91 ? 'Excellent' :
                                (appraisal?.totalScore || 83) >= 76 ? 'Very Good' :
                                (appraisal?.totalScore || 83) >= 60 ? 'Good' :
                                (appraisal?.totalScore || 83) >= 50 ? 'Fair' :
                                (appraisal?.totalScore || 83) >= 40 ? 'Below Average' : 'Not Rated'
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
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

const SupervisorRating = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterBranch, setFilterBranch] = useState(''); // Add branch filter state
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  // Modal states
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false); // Add assessment modal state
  
  // Sample appraisal data - would be fetched from API in real app
  const [appraisals, setAppraisals] = useState([
    {
      id: 1,
      agreementTitle: 'Performance Agreement 2025',
      agreementId: 1,
      employeeName: 'John Smith',
      employeeTitle: 'Software Engineer',
      department: 'Information Technology',
      branch: 'Head Office',
      period: 'Annual Review',
      createdDate: '2025-01-15',
      submittedDate: '2025-05-10',
      status: 'pending_supervisor',
      indicators: [
        { id: 101, name: "Code Quality Improvement", targetValue: "95%", actualValue: "92%", weight: "15%", self_rating: "4", supervisor_rating: "", measurement_type: "percentage" },
        { id: 102, name: "Project Completion Rate", targetValue: "100%", actualValue: "98%", weight: "15%", self_rating: "4", supervisor_rating: "", measurement_type: "percentage" },
        { id: 103, name: "Bug Resolution Time", targetValue: "24 hours", actualValue: "22 hours", weight: "10%", self_rating: "5", supervisor_rating: "", measurement_type: "number" }
      ]
    },
    {
      id: 2,
      agreementTitle: 'Performance Agreement 2024',
      agreementId: 2,
      employeeName: 'Sarah Johnson',
      employeeTitle: 'Marketing Specialist',
      department: 'Marketing',
      branch: 'Kampala Branch',
      period: 'Quarterly Review',
      createdDate: '2024-10-01',
      submittedDate: '2024-12-15',
      status: 'supervisor_in_progress',
      indicators: [
        { id: 201, name: "Campaign Conversion Rate", targetValue: "15%", actualValue: "17%", weight: "20%", self_rating: "5", supervisor_rating: "4", measurement_type: "percentage" },
        { id: 202, name: "Content Creation Volume", targetValue: "50", actualValue: "45", weight: "15%", self_rating: "4", supervisor_rating: "", measurement_type: "number" },
        { id: 203, name: "Social Media Engagement", targetValue: "25%", actualValue: "22%", weight: "10%", self_rating: "3", supervisor_rating: "3", measurement_type: "percentage" }
      ]
    },
    {
      id: 3,
      agreementTitle: 'Performance Agreement 2024',
      agreementId: 3,
      employeeName: 'Michael Brown',
      employeeTitle: 'Financial Analyst',
      department: 'Finance',
      branch: 'Head Office',
      period: 'Annual Review',
      createdDate: '2024-01-10',
      submittedDate: '2024-12-05',
      status: 'supervisor_completed',
      indicators: [
        { id: 301, name: "Budget Accuracy", targetValue: "98%", actualValue: "97%", weight: "25%", self_rating: "4", supervisor_rating: "4", measurement_type: "percentage" },
        { id: 302, name: "Financial Report Timeliness", targetValue: "100%", actualValue: "100%", weight: "20%", self_rating: "5", supervisor_rating: "5", measurement_type: "percentage" }
      ]
    },
    {
      id: 4,
      agreementTitle: 'Performance Agreement 2023',
      agreementId: 4,
      employeeName: 'Jessica Lee',
      employeeTitle: 'Customer Service Representative',
      department: 'Customer Support',
      branch: 'Entebbe Branch',
      period: 'Annual Review',
      createdDate: '2023-01-15',
      submittedDate: '2023-12-10',
      status: 'employee_reviewing',
      indicators: [
        { id: 401, name: "Customer Satisfaction Score", targetValue: "90%", actualValue: "92%", weight: "30%", self_rating: "4", supervisor_rating: "5", measurement_type: "percentage" },
        { id: 402, name: "Response Time", targetValue: "2 hours", actualValue: "1.8 hours", weight: "20%", self_rating: "4", supervisor_rating: "4", measurement_type: "number" },
        { id: 403, name: "Issue Resolution Rate", targetValue: "95%", actualValue: "94%", weight: "20%", self_rating: "4", supervisor_rating: "4", measurement_type: "percentage" }
      ]
    },
    {
      id: 5,
      agreementTitle: 'Performance Agreement 2023',
      agreementId: 5,
      employeeName: 'David Wilson',
      employeeTitle: 'Operations Manager',
      department: 'Operations',
      branch: 'Jinja Branch',
      period: 'Annual Review',
      createdDate: '2023-01-10',
      submittedDate: '2023-12-08',
      status: 'pending_hod',
      indicators: [
        { id: 501, name: "Operational Efficiency", targetValue: "85%", actualValue: "87%", weight: "25%", self_rating: "5", supervisor_rating: "4", measurement_type: "percentage" },
        { id: 502, name: "Cost Reduction", targetValue: "10%", actualValue: "8%", weight: "15%", self_rating: "3", supervisor_rating: "3", measurement_type: "percentage" },
        { id: 503, name: "Process Improvement", targetValue: "5", actualValue: "6", weight: "10%", self_rating: "5", supervisor_rating: "5", measurement_type: "number" }
      ]
    },
    {
      id: 6,
      agreementTitle: 'Performance Agreement 2022',
      agreementId: 6,
      employeeName: 'Robert Chen',
      employeeTitle: 'Research Analyst',
      department: 'Research',
      branch: 'Mbarara Branch',
      period: 'Annual Review',
      createdDate: '2022-01-15',
      submittedDate: '2022-12-10',
      status: 'completed',
      indicators: [
        { id: 601, name: "Research Report Quality", targetValue: "90%", actualValue: "92%", weight: "25%", self_rating: "5", supervisor_rating: "4", measurement_type: "percentage" },
        { id: 602, name: "Data Analysis Accuracy", targetValue: "98%", actualValue: "99%", weight: "20%", self_rating: "5", supervisor_rating: "5", measurement_type: "percentage" }
      ]
    }
  ]);
  
  // Filter appraisals based on filter criteria
  const [filteredAppraisals, setFilteredAppraisals] = useState(appraisals);
  
  // Apply filters when filter state changes
  useEffect(() => {
    let filtered = appraisals;
    
    // Filter by text (employee name or agreement title)
    if (filterText) {
      filtered = filtered.filter(appraisal => 
        appraisal.employeeName.toLowerCase().includes(filterText.toLowerCase()) ||
        appraisal.agreementTitle.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    
    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter(appraisal => appraisal.status === filterStatus);
    }
    
    // Filter by period
    if (filterPeriod) {
      filtered = filtered.filter(appraisal => appraisal.period === filterPeriod);
    }
    
    // Filter by department
    if (filterDepartment) {
      filtered = filtered.filter(appraisal => appraisal.department === filterDepartment);
    }
    
    // Filter by branch
    if (filterBranch) {
      filtered = filtered.filter(appraisal => appraisal.branch === filterBranch);
    }
    
    setFilteredAppraisals(filtered);
  }, [filterText, filterStatus, filterPeriod, filterDepartment, filterBranch, appraisals]);
  
  // Apply pagination
  const totalPages = Math.ceil(filteredAppraisals.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const paginatedAppraisals = filteredAppraisals.slice(indexOfFirstRecord, indexOfLastRecord);
  
  // Handler functions
  const handleStartRating = (appraisal) => {
    navigate(`/performance/rating/supervisor/edit/${appraisal.id}`);
  };
  
  const handleSubmitRating = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setIsSubmitModalOpen(true);
  };
  
  const handleConfirmSubmit = () => {
    // In a real app, this would make an API call to submit the rating
    const updatedAppraisals = appraisals.map(appraisal => {
      if (appraisal.id === selectedAppraisal.id) {
        return { ...appraisal, status: 'supervisor_completed' };
      }
      return appraisal;
    });
    
    setAppraisals(updatedAppraisals);
    alert('Supervisor rating submitted successfully!');
  };
  
  const handlePreview = (appraisal) => {
    console.log("Preview appraisal:", appraisal);
    // In a real app, this would navigate to a preview page
    // navigate(`/performance/rating/supervisor/preview/${appraisal.id}`);
  };

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterPeriod('');
    setFilterDepartment('');
    setFilterBranch(''); // Reset branch filter
  };
  
  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleViewAssessment = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setIsAssessmentModalOpen(true);
  };
  
  // Get unique values for filter dropdowns
  const periods = [...new Set(appraisals.map(a => a.period))];
  const departments = [...new Set(appraisals.map(a => a.department))];
  const branches = [...new Set(appraisals.map(a => a.branch))]; // Get unique branches
  
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
          <h1 className="text-xl font-bold text-gray-800">Supervisor Rating</h1>
          <p className="text-sm text-gray-600 mt-1">
            Rate the performance of your team members against their KPIs
          </p>
        </div>
        <OverallProgress progress={65} riskStatus={false} />
      </div>
      
      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="Supervisor Rating Filters"
          filters={[
            {
              id: 'filterText',
              label: 'Search',
              type: 'text',
              placeholder: 'Search by employee name or agreement...',
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
                { value: 'pending_supervisor', label: 'Pending Supervisor Rating' },
                { value: 'supervisor_in_progress', label: 'Rating In Progress' },
                { value: 'supervisor_completed', label: 'Rating Completed' },
                { value: 'employee_reviewing', label: 'Employee Reviewing' },
                { value: 'pending_hod', label: 'Pending HOD Approval' },
                { value: 'completed', label: 'Completed' },
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
                <TableHeader>Employee</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Branch/Unit</TableHeader> 
                <TableHeader>Agreement</TableHeader>
                <TableHeader>Submitted</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAppraisals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No appraisals found that require your review.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAppraisals.map((appraisal) => (
                  <TableRow key={appraisal.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{appraisal.employeeName}</div>
                      <div className="text-xs text-gray-500">{appraisal.employeeTitle}</div>
                    </TableCell>
                    <TableCell>{appraisal.department}</TableCell>
                    <TableCell>{appraisal.branch}</TableCell> {/* Add Branch/Unit cell */}
                    <TableCell>
                      <div className="text-sm text-gray-900">{appraisal.agreementTitle}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {appraisal.indicators.length} KPIs to rate
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {formatDate(appraisal.submittedDate)}
                        <span className="block text-xs text-gray-500 mt-1">
                          {getTimeAgo(appraisal.submittedDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={appraisal.status} />
                    </TableCell>
                    <TableCell>
                      {appraisal.status === 'employee_reviewing' ? (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handlePreview(appraisal)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
                          >
                            <EyeIcon className="w-4 h-4" />
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
                      ) : appraisal.status === 'supervisor_completed' ? (
                        <button
                          onClick={() => handlePreview(appraisal)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span>Preview</span>
                        </button>
                      ) : (appraisal.status === 'pending_hod' || 
                         appraisal.status === 'completed') ? (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handlePreview(appraisal)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
                          >
                            <EyeIcon className="w-4 h-4" />
                            <span>Preview</span>
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
                      
                      {appraisal.status === 'pending_supervisor' && (
                        <span className="text-xs text-gray-500 block mt-1">
                          Awaiting your rating
                        </span>
                      )}
                      {appraisal.status === 'employee_reviewing' && (
                        <span className="text-xs text-gray-500 block mt-1">
                          Employee is reviewing your rating
                        </span>
                      )}
                      {appraisal.status === 'pending_hod' && (
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
      
      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        closeModal={() => setIsSubmitModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        appraisal={selectedAppraisal}
      />

      {/* Overall Assessment Modal */}
      <OverallAssessmentModal
        isOpen={isAssessmentModalOpen}
        closeModal={() => setIsAssessmentModalOpen(false)}
        appraisal={selectedAppraisal}
      />
    </div>
  );
};

export default SupervisorRating;
