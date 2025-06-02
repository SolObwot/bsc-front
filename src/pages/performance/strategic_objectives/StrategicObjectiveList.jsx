import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStrategicObjectives, deleteStrategicObjective, approveStrategicObjective } from '../../../redux/strategicObjectiveSlice';
import useStrategicObjectiveFilters from '../../../hooks/strategicObjective/useStrategicObjectiveFilters';
import useStrategicObjectivePagination from '../../../hooks/strategicObjective/useStrategicObjectivePagination';
import { useToast, ToastContainer } from "../../../hooks/useToast";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import FilterBox from '../../../components/ui/FilterBox';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import StrategicObjectiveForm from './StrategicObjectiveForm';
import StrategicObjectiveToolbar from './StrategicObjectiveToolbar';
import StrategicObjectiveActions from './StrategicObjectiveActions';
import Pagination from '../../../components/ui/Pagination';
import StatusBadge from './StatusBadge';

// Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, closeModal, onConfirm, objective }) => {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all border border-red-100">
                <div className="bg-red-50 px-6 py-5 border-b border-red-100">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold text-gray-800">
                      Delete Strategic Objective
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-red-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Are you sure you want to delete this strategic objective?
                    </p>
                    <p className="text-red-600 text-sm">
                      This action cannot be undone. All associated data will be permanently removed.
                    </p>
                    
                    <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                      <p className="font-medium">Objective Details:</p>
                      <p>Name: {objective?.name}</p>
                      <p>Status: {objective?.status}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={closeModal}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onConfirm(objective);
                        closeModal();
                      }}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete Objective
                    </button>
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

