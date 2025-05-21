import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import ObjectiveHeader from '../../../components/balancescorecard/Header';
import OverallProgress from '../../../components/balancescorecard/OverallProgress';
import FilterBox from '../../../components/ui/FilterBox';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import StrategicObjectiveToolbar from './StrategicObjectiveToolbar';
import StrategicObjectiveActions from './StrategicObjectiveActions';
import Pagination from '../../../components/ui/Pagination';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: ExclamationCircleIcon },
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: ExclamationCircleIcon },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: ExclamationCircleIcon },
    approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircleIcon }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </span>
  );
};

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

const StrategicObjectiveList = () => {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPerspective, setFilterPerspective] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);
  
  // Data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [perspectives, setPerspectives] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  // Fetch data (mock for now)
  useEffect(() => {
    // In a real application, you would fetch from your API
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock data based on the provided API response
        const mockResponse = {
          success: true,
          data: {
            department: {
              id: 6,
              name: "Business Technology Department",
              short_code: "BT",
              hod: {
                id: 17,
                surname: "John",
                last_name: "Aogon"
              }
            },
            departments: [
              { id: 1, name: "Information Technology" },
              { id: 2, name: "Finance" },
              { id: 3, name: "Human Resources" },
              { id: 4, name: "Marketing" },
              { id: 5, name: "Operations" },
              { id: 6, name: "Business Technology Department" }
            ],
            perspectives: [
              {
                id: 1,
                name: "INNOVATION, LEARNING & GROWTH",
                short_code: "SP001",
                type: "quantitative",
                weight: 20,
                objectives: [
                  {
                    id: 12,
                    name: "Enhance effectiveness measures",
                    assignment_id: 185,
                    status: "approved",
                    department_id: 6,
                    department_name: "Business Technology Department",
                    created_by: "Jane Smith",
                    approved_by: "Michael Johnson"
                  },
                  {
                    id: 16,
                    name: "Optimize operational allocation",
                    assignment_id: 186,
                    status: "approved",
                    department_id: 1,
                    department_name: "Information Technology",
                    created_by: "David Wilson",
                    approved_by: "Sarah Thomas"
                  }
                ]
              },
              {
                id: 2,
                name: "INTERNAL PROCESSES",
                short_code: "SP002",
                type: "quantitative",
                weight: 20,
                objectives: [
                  {
                    id: 22,
                    name: "Improve customer system",
                    assignment_id: 190,
                    status: "pending",
                    department_id: 4,
                    department_name: "Marketing",
                    created_by: "Robert Brown",
                    approved_by: null
                  },
                  {
                    id: 36,
                    name: "Develop business-focused solutions",
                    assignment_id: 191,
                    status: "draft",
                    department_id: 1,
                    department_name: "Information Technology",
                    created_by: "Emily Clark",
                    approved_by: null
                  }
                ]
              },
              {
                id: 3,
                name: "FINANCIAL",
                short_code: "SP003",
                type: "quantitative",
                weight: 20,
                objectives: []
              },
              {
                id: 4,
                name: "CUSTOMER",
                short_code: "SP004",
                type: "quantitative",
                weight: 20,
                objectives: []
              },
              {
                id: 5,
                name: "INTEGRITY & ACCOUNTABILITY",
                short_code: "SP005",
                type: "qualitative",
                weight: 4,
                objectives: [
                  {
                    id: 3,
                    name: "Enhance engagement capabilities",
                    assignment_id: 203,
                    status: "rejected",
                    department_id: 2,
                    department_name: "Finance",
                    created_by: "John Doe",
                    approved_by: null
                  },
                  {
                    id: 19,
                    name: "Expand operational base",
                    assignment_id: 204,
                    status: "pending",
                    department_id: 5,
                    department_name: "Operations",
                    created_by: "Alice Johnson",
                    approved_by: null
                  }
                ]
              },
              {
                id: 6,
                name: "CUSTOMER CENTRICITY",
                short_code: "SP006",
                type: "qualitative",
                weight: 4,
                objectives: []
              },
              {
                id: 7,
                name: "TEAMWORK & COLLABORATION",
                short_code: "SP007",
                type: "qualitative",
                weight: 4,
                objectives: []
              },
              {
                id: 8,
                name: "EFFICIENCY & EFFECTIVENESS",
                short_code: "SP008",
                type: "qualitative",
                weight: 4,
                objectives: []
              },
              {
                id: 9,
                name: "FAIRNESS & TRANSPARENCY",
                short_code: "SP009",
                type: "qualitative",
                weight: 4,
                objectives: []
              }
            ]
          }
        };
        
        // Process the data
        setPerspectives(mockResponse.data.perspectives);
        setDepartments(mockResponse.data.departments);
        
        // Flatten objectives for table display
        const allObjectives = mockResponse.data.perspectives.flatMap(perspective => 
          perspective.objectives.map(objective => ({
            ...objective,
            perspective_name: perspective.name,
            perspective_type: perspective.type,
            perspective_weight: perspective.weight,
            perspective_id: perspective.id
          }))
        );
        
        setObjectives(allObjectives);
        
      } catch (err) {
        console.error("Error fetching strategic objectives:", err);
        setError("Failed to load strategic objectives.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter objectives based on filter criteria
  const filteredObjectives = objectives.filter(objective => {
    let matchesFilters = true;
    
    if (filterText) {
      matchesFilters = matchesFilters && objective.name.toLowerCase().includes(filterText.toLowerCase());
    }
    
    if (filterStatus) {
      matchesFilters = matchesFilters && objective.status === filterStatus;
    }
    
    if (filterPerspective) {
      matchesFilters = matchesFilters && objective.perspective_name === filterPerspective;
    }
    
    if (filterType) {
      matchesFilters = matchesFilters && objective.perspective_type === filterType;
    }
    
    if (filterDepartment) {
      matchesFilters = matchesFilters && objective.department_name === filterDepartment;
    }
    
    return matchesFilters;
  });
  
  // Apply pagination
  const totalPages = Math.ceil(filteredObjectives.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const paginatedObjectives = filteredObjectives.slice(indexOfFirstRecord, indexOfLastRecord);
  
  // Handler functions
  const handleAddNew = () => {
    navigate('/performance/strategic-objectives/add');
  };
  
  const handleEdit = (objective) => {
    navigate(`/performance/strategic-objectives/edit/${objective.id}`);
  };
  
  const handleApprove = (objective) => {
    console.log("Approve objective:", objective);
    // In a real application, you would make an API call to approve the objective
    
    // Update the local state to show the objective as approved
    const updatedObjectives = objectives.map(obj => {
      if (obj.id === objective.id) {
        return { ...obj, status: 'approved', approved_by: 'Current User' };
      }
      return obj;
    });
    
    setObjectives(updatedObjectives);
  };
  
  const handleDelete = (objective) => {
    setSelectedObjective(objective);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async (objective) => {
    // In a real application, you would call your API to delete the objective
    console.log("Deleting objective:", objective);
    
    // Update the local state to remove the deleted objective
    setObjectives(prev => prev.filter(obj => obj.id !== objective.id));
  };

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterPerspective('');
    setFilterType('');
    setFilterDepartment('');
  };
  
  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Get unique values for filter dropdowns
  const perspectiveNames = [...new Set(objectives.map(obj => obj.perspective_name))];
  const departmentNames = [...new Set(objectives.map(obj => obj.department_name))];
  
  if (loading) {
    return <div className="p-6 text-center">Loading strategic objectives...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4 bg-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Strategic Objectives</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your organization's strategic objectives
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
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ],
            },
            {
              id: 'filterDepartment',
              label: 'Department',
              type: 'select',
              value: filterDepartment,
              onChange: (e) => setFilterDepartment(e.target.value),
              options: [
                { value: '', label: '-- All Departments --' },
                ...departmentNames.map(dept => ({ value: dept, label: dept }))
              ],
            },
            {
              id: 'filterPerspective',
              label: 'Perspective',
              type: 'select',
              value: filterPerspective,
              onChange: (e) => setFilterPerspective(e.target.value),
              options: [
                { value: '', label: '-- All Perspectives --' },
                ...perspectiveNames.map(name => ({ value: name, label: name }))
              ],
            },
            {
              id: 'filterType',
              label: 'Type',
              type: 'select',
              value: filterType,
              onChange: (e) => setFilterType(e.target.value),
              options: [
                { value: '', label: '-- All Types --' },
                { value: 'quantitative', label: 'Quantitative' },
                { value: 'qualitative', label: 'Qualitative' },
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
          <StrategicObjectiveToolbar
            recordsPerPage={recordsPerPage}
            onRecordsPerPageChange={handleRecordsPerPageChange}
            totalRecords={filteredObjectives.length}
            onCreateClick={handleAddNew}
          />
          
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Perspective</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Created By</TableHeader>
                <TableHeader>Approved By</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedObjectives.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No strategic objectives found. Click "Create Strategic Objective" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedObjectives.map((objective) => (
                  <TableRow key={objective.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{objective.name}</TableCell>
                    <TableCell>
                      <div>{objective.perspective_name}</div>
                      <div className="text-xs text-gray-500">
                        <span className="capitalize">{objective.perspective_type}</span> • <span>{objective.perspective_weight}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{objective.department_name}</TableCell>
                    <TableCell>{objective.created_by || 'N/A'}</TableCell>
                    <TableCell>{objective.approved_by || 'Pending'}</TableCell>
                    <TableCell>
                      <StatusBadge status={objective.status} />
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
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
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
    </div>
  );
};

export default StrategicObjectiveList;
