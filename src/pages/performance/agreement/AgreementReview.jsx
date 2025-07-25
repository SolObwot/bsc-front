import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllAgreements, initializeWithUserDepartment, supervisorApproveAgreement } from '../../../redux/agreementSlice';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader, TableSkeleton } from '../../../components/ui/Tables';
import FilterBox from '../../../components/ui/FilterBox';
import AgreementToolbar from './AgreementToolbar';
import AgreementActions from './AgreementActions';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';
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
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get agreements and detected department from Redux store
  const { departmentAgreements: agreements, pagination, loading, error, userDepartmentId } = useSelector((state) => state.agreements);
  
  // State declarations
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get current year for the filter options
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  
  // Filter state - initialize with departmentFilter prop if available
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState(departmentFilter || '');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterText, setFilterText] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterYear, setFilterYear] = useState(currentYear.toString()); // Add year filter
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  
  // Initialize with user's department - only on first load
  useEffect(() => {
    if (isInitialLoad) {
      // If departmentFilter is provided as prop, use it directly
      if (departmentFilter) {
        setFilterDepartment(departmentFilter);
        // Call the new thunk directly
        dispatch(fetchAllAgreements({ department_id: departmentFilter }));
      } else {
        // Otherwise, use the automatic department detection
        dispatch(initializeWithUserDepartment());
      }
      setIsInitialLoad(false);
    }
  }, [dispatch, departmentFilter, isInitialLoad]);
  
  // Update department filter when userDepartmentId is detected
   useEffect(() => {
    // This effect should only run when the user's department is detected.
    // It sets the filter ONCE if it's not already set.
    if (!departmentFilter && userDepartmentId && filterDepartment === '') {
      setFilterDepartment(userDepartmentId);
    }
  }, [userDepartmentId, departmentFilter]);
  
  // Apply all filters client-side since API only supports department_id
  const filteredAgreements = useMemo(() => {
    return agreements
      // First filter: Always exclude drafts
      .filter(agreement => agreement.status !== 'draft')
      // Second filter: Apply status filter if set
      .filter(agreement => {
        if (!filterStatus) return true;
        return agreement.status === filterStatus;
      })
      // Third filter: Apply text search if set
      .filter(agreement => {
        if (!filterText) return true;
        
        const searchText = filterText.toLowerCase();
        const name = (agreement.name || '').toLowerCase();
        const employeeName = agreement.creator ? 
          `${agreement.creator.surname || ''} ${agreement.creator.last_name || ''}`.toLowerCase() : '';
        const departmentName = (agreement.department?.name || '').toLowerCase();
        
        return name.includes(searchText) || 
               employeeName.includes(searchText) || 
               departmentName.includes(searchText);
      })
      // Fourth filter: Apply branch filter if set
      .filter(agreement => {
        if (!filterBranch) return true;
        return agreement.creator?.unit_or_branch?.id.toString() === filterBranch;
      })
      // Fifth filter: Apply period filter if set
      .filter(agreement => {
        if (!filterPeriod) return true;
        return agreement.period === filterPeriod;
      })
      // Sixth filter: Apply year filter if set
      .filter(agreement => {
        if (!filterYear) return true;
        if (!agreement.created_at && !agreement.submitted_at) return false;
        const agreementYear = new Date(agreement.submitted_at || agreement.created_at).getFullYear().toString();
        return agreementYear === filterYear;
      });
  }, [agreements, filterStatus, filterText, filterBranch, filterPeriod, filterYear]);
  
  // Find department name for the filter
  const departmentName = useMemo(() => {
    if (!departmentFilter || !agreements.length) return '';
    
    const dept = agreements.find(a => 
      a.department && a.department_id.toString() === departmentFilter.toString()
    );
    
    return dept?.department?.name || '';
  }, [agreements, departmentFilter]);
  
  // Initialize filters from URL params
  useEffect(() => {
    // Apply status filter from URL params
    const statusParam = searchParams.get('status');
    if (statusParam) {
      setFilterStatus(statusParam);
    }
  }, [searchParams]);
  
  // Make API request when department filter changes manually
  useEffect(() => {
    if (!isInitialLoad && filterDepartment !== '') {
      dispatch(fetchAllAgreements({ department_id: filterDepartment }));
    }
  }, [dispatch, filterDepartment, isInitialLoad]);
    
  // Action handlers
  const handleReview = (agreement) => {
    setSelectedAgreement(agreement);
    setIsApprovalModalOpen(true);
  };
  
  const handlePreview = (agreement) => {
    navigate(`/performance/measures/preview/${agreement.id}`);
  };
  
  const handleDownload = (agreement) => {
    // Implement download functionality
    alert("Download agreement: " + agreement.name);
  };

  const handleViewHistory = (agreement) => {
    // Implement history view functionality
    alert("View history for agreement: " + agreement.name);
  };

  // Updated function to only handle supervisor approval
 const handleApproveOrUpdateStatus = async (approvalData) => {
  try {
    await dispatch(supervisorApproveAgreement({
      id: selectedAgreement.id,
      data: {
        action: approvalData.action,
        comment: approvalData.comment    
      }
    })).unwrap();

    toast({
      title: "Success",
      description: "Agreement has been approved as supervisor",
      variant: "success",
    });
    
    setIsApprovalModalOpen(false);
    setSelectedAgreement(null);
  } catch (error) {
    toast({
      title: "Error",
      description: error.message || "Failed to approve agreement",
      variant: "destructive",
    });
  }
};
  
  // Updated function to only handle supervisor rejection
  const handleReject = async (rejectionData) => {
    try {
      await dispatch(supervisorApproveAgreement({
        id: selectedAgreement.id,
        data: {
          action: rejectionData.action,
          comment: rejectionData.comment,
          rejection_reason: rejectionData.comment
        }
      })).unwrap();

      toast({
        title: "Success",
        description: "Agreement has been rejected as supervisor",
        variant: "success",
      });

      setIsApprovalModalOpen(false);
      setSelectedAgreement(null);
    } catch (error) {
          toast({
            title: "Error",
            description: "An unexpected error occurred during rejection",
            variant: "destructive",
          });
        }
  };
  
  const handleInitialSubmitAction = (agreementId, newStatus) => {
    // Find the agreement to submit
    const agreementToSubmit = agreements.find(a => a.id === agreementId);
    if (agreementToSubmit) {
      setSelectedAgreement(agreementToSubmit);
      handleApproveOrUpdateStatus(newStatus);
    }
  };
  
  // Filter change handler - only trigger API request for department changes
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1); // Reset to page 1 when filters change
    
    switch(filterType) {
      case 'text':
        setFilterText(value);
        break;
      case 'status':
        setFilterStatus(value);
        break;
      case 'department':
        setFilterDepartment(value);
        // Department change will trigger API request via useEffect
        break;
      case 'branch':
        setFilterBranch(value);
        break;
      case 'period':
        setFilterPeriod(value);
        break;
      case 'year':
        setFilterYear(value);
        break;
      default:
        break;
    }
  };
  
  // Enhanced reset handler - preserve department filter
  const handleReset = () => {
    // Clear all non-department filters
    setFilterText('');
    setFilterStatus('');
    setFilterBranch('');
    setFilterPeriod('');
    setFilterYear(currentYear.toString()); // Reset year to current year
    setCurrentPage(1);
    
    // For department, use in this order of priority:
    // 1. departmentFilter prop (if provided)
    // 2. userDepartmentId from Redux (if detected)
    // 3. Current filterDepartment (if neither above is available)
    // 4. Empty string (as last resort)
    const defaultDept = departmentFilter || userDepartmentId || filterDepartment || '';
    
    // Only update if different
    if (filterDepartment !== defaultDept) {
      setFilterDepartment(defaultDept);
    }
    
    // Only send department_id to API
    const params = {};
    if (defaultDept) {
      params.department_id = defaultDept;
    }
    
    dispatch(fetchAllAgreements(params));
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
    
    // Add department from userDepartmentId if it's not already included
    if (userDepartmentId && !options.some(opt => opt.value === userDepartmentId)) {
      const deptName = agreements.find(a => 
        a.department && a.department_id.toString() === userDepartmentId
      )?.department?.name || 'Your Department';
      
      options.push({ 
        value: userDepartmentId, 
        label: `${deptName}`,
        className: 'font-bold text-green-600'
      });
    }
    
    // Add other departments
    departments.forEach(dept => {
      // Skip if already added as user's department or detected department
      if ((!user?.department_id || dept.id.toString() !== user.department_id.toString()) &&
          (dept.id.toString() !== userDepartmentId)) {
        options.push({ value: dept.id.toString(), label: dept.name });
      }
    });
    
    // Make sure the currently selected department is in the options list
    if (filterDepartment && !options.some(opt => opt.value === filterDepartment)) {
      const deptName = agreements.find(a => 
        a.department && a.department_id.toString() === filterDepartment
      )?.department?.name || 'Selected Department';
      
      options.push({ 
        value: filterDepartment, 
        label: deptName,
        className: 'text-orange-600'
      });
    }
    
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
      </div>
      
      <div className="px-4 py-2 bg-white">
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
              disabled: !!departmentFilter, // Disable if department is fixed via prop
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
                ...branches.map(branch => ({ value: branch.id.toString(), label: branch.name }))
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
                { value: 'annual', label: 'Annual Review' },
                { value: 'probation', label: 'Probation 6 months' }
              ],
            },
            {
              id: 'filterYear',
              label: 'Year',
              type: 'select',
              value: filterYear,
              onChange: (e) => handleFilterChange('year', e.target.value),
              options: [
                { value: '', label: '-- All Years --' },
                ...Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => ({
                  value: year.toString(),
                  label: year.toString()
                }))
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
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm relative">
          <AgreementToolbar 
            recordsPerPage={agreements.length}
            totalRecords={filteredAgreements.length}
            showCreateButton={false}
            showRecordsPerPage={false}
          />
          
          {(loading && agreements.length === 0) ? (
                <TableSkeleton 
                  rows={8} 
                  columns={7} 
                  columnWidths={['20%', '15%', '15%', '10%', '15%', '10%', '15%']}
                />
                ) : loadingPage ? (
                <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                  <TableSkeleton 
                  rows={8} 
                  columns={7} 
                  columnWidths={['20%', '15%', '15%', '10%', '15%', '10%', '15%']}
                  />
                </div>
                ) :(
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
                        `${agreement.creator.surname} ${agreement.creator.last_name}${agreement.creator.other_name ? ' ' + agreement.creator.other_name : ''}` : 
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
                        onReview={agreement.status === 'pending_supervisor' ? handleReview : undefined}
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
                
                {/* Pagination component removed as we're now handling all records client-side */}
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