// Create Strategic Objective Modal Component
const CreateObjectiveModal = ({ isOpen, closeModal, onSubmit, perspectives, departments }) => {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="bg-teal-50 px-6 py-5 border-b border-teal-100">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold text-gray-800">
                      Create Strategic Objective
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <StrategicObjectiveForm
                    perspectives={perspectives}
                    departments={departments}
                    onSubmit={onSubmit}
                    onCancel={closeModal}
                    isModal={true}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const StrategicObjectiveList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const { data, loading, error } = useSelector((state) => state.strategicObjectives);
  
  // Use the flattened objectives array instead of the nested structure
  const objectives = data?.flattenedObjectives || [];
  const departments = data?.departments || [];
  
  // Extract unique department info for the filter dropdown
  const departmentOptions = useMemo(() => {
    const uniqueDepartments = new Map();
    objectives.forEach(obj => {
      if (obj.department_id && obj.department_name) {
        uniqueDepartments.set(obj.department_id, obj.department_name);
      }
    });
    
    // Also add departments from the departments array
    departments.forEach(dept => {
      if (dept.department?.id && dept.department?.name) {
        uniqueDepartments.set(dept.department.id, dept.department.name);
      }
    });
    
    return Array.from(uniqueDepartments.entries()).map(([id, name]) => ({
      id,
      name
    }));
  }, [objectives, departments]);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);
  
  // Filter and pagination hooks
  const { filteredObjectives, filterProps } = useStrategicObjectiveFilters(objectives);
  const { paginatedObjectives, paginationProps } = useStrategicObjectivePagination(filteredObjectives);
  
  // Extract perspective names and types for filters
  const perspectiveNames = [...new Set(objectives.map(obj => obj.perspective?.name).filter(Boolean))];
  const perspectiveTypes = [...new Set(objectives.map(obj => obj.perspective?.type).filter(Boolean))];
  
  useEffect(() => {
    dispatch(fetchStrategicObjectives());
  }, [dispatch]);
  
  const handleAddNew = () => {
    setIsCreateModalOpen(true);
  };
  
  const handleCreateSubmit = async (formData) => {
    try {
      setIsCreateModalOpen(false);
      toast({
        title: "Success",
        description: "Strategic objective created successfully",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create strategic objective",
        variant: "destructive",
      });
    }
  };
  
  const handleEdit = (objective) => {
    navigate(`/performance/strategic-objectives/edit/${objective.id}`);
  };
  
  const handleApprove = async (objective) => {
    try {
      await dispatch(approveStrategicObjective(objective.id)).unwrap();
      toast({
        title: "Success",
        description: "Strategic objective approved successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve strategic objective",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = (objective) => {
    setSelectedObjective(objective);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async (objective) => {
    try {
      await dispatch(deleteStrategicObjective(objective.id)).unwrap();
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: "Strategic objective deleted successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete strategic objective",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return <div className="p-6 text-center">Loading strategic objectives...</div>;
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
          <h1 className="text-xl font-bold text-gray-800">Setup and Manage Department Strategic Objectives</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage strategic objectives across all departments. Use the filters to find specific objectives, or create new ones.
          </p>
        </div>
        <OverallProgress progress={85} riskStatus={false} />
      </div>
      
      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="Strategic Objectives Filters"
          filters={[
            {
              id: 'filterText',
              label: 'Search',
              type: 'text',
              placeholder: 'Search by objective name...',
              value: filterProps.filterText,
              onChange: (e) => filterProps.setFilterText(e.target.value),
            },
            {
              id: 'filterYear',
              label: 'Year',
              type: 'select',
              value: filterProps.filterYear,
              onChange: (e) => filterProps.setFilterYear(e.target.value),
              options: [
                { value: '', label: '-- All Years --' },
                { value: filterProps.currentYear.toString(), label: filterProps.currentYear.toString() },
                { value: (filterProps.currentYear - 1).toString(), label: (filterProps.currentYear - 1).toString() },
                { value: (filterProps.currentYear - 2).toString(), label: (filterProps.currentYear - 2).toString() },
                { value: (filterProps.currentYear - 3).toString(), label: (filterProps.currentYear - 3).toString() },
              ],
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
            {
              id: 'filterPerspective',
              label: 'Perspective',
              type: 'select',
              value: filterProps.filterPerspective,
              onChange: (e) => filterProps.setFilterPerspective(e.target.value),
              options: [
                { value: '', label: '-- All Perspectives --' },
                ...perspectiveNames.map(name => ({ value: name, label: name }))
              ],
            },
            {
              id: 'filterType',
              label: 'Type',
              type: 'select',
              value: filterProps.filterType,
              onChange: (e) => filterProps.setFilterType(e.target.value),
              options: [
                { value: '', label: '-- All Types --' },
                ...perspectiveTypes.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }))
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
          <StrategicObjectiveToolbar
            recordsPerPage={paginationProps.recordsPerPage}
            onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
            totalRecords={filteredObjectives.length}
            onCreateClick={handleAddNew}
          />
          
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Strategic Objective(s)</TableHeader>
                <TableHeader>Strategy Perspective</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Created By</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedObjectives.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No strategic objectives found. Click "Create Strategic Objective" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedObjectives.map((objective) => (
                  <TableRow key={objective.id || `objective-${Math.random()}`} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {objective.objective?.name || objective.name || 'Unnamed Objective'}
                    </TableCell>
                    <TableCell>
                      <div>{objective.perspective?.name || 'N/A'}</div>
                      <div className="text-xs text-gray-500">
                        <span className="capitalize">{objective.perspective?.type || 'N/A'}</span> • 
                        <span>{objective.perspective?.weight || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {objective.department_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {objective.creator ? 
                        `${objective.creator.surname || ''} ${objective.creator.last_name || ''}` : 
                        'N/A'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={objective.status || 'pending'} />
                    </TableCell>
                    <TableCell>
                      <StrategicObjectiveActions
                        objective={objective}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onApprove={handleApprove}
                        showApproveButton={objective.status === 'pending' || objective.status === 'draft'}
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
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        objective={selectedObjective}
      />
      
      {/* Create Strategic Objective Modal */}
      <CreateObjectiveModal
        isOpen={isCreateModalOpen}
        closeModal={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        perspectives={objectives.map(obj => obj.perspective).filter((perspective, index, self) => 
          perspective && self.findIndex(p => p?.id === perspective?.id) === index
        )}
        departments={departmentOptions}
      />
    </div>
  );
};

export default StrategicObjectiveList;
