import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAgreements, initializeWithUserDepartment } from '../../../redux/agreementSlice';
import { useAuth } from '../../../hooks/useAuth';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from '../../../components/ui/Tables';
import FilterBox from '../../../components/ui/FilterBox';
import AgreementToolbar from './AgreementToolbar';
import AgreementActions from './AgreementActions';
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

const HODApproval = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // Get agreements and detected department from Redux store
  const { agreements, loading, error, userDepartmentId } = useSelector((state) => state.agreements);
  
  // State declarations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  
  // Pagination state - we still keep currentPage for client-side paging if needed
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter state
  const [filterText, setFilterText] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [filterPeriod, setFilterPeriod] = useState(''); // Add period filter
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  
  // Get current year for the filter options
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Check if user is HOD
  useEffect(() => {
    // This would be replaced with actual role checking logic
    const isHOD = user?.roles?.includes('HOD');
    
    // TEMPORARILY COMMENTED OUT: HOD role check
    // if (user && !isHOD) {
    //   console.warn('User is not HOD, would normally redirect');
    //   navigate('/dashboard');
    // }
  }, [user, navigate]);
  
  // Initialize with user's department - only on first load
  useEffect(() => {
    if (isInitialLoad) {
      dispatch(initializeWithUserDepartment());
      setIsInitialLoad(false);
    }
  }, [dispatch, isInitialLoad]);
  
  // Update department filter when userDepartmentId is detected
  useEffect(() => {
    if (userDepartmentId && filterDepartment === '') {
      setFilterDepartment(userDepartmentId);
    }
  }, [userDepartmentId, filterDepartment]);
  
  // Make API request when department filter changes manually
  useEffect(() => {
    if (!isInitialLoad && filterDepartment !== '') {
      dispatch(fetchAllAgreements({ department_id: filterDepartment }));
    }
  }, [dispatch, filterDepartment, isInitialLoad]);
  
  // Filter agreements to only show those with "pending_hod" status
  const filteredAgreements = useMemo(() => {
    return agreements
      .filter(agreement => agreement.status === 'pending_hod')
      .filter(agreement => {
        const matchesText = filterText === '' || 
          (agreement.creator && `${agreement.creator.surname} ${agreement.creator.last_name}`.toLowerCase().includes(filterText.toLowerCase())) ||
          (agreement.creator?.job_title?.name || '').toLowerCase().includes(filterText.toLowerCase());
        
        const matchesBranch = filterBranch === '' || 
          (agreement.creator?.unit_or_branch?.id?.toString() === filterBranch);
        
        const matchesDepartment = filterDepartment === '' || 
          (agreement.department_id?.toString() === filterDepartment);
        
        // Add year filter logic
        const matchesYear = filterYear === '' || (() => {
          if (!agreement.created_at && !agreement.submitted_at) return false;
          const agreementYear = new Date(agreement.submitted_at || agreement.created_at).getFullYear().toString();
          return agreementYear === filterYear;
        })();
        
        // Add period filter logic
        const matchesPeriod = filterPeriod === '' || agreement.period === filterPeriod;
        
        return matchesText && matchesBranch && matchesDepartment && matchesYear && matchesPeriod;
      });
  }, [agreements, filterText, filterBranch, filterDepartment, filterYear, filterPeriod]);
  
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
  
  // Action handlers
  const handleReview = (agreement) => {
    setSelectedAgreement(agreement);
    setIsModalOpen(true);
  };
  
  const handlePreview = (agreement) => {
    alert('Preview agreement: ' + JSON.stringify(agreement, null, 2));
  };
  
  const handleApprove = (status) => {
    setIsModalOpen(false);
    setSelectedAgreement(null);
    // Refresh the list after approval
    dispatch(fetchAllAgreements({ department_id: filterDepartment || undefined }));
  };

  const handleReject = (newStatus) => {
    setIsModalOpen(false);
    setSelectedAgreement(null);
    // Refresh the list after rejection
    dispatch(fetchAllAgreements({ department_id: filterDepartment || undefined }));
  };
  
  const handleRecordsPerPageChange = (value) => {
    // This function is no longer needed as we fetch all records.
    console.warn("Changing records per page is not supported as all records are fetched.");
  };
  
  const handlePageChange = (page, url) => {
    // This is also no longer needed.
    console.warn("Pagination is handled client-side after fetching all records.");
  };
  
  const handleReset = () => {
    setFilterText('');
    setFilterBranch('');
    setFilterYear(currentYear.toString()); // Reset year to current year
    setFilterPeriod(''); // Reset period filter
    // Keep the department filter
    
    // Only send department_id to API
    const params = {};
    if (filterDepartment) {
      params.department_id = filterDepartment;
    }
    
    dispatch(fetchAllAgreements(params));
  };

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
    
    return options;
  };

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
          <h1 className="text-xl font-bold text-gray-800">HOD Agreement Approval</h1>
          <p className="text-sm text-gray-600 mt-1">
            Review and approve performance agreements pending your approval as Head of Department
          </p>
        </div>
      </div>
      
      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="HOD Agreement Approval Filters"
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
              id: 'filterDepartment',
              label: 'Department',
              type: 'select',
              value: filterDepartment,
              onChange: (e) => setFilterDepartment(e.target.value),
              options: getDepartmentOptions(),
            },
            {
              id: 'filterBranch',
              label: 'Branch/Unit',
              type: 'select',
              value: filterBranch,
              onChange: (e) => setFilterBranch(e.target.value),
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
              onChange: (e) => setFilterPeriod(e.target.value),
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
              onChange: (e) => setFilterYear(e.target.value),
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
              label: 'Reset',
              variant: 'secondary',
              onClick: handleReset,
            },
          ]}
        />
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Showing agreements pending your approval as Head of Department or Line Manager. 
                  You can review, approve, or reject these agreements.
                </p>
              </div>
            </div>
          </div>
          
          <AgreementToolbar 
            recordsPerPage={agreements.length}
            onRecordsPerPageChange={handleRecordsPerPageChange}
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
                      No agreements pending your approval at this time.
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
                      <TableCell>{agreement.department ? agreement.department.name : 'N/A'}</TableCell>
                      <TableCell>{agreement.creator?.unit_or_branch?.name || 'Head Office'}</TableCell>
                      <TableCell>
                        {agreement.period === 'annual' ? 'Annual Review' : 
                        agreement.period === 'probation' ? 'Probation 6 months' : 
                        agreement.period}
                      </TableCell>
                      <TableCell>
                        <div>
                          {formatDate(agreement.submitted_at)}
                          <span className="block text-xs text-gray-500 mt-1">
                            {getTimeAgo(agreement.submitted_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={agreement.status} />
                      </TableCell>
                      <TableCell>
                        <AgreementActions
                          agreement={agreement}
                          onReview={agreement.status === 'pending_hod' ? handleReview : undefined}
                          onPreview={handlePreview}
                          showReviewAsApprove={true}
                          showOnlyReviewAndPreview={true}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      {selectedAgreement && (
        <AgreementApprovalModal 
          isOpen={isModalOpen}
          closeModal={() => {
            setIsModalOpen(false);
            setSelectedAgreement(null);
          }}
          agreement={selectedAgreement}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default HODApproval;
