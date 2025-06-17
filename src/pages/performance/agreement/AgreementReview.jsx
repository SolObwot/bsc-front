import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import FilterBox from '../../../components/ui/FilterBox';
import AgreementToolbar from './AgreementToolbar';
import AgreementActions from './AgreementActions';
import Pagination from '../../../components/ui/Pagination';
import { useAuth } from '../../../hooks/useAuth';
import SubmitAgreementModal from './SubmitAgreementModal'; 
import AgreementApprovalModal from './AgreementApprovalModal'; 
import StatusBadge from './AgreementStatusBadge'; // Updated import path

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
  
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
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
    setIsApprovalModalOpen(true);
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

  const handleApproveOrUpdateStatus = (newStatus) => { // Renamed from handleApprove for clarity
    setAgreementList(prev => 
      prev.map(a => a.id === selectedAgreement.id ? {...a, status: newStatus, submittedDate: newStatus === 'submitted' ? new Date().toISOString().split('T')[0] : a.submittedDate } : a)
    );
    setIsApprovalModalOpen(false);
    setIsSubmitModalOpen(false); // Close submit modal too if it was open
    setSelectedAgreement(null);
  };

  const handleReject = () => {
    // Implement rejection logic, e.g., change status to 'rejected_by_supervisor' or 'rejected_by_hod'
    // For now, just closes modal
    console.log("Agreement rejected:", selectedAgreement);
    const newStatus = selectedAgreement?.status === 'pending_supervisor' ? 'rejected_by_supervisor' : 'rejected_by_hod';
    setAgreementList(prev => 
      prev.map(a => a.id === selectedAgreement.id ? {...a, status: newStatus } : a) 
    );
    setIsApprovalModalOpen(false);
    setSelectedAgreement(null);
  };

  const handleInitialSubmitAction = (agreementId, newStatus) => { // For SubmitAgreementModal
    const agreementToSubmit = agreementList.find(a => a.id === agreementId);
    if (agreementToSubmit) {
        setSelectedAgreement(agreementToSubmit); // Ensure selectedAgreement is set for status update
        handleApproveOrUpdateStatus(newStatus);
    }
  };
  
  const openSubmitModal = (agreement) => {
    setSelectedAgreement(agreement);
    setIsSubmitModalOpen(true);
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
                        onClick={() => openSubmitModal(agreement)}
                        className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded-md mr-2 text-xs"
                      >
                        Submit for Review
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
      {selectedAgreement && (
        <AgreementApprovalModal 
          isOpen={isApprovalModalOpen}
          closeModal={() => { setIsApprovalModalOpen(false); setSelectedAgreement(null); }}
          agreement={selectedAgreement}
          onApprove={handleApproveOrUpdateStatus}
          onReject={handleReject}
        />
      )}
      {selectedAgreement && (
        <SubmitAgreementModal
          isOpen={isSubmitModalOpen}
          closeModal={() => { setIsSubmitModalOpen(false); setSelectedAgreement(null); }}
          agreement={selectedAgreement}
          onSubmit={handleInitialSubmitAction}
        />
      )}
    </div>
  );
};

export default AgreementReview;
