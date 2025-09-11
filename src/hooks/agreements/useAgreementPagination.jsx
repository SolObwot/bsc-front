import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgreements } from '../../../redux/agreementSlice';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader, TableSkeleton } from '../../../components/ui/Tables';
import FilterBox from '../../../components/ui/FilterBox';
import AgreementToolbar from './AgreementToolbar';
import AgreementActions from './AgreementActions';
import Pagination from '../../../components/ui/Pagination';
import { useAuth } from '../../../hooks/useAuth';
import SubmitAgreementModal from './SubmitAgreementModal'; 
import AgreementApprovalModal from './AgreementApprovalModal'; 
import StatusBadge from './AgreementStatusBadge';

// Helper function to calculate time ago
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
  showDepartmentFilter = false,
  showHODActions = false
}) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const dispatch = useDispatch();
  
  // Get agreements from Redux store
  const { agreements, pagination, loading, error } = useSelector((state) => state.agreements);
  
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  
  // Filter state
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState(departmentFilter || '');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  
  // Pagination state - using API pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter out draft agreements client-side
  const displayAgreements = useMemo(() => {
    return agreements.filter(agreement => agreement.status !== 'draft');
  }, [agreements]);
  
  // Role checks
  const isHOD = user?.roles?.includes('HOD');
  const isSuperAdmin = user?.roles?.includes('superadmin');
  const isHODApprovalPage = window.location.href.includes('status=pending_hod');
  
  // Apply initial filters from URL params or props
  useEffect(() => {
    // Apply status filter from URL params
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setFilterStatus(statusParam);
    }
    
    // Apply department filter if provided via props
    if (departmentFilter) {
      setFilterDepartment(departmentFilter);
    }
  }, [searchParams, departmentFilter]);
  
  // Fetch agreements when component mounts or filters change
  useEffect(() => {
    // Build request parameters based on available API options
    const params = {
      page: currentPage, // Only page is supported by the API
    };
    
    // Include status filter if set
    if (filterStatus) {
      params.status = filterStatus;
    }
    
    // For text search filter - only add if non-empty
    if (filterText) {
      params.search = filterText;
    }
    
    // For period filter - only add if non-empty
    if (filterPeriod) {
      // Convert from display value to API value if needed
      params.period = filterPeriod === 'Annual Review' ? 'annual' : 
                     filterPeriod === 'Probation 6 months' ? 'probation' : 
                     filterPeriod;
    }
    
    // Dispatch the action to fetch agreements with supported filters
    dispatch(fetchAgreements(params));
    
  }, [
    dispatch, 
    currentPage, 
    filterStatus, 
    filterText, 
    filterPeriod
  ]);
  
  // Client-side filtering for department and branch
  const filteredAgreements = useMemo(() => {
    return displayAgreements.filter(agreement => {
      // Department filter (client-side since API doesn't support it)
      const matchesDepartment = !filterDepartment || 
        (agreement.department_id && agreement.department_id.toString() === filterDepartment.toString());
      
      // Branch filter (client-side)
      const matchesBranch = !filterBranch || 
        (agreement.creator && 
         agreement.creator.unit_or_branch && 
         agreement.creator.unit_or_branch.id && 
         agreement.creator.unit_or_branch.id.toString() === filterBranch.toString());
      
      return matchesDepartment && matchesBranch;
    });
  }, [displayAgreements, filterDepartment, filterBranch]);
  
  // Action handlers
  const handleReview = (agreement) => {
    setSelectedAgreement(agreement);
    setIsApprovalModalOpen(true);
  };
  
  const handlePreview = (agreement) => {
    // Implement preview functionality
    alert("Preview agreement: " + agreement.name);
  };
  
  const handleDownload = (agreement) => {
    // Implement download functionality
    alert("Download agreement: " + agreement.name);
  };

  const handleViewHistory = (agreement) => {
    // Implement history view functionality
    alert("View history for agreement: " + agreement.name);
  };

  const handleApproveOrUpdateStatus = (newStatus) => {
    // For actual implementation, dispatch the appropriate Redux action
    setIsApprovalModalOpen(false);
    setIsSubmitModalOpen(false);
    setSelectedAgreement(null);
    
    // Re-fetch agreements after status change
    dispatch(fetchAgreements({
      page: currentPage,
      status: filterStatus || undefined,
      search: filterText || undefined,
      period: filterPeriod || undefined
    }));
  };

  const handleReject = () => {
    // Implement rejection logic using Redux actions
    console.log("Agreement rejected:", selectedAgreement);
    setIsApprovalModalOpen(false);
    setSelectedAgreement(null);
    
    // Re-fetch agreements after rejection
    dispatch(fetchAgreements({
      page: currentPage,
      status: filterStatus || undefined,
      search: filterText || undefined,
      period: filterPeriod || undefined
    }));
  };

  const handleInitialSubmitAction = (agreementId, newStatus) => {
    // Find the agreement to submit
    const agreementToSubmit = agreements.find(a => a.id === agreementId);
    if (agreementToSubmit) {
      setSelectedAgreement(agreementToSubmit);
      handleApproveOrUpdateStatus(newStatus);
    }
  };
  
  const openSubmitModal = (agreement) => {
    setSelectedAgreement(agreement);
    setIsSubmitModalOpen(true);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterDepartment(departmentFilter || '');
    setFilterPeriod('');
    setFilterBranch('');
    setCurrentPage(1); // Reset to first page
    
    // Re-fetch with minimal filters
    dispatch(fetchAgreements({
      page: 1
    }));
  };

  const handleFilterChange = (filterType, value) => {
    // Reset to page 1 whenever a filter changes
    setCurrentPage(1);
    
    // Update the specific filter
    switch(filterType) {
      case 'text':
        setFilterText(value);
        break;
      case 'status':
        setFilterStatus(value);
        break;
      case 'department':
        setFilterDepartment(value);
        break;
      case 'branch':
        setFilterBranch(value);
        break;
      case 'period':
        setFilterPeriod(value);
        break;
      default:
        break;
    }
  };

  // Get unique departments with proper handling of empty values
  const departments = useMemo(() => {
    if (!agreements.length) return [];
    
    const uniqueDepartments = [];
    const departmentMap = new Map();
    
    agreements.forEach(a => {
      if (a.department && a.department.id && !departmentMap.has(a.department.id)) {
        departmentMap.set(a.department.id, true);
        uniqueDepartments.push({ 
          id: a.department.id, 
          name: a.department.name 
        });
      }
    });
    
    return uniqueDepartments;
  }, [agreements]);
  
  // Enhanced department options function
  const getDepartmentOptions = () => {
    const options = [{ value: '', label: '-- All Departments --' }];
    
    // Add user's department as first option if available
    if (user?.department_id && user?.department?.name) {
      options.push({ 
        value: user.department_id.toString(), 
        label: `${user.department.name} (Your Department)`,
        className: 'font-bold text-blue-600'
      });
    }
    
    // Add other departments
    departments.forEach(dept => {
      // Skip if already added as user's department
      if (!user?.department_id || dept.id.toString() !== user.department_id.toString()) {
        options.push({ value: dept.id.toString(), label: dept.name });
      }
    });
    
    return options;
  };

  // Get unique branches with proper handling of empty values
  const branches = useMemo(() => {
    if (!agreements.length) return [];
    
    const uniqueBranches = [];
    const branchMap = new Map();
    
    agreements.forEach(a => {
      if (a.creator && a.creator.unit_or_branch && a.creator.unit_or_branch.id && !branchMap.has(a.creator.unit_or_branch.id)) {
        branchMap.set(a.creator.unit_or_branch.id, true);
        uniqueBranches.push({ 
          id: a.creator.unit_or_branch.id, 
          name: a.creator.unit_or_branch.name 
        });
      }
    });
    
    return uniqueBranches;
  }, [agreements]);

  // Calculate total pages based on API pagination info
  const totalPages = useMemo(() => {
    return pagination?.last_page || 1;
  }, [pagination]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

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
        {/* SuperAdmin notification */}
        {isSuperAdmin && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-bold">SuperAdmin Mode:</span> You're viewing agreements across all departments.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <FilterBox
          title="Performance Agreement Review Filters"
          filters={[
            {
              id: 'filterText',
              label: 'Search',
              type: 'text',
              placeholder: 'Search by name or title...',
              value: filterText,
              onChange: (e) => handleFilterChange('text', e.target.value),
            },
            {
              id: 'filterStatus',
              label: 'Status',
              type: 'select',
              value: filterStatus,
              onChange: (e) => handleFilterChange('status', e.target.value),
              options: [
                { value: '', label: '-- All Statuses --' },
                { value: 'submitted', label: 'Submitted' },
                { value: 'pending_supervisor', label: 'Pending Supervisor' },
                { value: 'pending_hod', label: 'Pending HOD' },
                { value: 'approved_supervisor', label: 'Supervisor Approved' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }
              ],
            },
            {
              id: 'filterDepartment',
              label: 'Department',
              type: 'select',
              value: filterDepartment,
              disabled: false,
              onChange: (e) => handleFilterChange('department', e.target.value),
              options: getDepartmentOptions(),
            },
            {
              id: 'filterBranch',
              label: 'Branch/Unit',
              type: 'select',
              value: filterBranch,
              onChange: (e) => handleFilterChange('branch', e.target.value),
              options: [
                { value: '', label: '-- All Branches/Units --' },
                ...branches.map(branch => ({ value: branch.id, label: branch.name }))
              ],
            },
            {
              id: 'filterPeriod',
              label: 'Period',
              type: 'select',
              value: filterPeriod,
              onChange: (e) => handleFilterChange('period', e.target.value),
              options: [
                { value: '', label: '-- All Periods --' },
                { value: 'Annual Review', label: 'Annual Review' },
                { value: 'Probation 6 months', label: 'Probation 6 months' }
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
            recordsPerPage={pagination?.per_page || 15} // Use API's per_page value
            onRecordsPerPageChange={null} // Disable changing records per page since API doesn't support it
            totalRecords={pagination?.total || filteredAgreements.length}
            showCreateButton={false}
          />
          
          {/* Conditional loading state */}
          {loading && filteredAgreements.length === 0 ? (
            <TableSkeleton 
              rows={8} 
              columns={7} 
              columnWidths={['20%', '15%', '15%', '10%', '15%', '10%', '15%']}
            />
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-red-800">Error loading agreements</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          ) : (
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
                {filteredAgreements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No agreements found with the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgreements.map((agreement) => (
                    <TableRow key={agreement.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {agreement.creator ? 
                          `${agreement.creator.surname} ${agreement.creator.first_name}${agreement.creator.other_name ? ' ' + agreement.creator.other_name : ''}` : 
                          'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {agreement.creator?.job_title?.name || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {agreement.department ? agreement.department.name : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {agreement.creator?.unit_or_branch?.name || 'Head Office'}
                      </TableCell>
                      <TableCell>
                        {agreement.period === 'annual' ? 'Annual Review' : 
                        agreement.period === 'probation' ? 'Probation 6 months' : 
                        agreement.period}
                      </TableCell>
                      <TableCell>
                        {agreement.submitted_at ? (
                          <div>
                          {formatDate(agreement.submitted_at)}
                          <span className="block text-xs text-gray-500 mt-1">
                            {getTimeAgo(agreement.submitted_at)}
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
                        <AgreementActions 
                          agreement={agreement}
                          onReview={(agreement.status === 'pending_supervisor' || isSuperAdmin) ? handleReview : null}
                          onPreview={handlePreview}
                          onDownload={handleDownload}
                          onViewHistory={handleViewHistory}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
          
          {/* Pagination - only using page navigation since per_page is not supported */}
          <div className="mt-4">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      
      {/* Modals */}
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