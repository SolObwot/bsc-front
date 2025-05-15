import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon, UserCircleIcon, ClockIcon } from '@heroicons/react/20/solid';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import FilterBox from '../../../components/ui/FilterBox';
import AgreementToolbar from './AgreementToolbar';
import AgreementActions from './AgreementActions';
import Pagination from '../../../components/ui/Pagination';
import { useAuth } from '../../../hooks/useAuth';

// Mock data - would normally come from API
const agreements = [
  {
    id: 1,
    title: 'Performance Agreement 2025',
    employeeName: 'Derrick Katamba',
    employeeTitle: 'Software Engineer',
    department: 'Information Technology',
    branch: 'Head Office',
    period: 'Annual Review',
    submittedDate: '2024-07-15',
    status: 'pending_supervisor',
    supervisorName: 'Jane Smith',
    hodName: 'John Doe'
  },
  {
    id: 2,
    title: 'Performance Agreement 2025',
    employeeName: 'Sarah Johnson',
    employeeTitle: 'Marketing Specialist',
    department: 'Marketing',
    branch: 'Masaka',
    period: 'Annual Review',
    submittedDate: '2024-07-14',
    status: 'pending_hod',
    supervisorName: 'Mike Wilson',
    hodName: 'Elizabeth Taylor'
  },
  {
    id: 3,
    title: 'Performance Agreement 2025',
    employeeName: 'Robert Chen',
    employeeTitle: 'Finance Analyst',
    department: 'Finance',
    branch: 'Head Office',
    period: 'Annual Review',
    submittedDate: '2024-07-12',
    status: 'approved',
    supervisorName: 'Patricia Brown',
    hodName: 'David Miller'
  },
  {
    id: 4,
    title: 'Performance Agreement 2025',
    employeeName: 'Lisa Wong',
    employeeTitle: 'Human Resources Manager',
    department: 'Human Resources',
    branch: 'Soroti',
    period: 'Annual Review',
    submittedDate: '2025-05-01',
    status: 'approved',
    supervisorName: 'James Rodriguez',
    hodName: 'Maria Garcia'
  },
  {
    id: 5,
    title: 'Performance Agreement 2025',
    employeeName: 'Michael Brown',
    employeeTitle: 'Sales Representative',
    department: 'Sales',
    branch: 'Gulu',
    period: 'Annual Review',
    submittedDate: '2025-04-14',
    status: 'submitted',
    supervisorName: 'Susan Lee',
    hodName: 'Robert Johnson'
  }
];

// Status component with color coding
const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: ClockIcon },
    submitted: { label: 'Submitted for Review', color: 'bg-blue-100 text-blue-700', icon: ClockIcon },
    pending_supervisor: { label: 'Pending Supervisor', color: 'bg-amber-100 text-amber-700', icon: ClockIcon },
    pending_hod: { label: 'Pending HOD', color: 'bg-purple-100 text-purple-700', icon: ClockIcon },
    approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircleIcon }
  };

  const config = statusConfig[status] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </span>
  );
};

