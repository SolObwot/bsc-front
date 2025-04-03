import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUniversities } from '../../../redux/universitySlice';
import useUniversityFilters from '../../../hooks/university/useUniversityFilters';
import useUniversityPagination from '../../../hooks/university/useUniversityPagination';
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from '../../../components/ui/FilterBox';
import UniversityToolbar from './UniversityToolbar';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import UniversityActions from './UniversityActions';
import DeleteUniversity from './DeleteUniversity';
import Pagination from '../../../components/ui/Pagination';

const UniversityList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: allUniversities = [], loading, error } = useSelector((state) => state.universities || {});
  const { toast } = useToast();

  const [universityToDelete, setUniversityToDelete] = useState(null);
  const { filteredUniversities, filterProps } = useUniversityFilters(allUniversities);
  const { paginatedUniversities, paginationProps } = useUniversityPagination(filteredUniversities);

  useEffect(() => {
    dispatch(fetchUniversities());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/admin/qualification/university/edit/${id}`);
  };

  const handleAddUniversity = () => {
    navigate('/admin/qualification/university/add');
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
      description: "Failed to fetch universities. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteUniversity
        universityToDelete={universityToDelete}
        setUniversityToDelete={setUniversityToDelete}
      />

      <FilterBox
        title="University List"
        filters={[
          {
            id: 'filterText',
            label: 'University Name',
            type: 'search',
            placeholder: 'Type for university name...',
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
        <UniversityToolbar
          onAddUniversity={handleAddUniversity}
          recordsPerPage={paginationProps.recordsPerPage}
          onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
          totalRecords={filteredUniversities.length}
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Short Code</TableHeader>
              <TableHeader>University Name</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUniversities.map((university) => (
              <TableRow key={university.id}>
                <TableCell>{university.short_code}</TableCell>
                <TableCell>{university.name}</TableCell>
                <TableCell>
                  <UniversityActions
                    university={university}
                    onEdit={handleEdit}
                    onDelete={setUniversityToDelete}
                    onArchive={setUniversityToDelete}
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

export default UniversityList;