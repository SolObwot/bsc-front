import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobTitles, createJobTitle, updateJobTitle } from "../../../redux/jobTitleSlice";
import { useJobTitleFilters } from "../../../hooks/jobtitle/useJobTitleFilters";
import { useJobTitlePagination } from "../../../hooks/jobtitle/useJobTitlePagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import JobTitleToolbar from "./JobTitleToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import JobTitleActions from "./JobTitleActions";
import DeleteJobTitle from "./DeleteJobTitle";
import Pagination from "../../../components/ui/Pagination";
import JobTitleModal from "./JobTitleModal";

const JobTitleList = () => {
  const dispatch = useDispatch();
  const { allJobTitles = [], loading, error } = useSelector((state) => state.jobTitles || {});
  const { toast } = useToast();

  // Modal state management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [jobTitleToDelete, setJobTitleToDelete] = useState(null);

  const { filteredJobTitles, filterProps } = useJobTitleFilters(allJobTitles);
  const { paginatedJobTitles, paginationProps } = useJobTitlePagination(filteredJobTitles);

  useEffect(() => {
    dispatch(fetchJobTitles());
  }, [dispatch]);

  const handleEdit = (jobTitle) => {
    setSelectedJobTitle(jobTitle);
    setIsEditModalOpen(true);
  };

  const handleAddJobTitle = () => {
    setSelectedJobTitle(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (newJobTitle) => {
    try {
      await dispatch(createJobTitle(newJobTitle)).unwrap();
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Job Title created successfully!",
      });
      dispatch(fetchJobTitles());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job title. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (updatedJobTitle) => {
    try {
      await dispatch(updateJobTitle({ 
        id: selectedJobTitle.id, 
        formData: updatedJobTitle 
      })).unwrap();
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Job Title updated successfully!",
      });
      dispatch(fetchJobTitles());
      setSelectedJobTitle(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job title. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch job titles. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteJobTitle
        jobTitleToDelete={jobTitleToDelete}
        setJobTitleToDelete={setJobTitleToDelete}
      />

      <FilterBox
        title="Job Title List"
        filters={[
          {
            id: "filterText",
            label: "Job Title Name",
            type: "search",
            placeholder: "Type for job title name...",
            value: filterProps.filterText,
            onChange: (e) => filterProps.setFilterText(e.target.value),
          },
          {
            id: "filterShortCode",
            label: "Short Code",
            type: "search",
            placeholder: "Type for short code...",
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
            label: "Reset",
            variant: "secondary",
            onClick: filterProps.handleReset,
          },
        ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <JobTitleToolbar
          onAddJobTitle={handleAddJobTitle}
          recordsPerPage={paginationProps.recordsPerPage}
          onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
          totalRecords={filteredJobTitles.length}
        />

        {loading ? (
          <TableSkeleton 
            rows={5} 
            columns={3} 
            columnWidths={['20%', '60%', '20%']} 
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Short Code</TableHeader>
                <TableHeader>Job Title Name</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedJobTitles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    No job titles found. Click "Add New Job Title" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedJobTitles.map((jobTitle) => (
                  <TableRow key={jobTitle.id}>
                    <TableCell>{jobTitle.short_code}</TableCell>
                    <TableCell>{jobTitle.name}</TableCell>
                    <TableCell>
                      <JobTitleActions
                        jobTitle={jobTitle}
                        onEdit={() => handleEdit(jobTitle)}
                        onDelete={setJobTitleToDelete}
                        onArchive={setJobTitleToDelete}
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

      {/* Add Job Title Modal */}
      <JobTitleModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        initialData={null}
      />
      
      {/* Edit Job Title Modal */}
      {selectedJobTitle && (
        <JobTitleModal
          isOpen={isEditModalOpen}
          closeModal={() => {
            setIsEditModalOpen(false);
            setSelectedJobTitle(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={selectedJobTitle}
        />
      )}
    </div>
  );
};

export default JobTitleList;