const AgreementApprovalModal = ({ isOpen, closeModal, agreement, onApprove, onReject }) => {
  const [employeeAccepted, setEmployeeAccepted] = useState(agreement?.status !== 'draft');
  const [supervisorApproved, setSupervisorApproved] = useState(agreement?.status === 'pending_hod' || agreement?.status === 'approved');
  const [hodApproved, setHodApproved] = useState(agreement?.status === 'approved');
  
  const handleEmployeeAccept = () => {
    setEmployeeAccepted(true);
    onApprove('submitted');
  };
  
  const handleSupervisorApprove = () => {
    setSupervisorApproved(true);
    onApprove('pending_hod');
  };
  
  const handleHodApprove = () => {
    setHodApproved(true);
    onApprove('approved');
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
                    <Dialog.Title className="text-[20px] font-semibold text-gray-700">
                      Performance Agreement Approval
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-7 pt-7 pb-4 max-h-[80vh] overflow-y-auto">
                  {/* Agreement details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-lg text-gray-800 mb-2">{agreement?.title}</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <UserCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{agreement?.employeeName} - {agreement?.employeeTitle}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Period: {agreement?.period}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Submitted: {new Date(agreement?.submittedDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <StatusBadge status={agreement?.status} />
                      </div>
                    </div>
                  </div>

                  {/* Employee Statement */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-800 mb-2">Statement of the Employee</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      I <span className="font-medium">{agreement?.employeeName}</span> accept the performance accountabilities 
                      of this agreement and agree to produce the results, perform the work and meet the standards set forth in this agreement.  
                      I do understand and accept that my performance for the period {agreement?.period} will be measured against this agreement.
                    </p>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Employee section */}
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Employee:</span>
                            <span className="text-sm font-medium">{agreement?.employeeName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Status:</span>
                            <span className={`text-sm font-medium ${employeeAccepted ? 'text-green-600' : 'text-amber-600'}`}>
                              {employeeAccepted ? 'Accepted' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex justify-end">
                            {!employeeAccepted && (
                              <button 
                                onClick={handleEmployeeAccept}
                                className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded hover:bg-teal-700"
                              >
                                Accept Agreement
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Supervisor section */}
                        <div className="space-y-3 border-l border-gray-200 pl-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Supervisor:</span>
                            <span className="text-sm font-medium">{agreement?.supervisorName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Status:</span>
                            <span className={`text-sm font-medium ${supervisorApproved ? 'text-green-600' : 'text-amber-600'}`}>
                              {supervisorApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex justify-end">
                            {employeeAccepted && !supervisorApproved && (
                              <button 
                                onClick={handleSupervisorApprove}
                                className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded hover:bg-teal-700"
                              >
                                Approve as Supervisor
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HOD section */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between mb-3">
                        <span className="text-sm text-gray-500">Head of Department:</span>
                        <span className="text-sm font-medium">{agreement?.hodName}</span>
                      </div>
                      <div className="flex justify-between mb-3">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`text-sm font-medium ${hodApproved ? 'text-green-600' : 'text-amber-600'}`}>
                          {hodApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        {supervisorApproved && !hodApproved && (
                          <button 
                            onClick={handleHodApprove}
                            className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded hover:bg-teal-700"
                          >
                            Approve as HOD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Updated distribution note */}
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                    <p className="font-medium mb-1">When you submit your agreement, the following people will receive notifications:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>You (Employee)</li>
                      <li>Your Immediate Supervisor: <span className="font-medium">{agreement?.supervisorName}</span></li>
                      <li>Head of Department: <span className="font-medium">{agreement?.hodName}</span></li>
                    </ul>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={closeModal}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    {(agreement?.status === 'pending_supervisor' || agreement?.status === 'pending_hod') && (
                      <button
                        onClick={() => onReject && onReject('rejected')}
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    )}
                    {agreement?.status === 'draft' && !employeeAccepted && (
                      <button
                        onClick={handleEmployeeAccept}
                        className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                      >
                        Submit Agreement
                      </button>
                    )}
                    {(employeeAccepted && !supervisorApproved) && (
                      <button
                        onClick={handleSupervisorApprove}
                        className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                      >
                        Approve as Supervisor
                      </button>
                    )}
                    {(supervisorApproved && !hodApproved) && (
                      <button
                        onClick={handleHodApprove}
                        className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                      >
                        Approve as HOD
                      </button>
                    )}
                    {hodApproved && (
                      <button
                        onClick={() => onApprove('approved')}
                        className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                      >
                        Finalize
                      </button>
                    )}
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

// Add this helper function to calculate time ago
const getTimeAgo = (dateString) => {
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

const AgreementReview = ({ 
  defaultFilter = '', 
  title = 'Performance Agreement Review',
  description = 'Review all submitted performance agreements',
  departmentFilter = '',
  showDepartmentFilter = true,
  showHODActions = false
}) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [agreementList, setAgreementList] = useState(agreements);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  
  // Filter state
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');

  const isHOD = user?.roles?.includes('HOD');
  const isHODApprovalPage = window.location.href.includes('status=pending_hod');
  
  // Apply initial filters including default filter and department filter
  useEffect(() => {
    // Apply status filter from URL params or default filter
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setFilterStatus(statusParam);
    } else if (defaultFilter) {
      setFilterStatus(defaultFilter);
    }
    
    // Apply department filter if provided
    if (departmentFilter) {
      setFilterDepartment(departmentFilter);
    }
  }, [searchParams, defaultFilter, departmentFilter]);
  
  // Action handlers
  const handleReview = (agreement) => {
    setSelectedAgreement(agreement);
    setIsModalOpen(true);
  };
  
  const handlePreview = (agreement) => {
    // Implement preview functionality
    console.log("Preview agreement:", agreement);
  };
  
  const handleDownload = (agreement) => {
    // Implement download functionality
    console.log("Download agreement:", agreement);
  };
  
  const handleViewHistory = (agreement) => {
    // Implement history view functionality
    console.log("View history for agreement:", agreement);
  };

  const handleApprove = (status) => {
    setAgreementList(prev => 
      prev.map(a => a.id === selectedAgreement.id ? {...a, status} : a)
    );
    setIsModalOpen(false);
  };

  const handleReject = () => {
    setIsModalOpen(false);
  };

  const handleInitialSubmit = (agreementId) => {
    const agreement = agreementList.find(a => a.id === agreementId);
    if (agreement) {
      handleReview(agreement);
    }
  };
  
  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing records per page
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterDepartment('');
    setFilterPeriod('');
    setFilterBranch('');
  };

  // Apply filters
  const filteredAgreements = agreementList.filter(agreement => {
    const matchesText = filterText === '' || 
      agreement.employeeName.toLowerCase().includes(filterText.toLowerCase()) ||
      agreement.employeeTitle.toLowerCase().includes(filterText.toLowerCase());
      
    const matchesStatus = filterStatus === '' || agreement.status === filterStatus;
    
    const matchesDepartment = filterDepartment === '' || 
      agreement.department === filterDepartment;
      
    const matchesPeriod = filterPeriod === '' || agreement.period === filterPeriod;
    
    const matchesBranch = filterBranch === '' || agreement.branch === filterBranch;
    
    return matchesText && matchesStatus && matchesDepartment && matchesPeriod && matchesBranch;
  });
  
  // Apply pagination
  const totalPages = Math.ceil(filteredAgreements.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const paginatedAgreements = filteredAgreements.slice(indexOfFirstRecord, indexOfLastRecord);

  // Get unique values for filter options
  const departments = [...new Set(agreements.map(a => a.department))];
  const branches = [...new Set(agreements.map(a => a.branch))];

  return (
    <div className="min-h-screen bg-gray-100 shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <OverallProgress progress={65} riskStatus={false} />
      </div>
      
      <div className="px-4 py-2 bg-white">
        {/* Filters - modified to respect showDepartmentFilter */}
        <FilterBox
          title="Performance Agreement Review Filters"
          filters={[
            {
              id: 'filterText',
              label: 'Search',
              type: 'text',
              placeholder: 'Search by name or title...',
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
                { value: 'submitted', label: 'Submitted' },
                { value: 'pending_supervisor', label: 'Pending Supervisor' },
                { value: 'pending_hod', label: 'Pending HOD' },
                { value: 'approved', label: 'Approved' }
              ],
            },
            ...(showDepartmentFilter ? [{
              id: 'filterDepartment',
              label: 'Department',
              type: 'select',
              value: filterDepartment,
              onChange: (e) => setFilterDepartment(e.target.value),
              options: [
                { value: '', label: '-- All Departments --' },
                ...departments.map(dept => ({ value: dept, label: dept }))
              ],
            }] : []),
            {
              id: 'filterBranch',
              label: 'Branch/Unit',
              type: 'select',
              value: filterBranch,
              onChange: (e) => setFilterBranch(e.target.value),
              options: [
                { value: '', label: '-- All Branches/Units --' },
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
                { value: 'Annual Review', label: 'Annual Review' }
              ],
            },
          ]}
          buttons={[
            {
              label: 'Reset',
              variant: 'secondary',
              onClick: handleReset,
            },
          ]}
        />
        
        {/* Toolbar */}
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
          {showHODActions && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Showing agreements pending your approval as Head of Department.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <AgreementToolbar 
            recordsPerPage={recordsPerPage}
            onRecordsPerPageChange={handleRecordsPerPageChange}
            totalRecords={filteredAgreements.length}
            showCreateButton={false} // Hide the Create New Agreement button
          />
          
          {/* Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Employee</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Branch/Unit</TableHeader>
                <TableHeader>Period</TableHeader>
                <TableHeader>Submitted</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAgreements.map((agreement) => (
                <TableRow key={agreement.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="text-sm font-medium text-gray-900">{agreement.employeeName}</div>
                    <div className="text-xs text-gray-500">{agreement.employeeTitle}</div>
                  </TableCell>
                  <TableCell>{agreement.department}</TableCell>
                  <TableCell>{agreement.branch}</TableCell>
                  <TableCell>{agreement.period}</TableCell>
                  <TableCell>
                    <div>
                      {new Date(agreement.submittedDate).toLocaleDateString()}
                      <span className="block text-xs text-gray-500 mt-1">
                        {getTimeAgo(agreement.submittedDate)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={agreement.status} />
                  </TableCell>
                  <TableCell>
                    {agreement.status === 'draft' ? (
                      <button
                        onClick={() => handleInitialSubmit(agreement.id)}
                        className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded-md mr-2"
                      >
                        Submit
                      </button>
                    ) : (
                      <AgreementActions 
                        agreement={agreement}
                        onReview={handleReview}
                        onPreview={handlePreview}
                        onDownload={handleDownload}
                        onViewHistory={handleViewHistory}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="mt-4">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      
      {/* Keep existing modal */}
      <AgreementApprovalModal 
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        agreement={selectedAgreement}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default AgreementReview;
