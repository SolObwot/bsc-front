import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDepartments, createDepartment, updateDepartment } from "../../../redux/departmentSlice";
import { useDepartmentFilters } from "../../../hooks/department/useDepartmentFilters";
import { useDepartmentPagination } from "../../../hooks/department/useDepartmentPagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import DepartmentToolbar from "./DepartmentToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import DepartmentActions from "./DepartmentActions";
import DeleteDepartment from "./DeleteDepartment";
import Pagination from "../../../components/ui/Pagination";
import DepartmentModal from "./DepartmentModal";

const DepartmentList = () => {
  const dispatch = useDispatch();
  const { allDepartments = [], loading, error } = useSelector((state) => state.departments || {});
  const { toast } = useToast();

  // Modal state management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const { filteredDepartments, filterProps } = useDepartmentFilters(allDepartments);
  const { paginatedDepartments, paginationProps } = useDepartmentPagination(filteredDepartments);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  };

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (newDepartment) => {
    try {
      await dispatch(createDepartment(newDepartment)).unwrap();
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Department created successfully!",
      });
      dispatch(fetchDepartments());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create department. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (updatedDepartment) => {
    try {
      await dispatch(updateDepartment({ 
        id: selectedDepartment.id, 
        formData: updatedDepartment 
      })).unwrap();
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Department updated successfully!",
      });
      dispatch(fetchDepartments());
      setSelectedDepartment(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update department. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch departments. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteDepartment
        departmentToDelete={departmentToDelete}
        setDepartmentToDelete={setDepartmentToDelete}
      />

      <FilterBox
        title="Department List"
        filters={[
          {
            id: 'filterText',
            label: 'Department Name',
            type: 'search',
            placeholder: 'Type for department name...',
            value: filterProps.filterText,
            onChange: (e) => filterProps.setFilterText(e.target.value),
          },
          {
            id: 'filterShortCode',
            label: 'Short Code',
            type: 'search',
            placeholder: 'Type for short code...',
            value: filterProps.filterShortCode,
            onChange: (e) => filterProps.setFilterShortCode(e.target.value),
          },
          {
            id: 'filterStatus',
            label: 'Status',
            type: 'select',
            value: filterProps.filterStatus,
            onChange: (e) => filterProps.setFilterStatus(e.target.value),
            options: [
              { value: '', label: '-- Select --' },
              { value: 'enabled', label: 'Active' },
              { value: 'disabled', label: 'Inactive' },
            ],
          },
        ]}
        buttons={[
          {
            label: 'Reset',
            variant: 'secondary',
            onClick: filterProps.handleReset,
          },
        ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <DepartmentToolbar
          onAddDepartment={handleAddDepartment}
          recordsPerPage={paginationProps.recordsPerPage}
          onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
          totalRecords={filteredDepartments.length}
        />

        {loading ? (
          <TableSkeleton 
            rows={5} 
            columns={4} 
            columnWidths={['20%', '30%', '30%', '20%']} 
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Short Code</TableHeader>
                <TableHeader>Department Name</TableHeader>
                <TableHeader>HOD</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No departments found. Click "Add New Department" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>{department.short_code}</TableCell>
                    <TableCell>{department.name}</TableCell>
                    <TableCell>{department.hod ? `${department.hod.surname} ${department.hod.last_name}` : 'N/A'}</TableCell>
                    <TableCell>
                      <DepartmentActions
                        department={department}
                        onEdit={() => handleEdit(department)}
                        onDelete={setDepartmentToDelete}
                        onArchive={setDepartmentToDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Pagination
          currentPage={paginationProps.currentPage}
          totalPages={paginationProps.totalPages}
          onPageChange={paginationProps.handlePageChange}
        />
      </div>

      {/* Add Department Modal */}
      <DepartmentModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        initialData={null}
      />
      
      {/* Edit Department Modal */}
      {selectedDepartment && (
        <DepartmentModal
          isOpen={isEditModalOpen}
          closeModal={() => {
            setIsEditModalOpen(false);
            setSelectedDepartment(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={selectedDepartment}
        />
      )}
    </div>
  );
};

export default DepartmentList;
