import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader, TableSkeleton } from '../../../components/ui/Tables';
import { createAgreement,updateAgreement,deleteAgreement, fetchMyAgreements, resetMyAgreements } from '../../../redux/agreementSlice';
import { useToast } from '../../../hooks/useToast';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import FilterBox from '../../../components/ui/FilterBox';
import Button from '../../../components/ui/Button';
import {DocumentPlusIcon} from '@heroicons/react/24/outline';
import AgreementActions from './AgreementActions'; 
import SubmitAgreementModal from './SubmitAgreementModal';
import AddAgreement from './AddAgreement';
import EditAgreement from './EditAgreement';
import DeleteAgreementModal from './DeleteAgreementModal';
import StatusBadge from './AgreementStatusBadge';

const AgreementList = () => {
  // Navigation hook
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  // State for filters
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState(null);

  // Get agreements from Redux
  const { myAgreements: agreements, pagination, loading, error } = useSelector((state) => state.agreements);
  const [filteredAgreements, setFilteredAgreements] = useState([]);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Fetch agreements when component mounts
  useEffect(() => {
    // Using fetchMyAgreements with unwrap to catch any errors
    dispatch(fetchMyAgreements())
      .unwrap()
      .catch(error => {
        toast({
          title: "Error",
          description: "Failed to load agreements. Please try again.",
          variant: "destructive",
        });
      });
    
    return () => {
      dispatch(resetMyAgreements());
    };
  }, [dispatch]);

  // Apply filters when filter state or agreements change
  useEffect(() => {
    let filtered = agreements;
    
    if (filterText) {
      filtered = filtered.filter(agreement => 
        (agreement.name || '').toLowerCase().includes(filterText.toLowerCase()) ||
        (agreement.title || '').toLowerCase().includes(filterText.toLowerCase())
      );
    }
    
    if (filterStatus) {
      filtered = filtered.filter(agreement => agreement.status === filterStatus);
    }
    
    if (filterPeriod) {
      filtered = filtered.filter(agreement => {
        // Match based on the period display value
        if (agreement.period === 'annual' && filterPeriod === 'Annual Review') return true;
        if (agreement.period === 'probation' && filterPeriod === 'Probation 6 months') return true;
        return agreement.period === filterPeriod;
      });
    }
    if (filterYear) {
      filtered = filtered.filter(agreement => {
        if (!agreement.created_at && !agreement.createdDate) return false;
        const agreementYear = new Date(agreement.created_at || agreement.createdDate).getFullYear().toString();
        return agreementYear === filterYear;
      });
    }
    
    setFilteredAgreements(filtered);
  }, [filterText, filterStatus, filterPeriod, filterYear, agreements]);

  const handleAddNew = () => {
    setSelectedAgreement(null);
    setIsAddModalOpen(true);
  };

  // Handle the submission of a new agreement
  const handleAddSubmit = async (newAgreement) => {
    try {
      await dispatch(createAgreement(newAgreement)).unwrap();
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Agreement created successfully!",
      });
      // Refresh agreements
      await dispatch(fetchMyAgreements()).unwrap();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agreement. Please try again.",
        variant: "destructive",
      });
    }
  };

  
  const handlePreview = (agreement) => {
    navigate(`/performance/measures/preview/${agreement.id}`);
  };

  // Update the handleEdit function
  const handleEdit = (agreement) => {
    setSelectedAgreement(agreement);
    setIsEditModalOpen(true);
  };

  // Handle the submission of an edited agreement
  const handleEditSubmit = async (updatedAgreement) => {
    try {
      await dispatch(updateAgreement({ 
        id: selectedAgreement.id, 
        formData: updatedAgreement 
      })).unwrap();
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Agreement updated successfully!",
      });
      // Refresh agreements
      await dispatch(fetchMyAgreements()).unwrap();
      setSelectedAgreement(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update agreement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddKPIs = (agreement) => {
    navigate(`/performance/measures/add/${agreement.id}`);
  };

  const handleSubmit = (agreement) => {
    setSelectedAgreement(agreement);
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
     setSelectedAgreement(null);
    try {
      await dispatch(fetchMyAgreements()).unwrap();
    } catch (error) {
      toast({
        title: "Data Refresh Failed",
        description: "Could not refresh the agreements list after submission.",
        variant: "destructive",
      });
    }
  };

  // New handler for deleting an agreement
  const handleDeleteConfirmation = (agreementToDelete) => {
      setSelectedAgreement(agreementToDelete);
      setIsDeleteModalOpen(true);
  };

  // Add a function to handle the actual deletion
  const handleDeleteAgreement = async (agreementId) => {
    try {
      await dispatch(deleteAgreement(agreementId)).unwrap();
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "Agreement deleted successfully!",
      });
      // Refresh agreements
      await dispatch(fetchMyAgreements()).unwrap();
      setSelectedAgreement(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete agreement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterPeriod('');
    setFilterYear(currentYear.toString());
  };

  // Get unique periods for the filter dropdown
  const periods = useMemo(() => {
    return [...new Set(agreements.map(a => {
      if (a.period === 'annual') return 'Annual Review';
      if (a.period === 'probation') return 'Probation 6 months';
      return a.period;
    }))];
  }, [agreements]);

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

  // Show error state
  // if (error && agreements.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-white shadow-md rounded-lg">
  //       <ObjectiveHeader />
  //       <div className="p-4">
  //         <div className="bg-red-50 p-4 rounded-md">
  //           <h3 className="text-sm font-medium text-red-800">Error loading agreements</h3>
  //           <div className="mt-2 text-sm text-red-700">
  //             <p>{typeof error === 'object' && error !== null ? error.message : error}</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Agreements</h1>
          <p className="text-sm text-gray-600 mt-1">
            Setup your performance agreements and submit them for review.
          </p>
        </div>
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
                  { value: 'pending_supervisor', label: 'Pending Supervisor' },
                  { value: 'pending_hod', label: 'Pending HOD' },
                  { value: 'approved_supervisor', label: 'Supervisor Approved' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' },
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
            }
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
          
          {/* Conditional loading state only for the table */}
          <div>
            {loading && agreements.length === 0 ? (
              <TableSkeleton 
                rows={8} 
                columns={8} 
                columnWidths={['20%', '10%', '15%', '15%', '15%', '10%', '10%', '15%']} 
              />
            ) : (
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
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No agreements found. Click "Create New Agreement" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAgreements.map((agreement) => (
                      <TableRow key={agreement.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="text-sm font-medium text-gray-900">{agreement.name || agreement.title}</div>
                        </TableCell>
                        <TableCell>
                          {agreement.period === 'annual' ? 'Annual Review' : 
                          agreement.period === 'probation' ? 'Probation 6 months' : 
                          agreement.period}
                        </TableCell>
                        <TableCell>
                          {agreement.supervisor ? 
                            `${agreement.supervisor.surname} ${agreement.supervisor.first_name}` : 
                            agreement.supervisorName || 'Not assigned'}
                        </TableCell>
                        <TableCell>
                          {agreement.hod ? 
                            `${agreement.hod.surname} ${agreement.hod.first_name}` : 
                            agreement.hodName || 'Not assigned'}
                        </TableCell>
                        <TableCell>
                          <div>
                            {formatDate(agreement.created_at || agreement.createdDate)}
                            <span className="block text-xs text-gray-500 mt-1">
                              {getTimeAgo(agreement.created_at || agreement.createdDate)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {agreement.submitted_at || agreement.submittedDate ? (
                            <div>
                              {formatDate(agreement.submitted_at || agreement.submittedDate)}
                              <span className="block text-xs text-gray-500 mt-1">
                                {getTimeAgo(agreement.submitted_at || agreement.submittedDate)}
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
                          {agreement.status === 'draft' || agreement.status === 'rejected' ? (
                            <AgreementActions
                              agreement={agreement}
                              onEdit={() => handleEdit(agreement)}
                              onSubmit={() => handleSubmit(agreement)}
                              onDelete={() => handleDeleteConfirmation(agreement)}
                              onAddKPI={() => handleAddKPIs(agreement)}
                            />
                          ) : (
                            <div className="flex items-center gap-3">
                              <AgreementActions
                                agreement={agreement}
                                onEdit={() => handleEdit(agreement)}
                                showOnlyReviewAndPreview={true}
                                onPreview={handlePreview}
                              />
                              {/* <span className="text-gray-500 text-sm">
                                {agreement.status === 'pending_supervisor' ? 'Pending Supervisor Review' :
                                  agreement.status === 'pending_hod' ? 'Pending HOD Review' :
                                  agreement.status === 'approved_supervisor' ? 'Approved by Supervisor' :
                                  agreement.status === 'approved' ? 'Approved' :
                                  'Under Review'}
                              </span> */}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <AddAgreement
          isOpen={isAddModalOpen}
          closeModal={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSubmit}
        />
        
        {selectedAgreement && (
          <EditAgreement
            isOpen={isEditModalOpen}
            closeModal={() => {
              setIsEditModalOpen(false);
              setSelectedAgreement(null);
            }}
            onSubmit={handleEditSubmit}
            agreement={selectedAgreement}
          />
        )}
        
        {selectedAgreement && (
          <SubmitAgreementModal
            isOpen={isSubmitModalOpen}
            closeModal={() => setIsSubmitModalOpen(false)}
            agreement={selectedAgreement}
            onSubmit={handleConfirmSubmit}
          />
        )}
        
        {/* Add Delete Agreement Modal */}
        {selectedAgreement && (
          <DeleteAgreementModal
            isOpen={isDeleteModalOpen}
            closeModal={() => {
              setIsDeleteModalOpen(false);
              setSelectedAgreement(null);
            }}
            onConfirm={() => handleDeleteAgreement(selectedAgreement.id)}
            agreement={selectedAgreement}
          />
        )}
      </div>
    </div>
  );
};

export default AgreementList;