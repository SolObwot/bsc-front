import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import FilterBox from '../../../components/ui/FilterBox';
import Button from '../../../components/ui/Button';
import { DocumentPlusIcon, ArrowUpTrayIcon } from '@heroicons/react/20/solid';
// Dialog, Transition, Fragment, XMarkIcon will be imported by SubmitAgreementModal if needed directly, or not if encapsulated
import AgreementActions from './AgreementActions'; 
import SubmitAgreementModal from './SubmitAgreementModal'; // Added import

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfigs = {
    draft: {
      color: 'bg-gray-100 text-gray-700',
      label: 'Draft'
    },
    submitted: {
      color: 'bg-blue-100 text-blue-700',
      label: 'Submitted for Review'
    }
  };

  const config = statusConfigs[status] || statusConfigs.draft;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const AgreementList = () => {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  
  // Modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);

  // Sample agreements with both draft and submitted statuses
  const [agreements, setAgreements] = useState([
    {
      id: 1,
      title: 'Performance Agreement 2025',
      name: 'John Doe',
      employeeName: 'John Doe',
      employeeTitle: 'Software Developer',
      supervisorName: 'Jane Manager',
      hodName: 'Robert Director',
      period: 'Annual Review',
      createdDate: '2025-05-01',
      submittedDate: null,
      status: 'draft'
    },
    {
      id: 2,
      title: 'Performance Agreement 2024',
      name: 'Jane Smith',
      employeeName: 'Jane Smith',
      employeeTitle: 'UX Designer',
      supervisorName: 'Mike Manager',
      hodName: 'Sarah Director',
      period: 'Probation 6 months',
      createdDate: '2023-12-10',
      submittedDate: '2024-01-05',
      status: 'submitted'
    }
  ]);
  
  const [filteredAgreements, setFilteredAgreements] = useState(agreements);

  // Apply filters when filter state changes
  useEffect(() => {
    let filtered = agreements;
    
    if (filterText) {
      filtered = filtered.filter(agreement => 
        agreement.title.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    
    if (filterStatus) {
      filtered = filtered.filter(agreement => agreement.status === filterStatus);
    }
    
    if (filterPeriod) {
      filtered = filtered.filter(agreement => agreement.period === filterPeriod);
    }
    
    setFilteredAgreements(filtered);
  }, [filterText, filterStatus, filterPeriod, agreements]);

  const handleAddNew = () => {
    navigate('/performance/agreement/new');
  };

  const handleEdit = (agreement) => {
    navigate(`/performance/agreement/edit/${agreement.id}`);
  };

  const handleSubmit = (agreement) => {
    setSelectedAgreement(agreement);
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = (agreementId, status) => {
    // Update agreement status in memory (no localStorage)
    const updatedAgreements = agreements.map(agreement => {
      if (agreement.id === agreementId) {
        return {
          ...agreement,
          status: status,
          submittedDate: new Date().toISOString()
        };
      }
      return agreement;
    });
    
    setAgreements(updatedAgreements);
    setIsSubmitModalOpen(false);
    alert('Agreement successfully submitted for review!');
  };

  // New handler for deleting an agreement
  const handleDeleteConfirmation = (agreementToDelete) => {
    if (window.confirm(`Are you sure you want to delete the agreement "${agreementToDelete.title}"? This action cannot be undone.`)) {
      setAgreements(prevAgreements => prevAgreements.filter(ag => ag.id !== agreementToDelete.id));
      alert('Agreement deleted successfully.');
    }
  };

  // New handler for adding KPIs
  const handleAddKPIs = (agreement) => {
    alert(`Coming Soon`);
  };

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterPeriod('');
  };

  // Get unique periods for the filter dropdown
  const periods = [...new Set(agreements.map(a => a.period))];

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
        <h1 className="text-xl font-bold text-gray-800">My Performance Agreements</h1>
        <OverallProgress progress={90} riskStatus={false} />
      </div>
      
      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="My Performance Agreements Filters"
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
                { value: 'draft', label: 'Draft' },
                { value: 'submitted', label: 'Submitted for Review' },
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
        
        {/* Toolbar */}
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-4">
            <Button
              type="button"
              variant="pride"
              className="flex items-center gap-2 mb-4 sm:mb-0"
              onClick={handleAddNew}
            >
              <DocumentPlusIcon className="h-5 w-5" aria-hidden="true" />
              Create New Agreement
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {filteredAgreements.length > 0 
                  ? `(${filteredAgreements.length}) Records Found` 
                  : 'No Records Found'}
              </span>
            </div>
          </div>
          
          {/* Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Agreement Name</TableHeader>
                <TableHeader>Period</TableHeader>
                <TableHeader>Supervisor</TableHeader>
                <TableHeader>HOD/Line Manager</TableHeader>
                <TableHeader>Created</TableHeader>
                <TableHeader>Submitted</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAgreements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No agreements found. Click "Create New Agreement" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgreements.map((agreement) => (
                  <TableRow key={agreement.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{agreement.title}</div>
                    </TableCell>
                    <TableCell>{agreement.period}</TableCell>
                    <TableCell>{agreement.supervisorName}</TableCell>
                    <TableCell>{agreement.hodName}</TableCell>
                    <TableCell>
                      <div>
                        {formatDate(agreement.createdDate)}
                        <span className="block text-xs text-gray-500 mt-1">
                          {getTimeAgo(agreement.createdDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {agreement.submittedDate ? (
                        <div>
                          {formatDate(agreement.submittedDate)}
                          <span className="block text-xs text-gray-500 mt-1">
                            {getTimeAgo(agreement.submittedDate)}
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
                      {agreement.status === 'draft' ? (
                        <AgreementActions
                          agreement={agreement}
                          onEdit={() => handleEdit(agreement)}
                          onSubmit={() => handleSubmit(agreement)}
                          onDelete={() => handleDeleteConfirmation(agreement)}
                          onAddKPI={() => handleAddKPIs(agreement)}
                        />
                      ) : agreement.status === 'submitted' ? (
                        <span className="text-gray-500 text-sm">
                          Under Review
                        </span>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Submit Confirmation Modal */}
      {selectedAgreement && (
        <SubmitAgreementModal
          isOpen={isSubmitModalOpen}
          closeModal={() => setIsSubmitModalOpen(false)}
          agreement={selectedAgreement}
          onSubmit={handleConfirmSubmit}
        />
      )}
    </div>
  );
};

export default AgreementList;
