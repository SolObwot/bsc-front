import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon,
  ArrowPathIcon,
  InboxIcon
} from '@heroicons/react/24/outline';
import FilterBox from '../../components/ui/FilterBox';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui/Tables';
import Pagination from '../../components/ui/Pagination';
import UndertakingToolbar from './UndertakingToolbar';
import UndertakingActions from './UndertakingActions';

const UndertakingList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [undertakings, setUndertakings] = useState([]);
  const [filteredUndertakings, setFilteredUndertakings] = useState([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState(''); // Changed from new Date().getFullYear().toString() to ''
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  // Mock data for undertakings
  useEffect(() => {
    // Simulate API call to fetch undertakings
    setTimeout(() => {
      const mockUndertakings = [
        { 
          id: 1, 
          title: 'Code of Ethical Conduct', 
          type: 'ethics',
          year: '2023',
          description: 'Annual declaration of adherence to the company code of ethics',
          dateIssued: '2023-01-15', 
          dueDate: '2023-02-15',
          status: 'signed',
          signedDate: '2023-01-20'
        },
        { 
          id: 2, 
          title: 'HR Policy Manual', 
          type: 'policy',
          year: '2023',
          description: 'Acknowledgment of HR policy manual and guidelines',
          dateIssued: '2023-01-15', 
          dueDate: '2023-02-15',
          status: 'pending',
          signedDate: null
        },
        { 
          id: 3, 
          title: 'Sexual Harassment Declaration', 
          type: 'declaration',
          year: '2023',
          description: 'Declaration form regarding sexual harassment policies',
          dateIssued: '2023-01-15', 
          dueDate: '2023-02-15',
          status: 'signed',
          signedDate: '2023-01-18'
        },
        { 
          id: 4, 
          title: 'Anti-Fraud Undertaking', 
          type: 'anti-fraud',
          year: '2023',
          description: 'Commitment to anti-fraud policies and procedures',
          dateIssued: '2023-01-15', 
          dueDate: '2023-02-15',
          status: 'pending',
          signedDate: null
        },
        { 
          id: 5, 
          title: 'Confidentiality Acknowledgement', 
          type: 'confidentiality',
          year: '2023',
          description: 'Acknowledgment of confidentiality obligations',
          dateIssued: '2023-01-15', 
          dueDate: '2023-02-15',
          status: 'pending',
          signedDate: null
        }
      ];
      
      setUndertakings(mockUndertakings);
      setFilteredUndertakings(mockUndertakings);
      setIsLoading(false);
    }, 1200);
  }, []);

  // Apply filters when filter states change
  useEffect(() => {
    filterUndertakings();
  }, [searchTerm, statusFilter, yearFilter, undertakings]);

  const filterUndertakings = () => {
    let filtered = [...undertakings];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }
    
    // Filter by year - only apply if yearFilter has a value
    if (yearFilter && yearFilter !== '') {
      filtered = filtered.filter(doc => doc.year === yearFilter);
    }
    
    setFilteredUndertakings(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
    setYearFilter(''); // Changed to empty string instead of current year
  };

  // Pagination functions
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset to first page
  };

  const totalPages = Math.ceil(filteredUndertakings.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const paginatedUndertakings = filteredUndertakings.slice(indexOfFirstRecord, indexOfLastRecord);

  // Action handlers
  const handleCreateNew = () => {
    navigate('/hr/annual-undertaking/create');
  };

  const handleViewTemplates = () => {
    navigate('/hr/annual-undertaking/templates');
  };
  
  const handleViewReports = () => {
    navigate('/hr/annual-undertaking/reports');
  };

  const handleView = (undertaking) => {
    // Navigate to view page or open modal
    navigate(`/hr/annual-undertaking/sign/${undertaking.id}?mode=view`);
  };

  const handleSign = (undertaking) => {
    navigate(`/hr/annual-undertaking/sign/${undertaking.id}`);
  };

  const handleDownload = (undertaking) => {
    // In a real implementation, trigger download
    alert(`Downloading undertaking: ${undertaking.title}`);
  };

  const handleCheckHistory = (undertaking) => {
    // In a real implementation, show history modal
    alert(`Viewing history for: ${undertaking.title}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'signed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Signed</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'expired':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expired</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getUndertakingTypeLabel = (type) => {
    switch (type) {
      case 'ethics': return 'Ethics';
      case 'policy': return 'Policy';
      case 'declaration': return 'Declaration';
      case 'anti-fraud': return 'Anti-Fraud';
      case 'confidentiality': return 'Confidentiality';
      default: return 'General';
    }
  };

  return (
    <div className="w-full p-4 mt-8">
      <FilterBox
        title="Annual Undertaking Forms"
        description="View and sign your annual undertaking forms and declarations"
        filters={[
          {
            id: 'searchTerm',
            label: 'Search',
            type: 'search',
            placeholder: 'Search by title or description...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
          },
          {
            id: 'yearFilter',
            label: 'Year',
            type: 'select',
            value: yearFilter,
            onChange: (e) => setYearFilter(e.target.value),
            options: [
              { value: '', label: '-- All Years --' },
              { value: '2023', label: '2023' },
              { value: '2022', label: '2022' },
              { value: '2021', label: '2021' },
            ],
          },
          {
            id: 'statusFilter',
            label: 'Status',
            type: 'select',
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            options: [
              { value: '', label: '-- All Statuses --' },
              { value: 'pending', label: 'Pending' },
              { value: 'signed', label: 'Signed' },
              { value: 'expired', label: 'Expired' },
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
        <UndertakingToolbar 
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={handleRecordsPerPageChange}
          totalRecords={filteredUndertakings.length}
          onCreateNew={handleCreateNew}
          onViewTemplates={handleViewTemplates}
          onViewReports={handleViewReports}
        />

        {isLoading ? (
          <div className="bg-white rounded-lg p-16 flex flex-col items-center justify-center">
            <ArrowPathIcon className="h-10 w-10 text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500">Loading undertaking forms...</p>
          </div>
        ) : filteredUndertakings.length === 0 ? (
          <div className="bg-white rounded-lg p-16 flex flex-col items-center justify-center">
            <InboxIcon className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No undertaking forms found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm || statusFilter || yearFilter !== new Date().getFullYear().toString()
                ? 'Try adjusting your filters to find more forms'
                : 'No forms are available for you at this time'}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Title</TableHeader>
                  <TableHeader>Description</TableHeader>
                  {/* <TableHeader>Issue Date</TableHeader> */}
                  <TableHeader>Due Date</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUndertakings.map(undertaking => (
                  <TableRow key={undertaking.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{undertaking.title}</span>
                        <div className="flex space-x-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                            {getUndertakingTypeLabel(undertaking.type)}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 w-fit">
                            {undertaking.year}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate">{undertaking.description}</TableCell>
                    {/* <TableCell>{undertaking.dateIssued}</TableCell> */}
                    <TableCell>{undertaking.dueDate}</TableCell>
                    <TableCell>{getStatusBadge(undertaking.status)}</TableCell>
                    <TableCell>
                      <UndertakingActions
                        undertaking={undertaking}
                        onView={handleView}
                        onSign={handleSign}
                        onDownload={handleDownload}
                        onCheckHistory={handleCheckHistory}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UndertakingList;
