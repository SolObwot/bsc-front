import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobTitles } from "../../../redux/jobTitleSlice";
import { useJobTitleFilters } from "../../../hooks/jobtitle/useJobTitleFilters";
import { useJobTitlePagination } from "../../../hooks/jobtitle/useJobTitlePagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import JobTitleToolbar from "./JobTitleToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../../../components/ui/Tables";
import JobTitleActions from "./JobTitleActions";
import DeleteJobTitle from "./DeleteJobTitle";
import Pagination from "../../../components/ui/Pagination";

const JobTitleList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allJobTitles = [], loading, error } = useSelector((state) => state.jobTitles || {});
  const { toast } = useToast();

  const [jobTitleToDelete, setJobTitleToDelete] = useState(null);
  const { filteredJobTitles, filterProps } = useJobTitleFilters(allJobTitles);
  const { paginatedJobTitles, paginationProps } = useJobTitlePagination(filteredJobTitles);

  useEffect(() => {
    dispatch(fetchJobTitles());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/admin/job/jobtitle/edit/${id}`);
  };

  const handleAddJobTitle = () => {
    navigate("/admin/job/jobtitle/add");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

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

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Short Code</TableHeader>
              <TableHeader>Job Title Name</TableHeader>
              {/* <TableHeader>Description</TableHeader> */}
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedJobTitles.map((jobTitle) => (
              <TableRow key={jobTitle.id}>
                <TableCell>{jobTitle.short_code}</TableCell>
                <TableCell>{jobTitle.name}</TableCell>
                {/* <TableCell>{jobTitle.description}</TableCell> */}
                <TableCell>
                  <JobTitleActions
                    jobTitle={jobTitle}
                    onEdit={handleEdit}
                    onDelete={setJobTitleToDelete}
                    onArchive={setJobTitleToDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination
          currentPage={paginationProps.currentPage}
          totalPages={paginationProps.totalPages}
          onPageChange={paginationProps.handlePageChange}
        />
      </div>
    </div>
  );
};

export default JobTitleList;