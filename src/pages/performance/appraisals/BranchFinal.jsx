import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import FilterBox from '../../../components/ui/FilterBox';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, EyeIcon, DocumentCheckIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon, UserCircleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import AppraisalToolbar from './AppraisalToolbar';
import Pagination from '../../../components/ui/Pagination';
import AppraisalActions from './AppraisalActions';
import { useAuth } from '../../../hooks/useAuth';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_final: { label: 'Pending Final Approval', color: 'bg-amber-100 text-amber-700', icon: ClockIcon },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircleIcon }
  };

  const config = statusConfig[status] || statusConfig.pending_final;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </span>
  );
};

// Branch Final Approval Modal Component
const BranchFinalApprovalModal = ({ isOpen, closeModal, appraisal, onApprove, onReject }) => {
  const [branchComments, setBranchComments] = useState('');

  const handleApprove = () => {
    if (onApprove) {
      onApprove(appraisal, branchComments);
    }
    closeModal();
  };

  const handleReject = () => {
    if (branchComments.trim() === '') {
      alert('Please provide comments explaining why you are rejecting this appraisal');
      return;
    }
    
    if (onReject) {
      onReject(appraisal, branchComments);
    }
    closeModal();
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
                      Branch Final Approval
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-7 pt-7 pb-4 max-h-[80vh] overflow-y-auto">
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
                    
                    {/* Overall Assessment Section */}
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
                    
                    {/* Score Rating Table */}
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
                    
                    {/* Supervisor Comments Section */}
                    {appraisal?.supervisorComments && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-2">Supervisor Comments</h4>
                        <p className="text-sm text-gray-700">{appraisal.supervisorComments}</p>
                      </div>
                    )}
                    
                    {/* HOD Comments Section */}
                    {appraisal?.hodComments && (
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <h4 className="font-medium text-purple-800 mb-2">HOD Comments</h4>
                        <p className="text-sm text-gray-700">{appraisal.hodComments}</p>
                      </div>
                    )}
                    
                    {/* Peer Comments Section */}
                    {appraisal?.peerComments && (
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <h4 className="font-medium text-indigo-800 mb-2">Peer Reviewer Comments</h4>
                        <p className="text-sm text-gray-700">{appraisal.peerComments}</p>
                      </div>
                    )}
                    
                    {/* Branch Manager Final Comments Section */}
                    <div>
                      <label htmlFor="branchComments" className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Manager Final Comments
                      </label>
                      <textarea
                        id="branchComments"
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm resize-none p-2 border"
                        placeholder="Enter your final comments about this appraisal..."
                        value={branchComments}
                        onChange={(e) => setBranchComments(e.target.value)}
                      />
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
                      onClick={handleReject}
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Reject Appraisal
                    </button>
                    <button
                      onClick={handleApprove}
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Final Approval
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

const BranchFinal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  // Modal state
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  
  // Sample appraisal data
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
      status: 'pending_final',
      supervisorName: 'Jane Doe',
      peerApproverName: 'Robert Chen',
      hodName: 'Elizabeth Taylor',
      supervisorComments: 'John has shown remarkable improvement in his technical skills. His attention to detail has led to fewer bugs in production.',
      hodComments: 'I concur with the supervisor assessment. John has been a valuable asset to the team.',
      peerComments: 'John is always willing to help others and share his knowledge.',
      totalPartA: '82',
      totalPartB: '88',
      totalScore: '85'
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
      status: 'pending_final',
      supervisorName: 'Michael Wilson',
      peerApproverName: 'Lisa Miller',
      hodName: 'David Miller',
      supervisorComments: 'Sarah has exceeded expectations in her marketing campaigns. Customer engagement is up 15% since she implemented her new strategy.',
      hodComments: 'Approved. Sarah continues to be a high performer.',
      peerComments: 'Sarah consistently delivers high-quality work and is an asset to the marketing team.',
      totalPartA: '90',
      totalPartB: '85',
      totalScore: '87'
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
      status: 'completed',
      supervisorName: 'Robert Johnson',
      peerApproverName: 'James Wilson',
      hodName: 'Jennifer Lewis',
      branchManagerName: 'Daniel Smith',
      supervisorComments: 'Michael consistently delivers accurate financial reports ahead of schedule. His attention to detail is exemplary.',
      hodComments: 'Excellent work from Michael this year. His financial analysis has been instrumental in helping us make strategic decisions.',
      peerComments: 'As a peer reviewer, I can attest to Michael\'s expertise and professionalism. Always willing to help the team.',
      finalComments: 'Final approval granted. Michael has demonstrated exceptional performance throughout the review period.',
      totalPartA: '88',
      totalPartB: '92',
      totalScore: '90'
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
      status: 'completed',
      supervisorName: 'David Miller',
      peerApproverName: 'Susan Brown',
      hodName: 'James Wilson',
      branchManagerName: 'Thomas Johnson',
      supervisorComments: 'Jessica has maintained excellent customer satisfaction scores and has gone above and beyond to resolve complex issues.',
      hodComments: 'Jessica has been a valuable asset to the customer support team. Her dedication to resolving customer issues promptly is commendable.',
      peerComments: 'Jessica is an excellent team player who always shares knowledge and best practices.',
      finalComments: 'Final approval complete. Jessica\'s performance has been consistently high throughout the year.',
      totalPartA: '85',
      totalPartB: '80',
      totalScore: '83'
    }
  ]);
  
  // Filter appraisals based on filter criteria
  const [filteredAppraisals, setFilteredAppraisals] = useState(appraisals);
  
  // Apply filters when filter state changes
  useEffect(() => {
    let filtered = appraisals;
    
    if (filterText) {
      filtered = filtered.filter(appraisal => 
        appraisal.employeeName.toLowerCase().includes(filterText.toLowerCase()) ||
        appraisal.agreementTitle.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    
    if (filterStatus) {
      filtered = filtered.filter(appraisal => appraisal.status === filterStatus);
    }
    
    if (filterPeriod) {
      filtered = filtered.filter(appraisal => appraisal.period === filterPeriod);
    }
    
    if (filterDepartment) {
      filtered = filtered.filter(appraisal => appraisal.department === filterDepartment);
    }
    
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
  const handleReviewApprove = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setIsApprovalModalOpen(true);
  };
  
  const handleApprove = (appraisal, comments) => {
    const updatedAppraisals = appraisals.map(a => {
      if (a.id === appraisal.id) {
        return { 
          ...a, 
          status: 'completed', 
          finalComments: comments,
          branchManagerName: user?.name || 'Current Branch Manager' // In a real app, use the logged-in user's name
        };
      }
      return a;
    });
    
    setAppraisals(updatedAppraisals);
    alert('Appraisal has been given final approval successfully!');
  };
  
  const handleReject = (appraisal, comments) => {
    // In a real app, you might set a different status for rejected appraisals
    const updatedAppraisals = appraisals.map(a => {
      if (a.id === appraisal.id) {
        return { 
          ...a, 
          status: 'rejected', // You might want to define a new status for rejected appraisals
          finalComments: comments,
          branchManagerName: user?.name || 'Current Branch Manager' // In a real app, use the logged-in user's name
        };
      }
      return a;
    });
    
    setAppraisals(updatedAppraisals);
    alert('Appraisal has been rejected with comments!');
  };
  
  const handlePreview = (appraisal) => {
    console.log("Preview appraisal:", appraisal);
    // In a real app, navigate to a preview page or open a preview modal
  };

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterPeriod('');
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
  
  // Get unique values for filter dropdowns
  const periods = [...new Set(appraisals.map(a => a.period))];
  const departments = [...new Set(appraisals.map(a => a.department))];
  const branches = [...new Set(appraisals.map(a => a.branch))];

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4 bg-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Branch Final Assessment</h1>
          <p className="text-sm text-gray-600 mt-1">
            Give final approval for performance appraisals as Branch Manager
          </p>
        </div>
        <OverallProgress progress={65} riskStatus={false} />
      </div>
      
      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="Branch Final Assessment Filters"
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
                { value: 'pending_final', label: 'Pending Final Approval' },
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
                <TableHeader>Supervisor</TableHeader>
                <TableHeader>Peer Approver</TableHeader>
                <TableHeader>HOD</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAppraisals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No appraisals found that require final approval.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAppraisals.map((appraisal) => (
                  <TableRow key={appraisal.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{appraisal.employeeName}</div>
                      <div className="text-xs text-gray-500">{appraisal.employeeTitle}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {appraisal.agreementTitle}, {appraisal.period}
                      </div>
                    </TableCell>
                    <TableCell>{appraisal.department}</TableCell>
                    <TableCell>{appraisal.branch}</TableCell>
                    <TableCell>{appraisal.supervisorName}</TableCell>
                    <TableCell>{appraisal.peerApproverName}</TableCell>
                    <TableCell>{appraisal.hodName}</TableCell>
                    <TableCell>
                      <StatusBadge status={appraisal.status} />
                    </TableCell>
                    <TableCell>
                      {appraisal.status === 'completed' ? (
                        <button
                          onClick={() => handlePreview(appraisal)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5 cursor-pointer"
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span>Preview</span>
                        </button>
                      ) : (
                        <AppraisalActions
                          appraisal={appraisal}
                          onPreview={handlePreview}
                          onViewAssessment={handleReviewApprove}
                          showOnlyRatingButtons={false}
                          showReviewAsApprove={true}
                          showOnlyReviewAndPreview={true}
                        />
                      )}
                      
                      {appraisal.status === 'pending_final' && (
                        <span className="text-xs text-gray-500 block mt-1">
                          Awaiting your final approval
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
      
      {/* Branch Final Approval Modal */}
      <BranchFinalApprovalModal
        isOpen={isApprovalModalOpen}
        closeModal={() => setIsApprovalModalOpen(false)}
        appraisal={selectedAppraisal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default BranchFinal;
