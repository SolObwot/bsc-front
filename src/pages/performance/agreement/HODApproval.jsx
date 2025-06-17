import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
// Dialog, Transition, XMarkIcon, CheckCircleIcon, CalendarDaysIcon, UserCircleIcon, ClockIcon are no longer directly needed
// if they are only used by the modals which now import them directly.
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import FilterBox from '../../../components/ui/FilterBox';
import AgreementToolbar from './AgreementToolbar';
import AgreementActions from './AgreementActions';
import Pagination from '../../../components/ui/Pagination';
import AgreementApprovalModal from './AgreementApprovalModal'; 
import StatusBadge from './AgreementStatusBadge'; // Updated import path

// Mock data - all with pending_hod status
const hodPendingAgreements = [
  {
    id: 1,
    title: 'Performance Agreement 2025',
    employeeName: 'Sarah Johnson',
    employeeTitle: 'Marketing Specialist',
    department: 'Marketing',
    branch: 'Masaka',
    period: 'Probation 6 months',
    submittedDate: '2024-07-14',
    status: 'pending_hod',
    supervisorName: 'Mike Wilson',
    hodName: 'Elizabeth Taylor'
  },
  {
    id: 2,
    title: 'Performance Agreement 2025',
    employeeName: 'James Kamara',
    employeeTitle: 'Financial Analyst',
    department: 'Finance',
    branch: 'Head Office',
    period: 'Annual Review',
    submittedDate: '2024-07-15',
    status: 'pending_hod',
    supervisorName: 'Robert Smith',
    hodName: 'Elizabeth Taylor'
  },
  {
    id: 3,
    title: 'Performance Agreement 2025',
    employeeName: 'Paul Mugisha',
    employeeTitle: 'HR Officer',
    department: 'Human Resources',
    branch: 'Gulu',
    period: 'Annual Review',
    submittedDate: '2024-07-10',
    status: 'pending_hod',
    supervisorName: 'Jane Nakabuye',
    hodName: 'Elizabeth Taylor'
  },
  {
    id: 4,
    title: 'Performance Agreement 2025',
    employeeName: 'Mary Nantongo',
    employeeTitle: 'Customer Service Rep',
    department: 'Customer Service',
    branch: 'Jinja',
    period: 'Annual Review',
    submittedDate: '2024-07-12',
    status: 'pending_hod',
    supervisorName: 'David Ochieng',
    hodName: 'Elizabeth Taylor'
  }
];

// Add time ago function for displaying relative dates
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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [agreementList, setAgreementList] = useState(hodPendingAgreements);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  
  // Filter state
  const [filterText, setFilterText] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  // Add debug logging and make the redirect conditional
  useEffect(() => {
    // This would be replaced with actual role checking logic
    const isHOD = user?.roles?.includes('HOD');
    
    console.log('HODApproval - User:', user);
    console.log('HODApproval - isHOD:', isHOD);
    
    // TEMPORARILY COMMENTED OUT: HOD role check
    // if (user && !isHOD) {
    //   console.warn('User is not HOD, would normally redirect');
    //   navigate('/dashboard');
    // }
  }, [user, navigate]);
  
  // Action handlers
  const handleReview = (agreement) => {
    setSelectedAgreement(agreement);
    setIsModalOpen(true);
  };
  
  const handlePreview = (agreement) => {
    // Implement preview functionality
    console.log('Preview agreement:', agreement);
  };
  
  const handleApprove = (status) => { // status will be 'approved' from AgreementApprovalModal
    setAgreementList(prev => 
      prev.map(a => a.id === selectedAgreement.id ? {...a, status: status } : a)
    );
    setIsModalOpen(false);
    
    // Show success notification
    alert(`Agreement for ${selectedAgreement.employeeName} has been approved.`);
  };

  const handleReject = (newStatus) => { // newStatus will be 'rejected_by_hod'
    setAgreementList(prev => 
      prev.map(a => a.id === selectedAgreement.id ? {...a, status: newStatus } : a)
    );
    setIsModalOpen(false);
    // Show rejection notification
    alert(`Agreement for ${selectedAgreement.employeeName} has been rejected.`);
  };
  
  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleReset = () => {
    setFilterText('');
    setFilterBranch('');
    setFilterDepartment('');
  };

  // Apply filters
  const filteredAgreements = agreementList.filter(agreement => {
    const matchesText = filterText === '' || 
      agreement.employeeName.toLowerCase().includes(filterText.toLowerCase()) ||
      agreement.employeeTitle.toLowerCase().includes(filterText.toLowerCase());
    
    const matchesBranch = filterBranch === '' || agreement.branch === filterBranch;
    const matchesDepartment = filterDepartment === '' || agreement.department === filterDepartment;
    
    // Always filter for pending_hod status
    const matchesStatus = agreement.status === 'pending_hod';
    
    return matchesText && matchesBranch && matchesDepartment && matchesStatus;
  });
  
  // Apply pagination
  const totalPages = Math.ceil(filteredAgreements.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const paginatedAgreements = filteredAgreements.slice(indexOfFirstRecord, indexOfLastRecord);

  // Get unique values for filter options
  const branches = [...new Set(agreementList.map(a => a.branch))];
  const departments = [...new Set(agreementList.map(a => a.department))];

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
        <OverallProgress progress={65} riskStatus={false} />
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
                { value: '', label: '-- All Branches/Units --' },
                ...branches.map(branch => ({ value: branch, label: branch }))
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
                  Showing agreements pending your approval as Head of Department.
                </p>
              </div>
            </div>
          </div>
          
          <AgreementToolbar 
            recordsPerPage={recordsPerPage}
            onRecordsPerPageChange={handleRecordsPerPageChange}
            totalRecords={filteredAgreements.length}
            showCreateButton={false} // Hide the Create New Agreement button
          />
          
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
              {paginatedAgreements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No agreements pending your approval at this time.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAgreements.map((agreement) => (
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
                      <AgreementActions
                        agreement={agreement}
                        onReview={handleReview}
                        onPreview={(agreement) => console.log('Preview agreement:', agreement)}
                        showReviewAsApprove={true}
                        showOnlyReviewAndPreview={true}
                      />
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
      
      {selectedAgreement && ( // Ensure selectedAgreement is not null before rendering
        <AgreementApprovalModal 
          isOpen={isModalOpen}
          closeModal={() => {
            setIsModalOpen(false);
            setSelectedAgreement(null); // Clear selected agreement on close
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
