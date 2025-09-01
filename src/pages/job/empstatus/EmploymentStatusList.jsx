import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEmploymentStatuses,
  createEmploymentStatus,
  updateEmploymentStatus,
  deleteEmploymentStatus,
} from "../../../redux/employmentStatusSlice";
import { useEmploymentStatusFilters } from "../../../hooks/employmentStatus/useEmploymentStatusFilters";
import { useEmploymentStatusPagination } from "../../../hooks/employmentStatus/useEmploymentStatusPagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import EmploymentStatusActions from "./EmploymentStatusActions";
import DeleteEmploymentStatus from "./DeleteEmployementStatus";
import Pagination from "../../../components/ui/Pagination";
import EmploymentStatusModal from "./EmploymentStatusModal";
import Button from "../../../components/ui/Button";
import EmploymentStatusToolbar from "./EmploymentStatusToolbar";

const EmploymentStatusList = () => {
  const dispatch = useDispatch();
  const { allEmploymentStatuses = [], loading, error } = useSelector((state) => state.employmentStatuses || {});
  const { toast } = useToast();

  // Ensure allEmploymentStatuses is always an array
  const employmentStatusesArray = Array.isArray(allEmploymentStatuses) ? allEmploymentStatuses : [];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmploymentStatus, setSelectedEmploymentStatus] = useState(null);
  const [employmentStatusToDelete, setEmploymentStatusToDelete] = useState(null);

  const { filteredEmploymentStatuses, filterProps } = useEmploymentStatusFilters(allEmploymentStatuses);
  const { paginatedEmploymentStatuses, paginationProps } = useEmploymentStatusPagination(filteredEmploymentStatuses);

  useEffect(() => {
    dispatch(fetchEmploymentStatuses());
  }, [dispatch]);

  const handleEdit = (employmentStatus) => {
    setSelectedEmploymentStatus(employmentStatus);
    setIsEditModalOpen(true);
  };

  const handleAddEmploymentStatus = () => {
    setSelectedEmploymentStatus(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (newEmploymentStatus) => {
    try {
      await dispatch(createEmploymentStatus(newEmploymentStatus)).unwrap();
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Employment Status created successfully!",
      });
      dispatch(fetchEmploymentStatuses());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create employment status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (updatedEmploymentStatus) => {
    try {
      await dispatch(updateEmploymentStatus({
        id: selectedEmploymentStatus.id,
        formData: updatedEmploymentStatus,
      })).unwrap();
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Employment Status updated successfully!",
      });
      dispatch(fetchEmploymentStatuses());
      setSelectedEmploymentStatus(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employment status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await dispatch(deleteEmploymentStatus(id)).unwrap();
      setEmploymentStatusToDelete(null);
      toast({
        title: "Success",
        description: "Employment Status deleted successfully!",
      });
      dispatch(fetchEmploymentStatuses());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employment status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch employment statuses. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteEmploymentStatus
        employmentStatusToDelete={employmentStatusToDelete}
        setEmploymentStatusToDelete={setEmploymentStatusToDelete}
        onDeleteConfirm={handleDeleteConfirm}
      />

      <FilterBox
        title="Employment Status List"
        filters={[
          {
            id: "filterText",
            label: "Status Name",
            type: "search",
            placeholder: "Type for status name...",
            value: filterProps.filterText,
            onChange: (e) => filterProps.setFilterText(e.target.value),
          },
          {
            id: "filterStatus",
            label: "Status",
            type: "select",
            value: filterProps.filterStatus,
            onChange: (e) => filterProps.setFilterStatus(e.target.value),
            options: [
              { value: '', label: '-- Select --' },
              ...employmentStatusesArray.map((status) => ({
                value: status.name,
                label: status.name,
              })),
            ],
          },
        ]}
        buttons={[
          {
            label: "Reset",
            variant: "secondary",
            onClick: filterProps.handleReset,
          },
        ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <EmploymentStatusToolbar
          onAddEmploymentStatus={handleAddEmploymentStatus}
          recordsPerPage={paginationProps.recordsPerPage}
          onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
          totalRecords={filteredEmploymentStatuses.length}
        />

        {loading ? (
          <TableSkeleton
            rows={5}
            columns={2}
            columnWidths={['80%', '20%']}
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Status Name</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmploymentStatuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                    No employment statuses found. Click "Add New Employment Status" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmploymentStatuses.map((employmentStatus) => (
                  <TableRow key={employmentStatus.id}>
                    <TableCell>{employmentStatus.name}</TableCell>
                    <TableCell>
                      <EmploymentStatusActions
                        employmentStatus={employmentStatus}
                        onEdit={handleEdit}
                        onDelete={setEmploymentStatusToDelete}
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

      <EmploymentStatusModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        initialData={null}
        isEditing={false}
      />

      {selectedEmploymentStatus && (
        <EmploymentStatusModal
          isOpen={isEditModalOpen}
          closeModal={() => {
            setIsEditModalOpen(false);
            setSelectedEmploymentStatus(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={selectedEmploymentStatus}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EmploymentStatusList;