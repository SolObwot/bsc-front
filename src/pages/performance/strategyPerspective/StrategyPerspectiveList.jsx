import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartmentWeights, deleteDepartmentWeight, approveDepartmentWeight, createDepartmentWeight, updateDepartmentWeight } from '../../../redux/strategyPerspectiveSlice';
import useStrategicPerspectiveFilters from '../../../hooks/strategyPerspective/useStrategicPerspectiveFilters';
import useStrategicPerspectivePagination from '../../../hooks/strategyPerspective/useStrategicPerspectivePagination';
import { useToast, ToastContainer } from "../../../hooks/useToast";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import FilterBox from '../../../components/ui/FilterBox';
import StrategyPerspectiveToolbar from './StrategyPerspectiveToolbar';
import StrategyPerspectiveActions from './StrategyPerspectiveActions';
import StrategyPerspectiveStatusBadge from './StrategyPerspectiveStatusBadge';
import Pagination from '../../../components/ui/Pagination';
import DeleteWeightModal from './DeleteWeightModal';
import CreateWeightModal from './CreateWeightModal';

const StrategyPerspectiveList = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const { departments, loading, error } = useSelector((state) => state.strategyPerspective);
  
  // Add debug logs
  useEffect(() => {
    console.log('Redux State - departments:', departments);
  }, [departments]);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Use our custom hooks
  const { allWeights, filteredWeights, filterProps } = useStrategicPerspectiveFilters(departments);
  const { paginatedWeights, paginationProps } = useStrategicPerspectivePagination(filteredWeights);
  
  // Add debug logs - NOW CORRECTLY PLACED AFTER paginatedWeights is defined
  useEffect(() => {
    console.log('All weights:', allWeights);
    console.log('Filtered weights:', filteredWeights);
    console.log('Paginated weights:', paginatedWeights);
  }, [allWeights, filteredWeights, paginatedWeights]);
  
  // Extract unique departments for filter
  const departmentOptions = useMemo(() => {
    return departments.map(dept => ({
      id: dept.id,
      name: dept.name
    }));
  }, [departments]);
  
  // Extract unique perspectives for the AddWeightModal
  const allPerspectives = useMemo(() => {
    const perspectivesMap = new Map();
    
    allWeights.forEach(weight => {
      if (weight.perspective) {
        perspectivesMap.set(weight.perspective.id, weight.perspective);
      }
    });
    
    return Array.from(perspectivesMap.values());
  }, [allWeights]);
  
  // Extract unique perspective types for the filter
  const perspectiveTypes = useMemo(() => {
    return [...new Set(allWeights.map(weight => weight.perspective?.type).filter(Boolean))];
  }, [allWeights]);
  
  useEffect(() => {
    dispatch(fetchDepartmentWeights());
  }, [dispatch]);
  
  const handleAddNew = () => {
    setSelectedWeight(null);
    setIsEditing(false);
    setIsAddModalOpen(true);
  };
  
  const handleEdit = (weight) => {
    setSelectedWeight(weight);
    setIsEditing(true);
    setIsAddModalOpen(true);
  };
  
  const handleDelete = (weight) => {
    setSelectedWeight(weight);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async (weight) => {
    try {
      await dispatch(deleteDepartmentWeight(weight.id)).unwrap();
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "Perspective weight deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete perspective weight",
        variant: "destructive",
      });
    }
  };
  
  const handleApprove = async (weight) => {
    try {
      await dispatch(approveDepartmentWeight(weight.id)).unwrap();
      toast({
        title: "Success",
        description: "Perspective weight approved successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve perspective weight",
        variant: "destructive",
      });
    }
  };
  
  const handleAddSubmit = async (formData) => {
    try {
      if (isEditing) {
        await dispatch(updateDepartmentWeight({
          id: selectedWeight.id,
          formData
        })).unwrap();
        
        toast({
          title: "Success",
          description: "Perspective weight updated successfully",
          variant: "success",
        });
      } else {
        await dispatch(createDepartmentWeight(formData)).unwrap();
        
        toast({
          title: "Success",
          description: "Perspective weight created successfully",
          variant: "success",
        });
      }
      
      setIsAddModalOpen(false);
      // Refresh the list
      dispatch(fetchDepartmentWeights());
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: isEditing 
          ? `Failed to update perspective weight: ${error.message || 'Unknown error'}`
          : "Failed to create perspective weight",
        variant: "destructive",
      });
    }
  };
  
  if (loading && departments.length === 0) {
    return <div className="p-6 text-center">Loading strategy perspectives...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ToastContainer />
      <ObjectiveHeader />
      <div className="flex justify-between p-4 bg-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Assign Perspective Weight to Department</h1>
          <p className="text-sm text-gray-600 mt-1">
            Assign perspective weight to each strategic perspective for every department.
          </p>
        </div>
      </div>
      
      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="Strategy Perspective Filters"
          filters={[
            {
              id: 'filterText',
              label: 'Search',
              type: 'text',
              placeholder: 'Search by perspective or department...',
              value: filterProps.filterText,
              onChange: (e) => filterProps.setFilterText(e.target.value),
            },
            {
              id: 'filterDepartment',
              label: 'Department',
              type: 'select',
              value: filterProps.filterDepartment,
              onChange: (e) => filterProps.setFilterDepartment(e.target.value),
              options: [
                { value: '', label: '-- All Departments --' },
                ...departmentOptions.map(dept => ({ value: dept.id, label: dept.name }))
              ],
            },
            {
              id: 'filterPerspectiveType',
              label: 'Perspective Type',
              type: 'select',
              value: filterProps.filterPerspectiveType,
              onChange: (e) => filterProps.setFilterPerspectiveType(e.target.value),
              options: [
                { value: '', label: '-- All Types --' },
                ...perspectiveTypes.map(type => ({ 
                  value: type, 
                  label: type.charAt(0).toUpperCase() + type.slice(1) 
                }))
              ],
            },
            {
              id: 'filterStatus',
              label: 'Status',
              type: 'select',
              value: filterProps.filterStatus,
              onChange: (e) => filterProps.setFilterStatus(e.target.value),
              options: [
                { value: '', label: '-- All Statuses --' },
                { value: 'draft', label: 'Draft' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ],
            },
          ]}
          buttons={[
            {
              label: 'Reset Filters',
              variant: 'secondary',
              onClick: filterProps.handleReset,
            },
          ]}
        />
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
          <StrategyPerspectiveToolbar
            recordsPerPage={paginationProps.recordsPerPage}
            onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
            totalRecords={filteredWeights.length}
            onCreateClick={handleAddNew}
            showCreateButton={true}
          />
          
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Department</TableHeader>
                <TableHeader>Perspective</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Weight (%)</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Created By</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedWeights.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {departments.length === 0 ? (
                      "No departments found. Please check API connection."
                    ) : allWeights.length === 0 ? (
                      "No weights found in departments. Please check department data structure."
                    ) : filteredWeights.length === 0 ? (
                      "No weights match your filter criteria. Try clearing filters."
                    ) : (
                      "No perspective weights found. Click 'Create Strategy Perspective Weight' to assign weights."
                    )}
                    
                    {/* Debug info - Remove in production */}
                    <div className="mt-4 text-xs text-left bg-gray-100 p-4 rounded-md overflow-auto max-h-40">
                      <p className="font-bold">Debug Info:</p>
                      <p>Departments: {departments.length}</p>
                      <p>All Weights: {allWeights.length}</p>
                      <p>Filtered Weights: {filteredWeights.length}</p>
                      <p>Current Filters: {Object.entries(filterProps)
                        .filter(([key, value]) => typeof value !== 'function' && value)
                        .map(([key, value]) => `${key}=${value}`)
                        .join(', ') || 'None'}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedWeights.map((weight) => (
                  <TableRow key={weight.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {weight.department_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {weight.perspective?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{weight.perspective?.type || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{weight.weight}%</span>
                    </TableCell>
                    <TableCell>
                      <StrategyPerspectiveStatusBadge status={weight.status || 'pending'} />
                    </TableCell>
                    <TableCell>
                      {weight.creator ? 
                        `${weight.creator.surname || ''} ${weight.creator.last_name || ''}` : 
                        'N/A'}
                    </TableCell>
                    <TableCell>
                      <StrategyPerspectiveActions
                        weight={weight}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onApprove={handleApprove}
                        showApproveButton={weight.status === 'pending' || weight.status === 'draft'}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          <div className="mt-4">
            <Pagination
              currentPage={paginationProps.currentPage}
              totalPages={paginationProps.totalPages}
              onPageChange={paginationProps.handlePageChange}
            />
          </div>
        </div>
      </div>
      
      {/* Use the new component modals */}
      <DeleteWeightModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        weight={selectedWeight}
      />
      
      <CreateWeightModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        departments={departments}
        perspectives={allPerspectives}
        initialData={isEditing ? selectedWeight : null}
      />
    </div>
  );
};

export default StrategyPerspectiveList;
