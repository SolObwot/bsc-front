import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUniversities, createUniversity, updateUniversity } from '../../../redux/universitySlice';
import useUniversityFilters from '../../../hooks/university/useUniversityFilters';
import useUniversityPagination from '../../../hooks/university/useUniversityPagination';
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from '../../../components/ui/FilterBox';
import UniversityToolbar from './UniversityToolbar';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from '../../../components/ui/Tables';
import UniversityActions from './UniversityActions';
import DeleteUniversity from './DeleteUniversity';
import Pagination from '../../../components/ui/Pagination';
import UniversityModal from './UniversityModal';

const UniversityList = () => {
  const dispatch = useDispatch();
  const { data: allUniversities = [], loading, error } = useSelector((state) => state.universities || {});
  const { toast } = useToast();

  // Modal state management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [universityToDelete, setUniversityToDelete] = useState(null);

  const { filteredUniversities, filterProps } = useUniversityFilters(allUniversities);
  const { paginatedUniversities, paginationProps } = useUniversityPagination(filteredUniversities);

  useEffect(() => {
    dispatch(fetchUniversities());
  }, [dispatch]);

  const handleEdit = (university) => {
    setSelectedUniversity(university);
    setIsEditModalOpen(true);
  };

  const handleAddUniversity = () => {
    setSelectedUniversity(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (newUniversity) => {
    try {
      await dispatch(createUniversity(newUniversity)).unwrap();
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "University created successfully!",
      });
      dispatch(fetchUniversities());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create university. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (updatedUniversity) => {
    try {
      await dispatch(updateUniversity({ 
        id: selectedUniversity.id, 
        formData: updatedUniversity 
      })).unwrap();
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "University updated successfully!",
      });
      dispatch(fetchUniversities());
      setSelectedUniversity(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update university. Please try again.",
        variant: "destructive",
      });
    }
  };

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
                <TableHeader>University Name</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUniversities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    No universities found. Click "Add New University" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUniversities.map((university) => (
                  <TableRow key={university.id}>
                    <TableCell>{university.short_code}</TableCell>
                    <TableCell>{university.name}</TableCell>
                    <TableCell>
                      <UniversityActions
                        university={university}
                        onEdit={() => handleEdit(university)}
                        onDelete={setUniversityToDelete}
                        onArchive={setUniversityToDelete}
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

      {/* Add University Modal */}
      <UniversityModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        initialData={null}
      />
      
      {/* Edit University Modal */}
      {selectedUniversity && (
        <UniversityModal
          isOpen={isEditModalOpen}
          closeModal={() => {
            setIsEditModalOpen(false);
            setSelectedUniversity(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={selectedUniversity}
        />
      )}
    </div>
  );
};

export default UniversityList;