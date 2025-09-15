import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGradeOrScales, createGradeOrScale, updateGradeOrScale, deleteGradeOrScale } from "../../../redux/gradeOrScaleSlice";
import { useGradeOrScaleFilters } from "../../../hooks/gradeOrScale/usegradeOrScaleFilters";
import { useGradeOrScalePagination } from "../../../hooks/gradeOrScale/usegradeOrScalePagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import JobOrScaleToolbar from "./JobOrScaleToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import JobOrScaleActions from "./JobOrScaleActions";
import Pagination from "../../../components/ui/Pagination";
import JobOrScaleModal from "./JobOrScaleModal";
import DeleteJobOrScale from "./DeleteJobOrScale";

const JobOrScaleList = () => {
  const dispatch = useDispatch();
  const { allGradeOrScales = [], loading, error } = useSelector((state) => state.gradeOrScale || {});
  const { toast } = useToast();

  // Modal state management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGradeOrScale, setSelectedGradeOrScale] = useState(null);
  const [gradeOrScaleToDelete, setGradeOrScaleToDelete] = useState(null);

  const { filteredGradeOrScales, filterProps } = useGradeOrScaleFilters(allGradeOrScales);
  const { paginatedGradeOrScales, paginationProps } = useGradeOrScalePagination(filteredGradeOrScales);

  useEffect(() => {
    dispatch(fetchGradeOrScales());
  }, []); // Only run once on mount

  // Show error toast only when error changes
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch grades/scales. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleEdit = (gradeOrScale) => {
    setSelectedGradeOrScale(gradeOrScale);
    setIsEditModalOpen(true);
  };

  const handleAddGradeOrScale = () => {
    setSelectedGradeOrScale(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (newGradeOrScale) => {
    try {
      const result = await dispatch(createGradeOrScale(newGradeOrScale)).unwrap();
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Grade/Scale created successfully!",
      });
      await dispatch(fetchGradeOrScales());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create grade/scale. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (updatedGradeOrScale) => {
    try {
      const result = await dispatch(updateGradeOrScale({
        id: selectedGradeOrScale.id,
        formData: updatedGradeOrScale
      })).unwrap();
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Grade/Scale updated successfully!",
      });
      setSelectedGradeOrScale(null);
      await dispatch(fetchGradeOrScales());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update grade/scale. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteJobOrScale
        gradeOrScaleToDelete={gradeOrScaleToDelete}
        setGradeOrScaleToDelete={setGradeOrScaleToDelete}
      />
      <FilterBox
        title="Grade/Scale List"
        filters={[
          {
            id: "filterText",
            label: "Name",
            type: "search",
            placeholder: "Type for grade/scale name...",
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
        <JobOrScaleToolbar
          onAddGradeOrScale={handleAddGradeOrScale}
          recordsPerPage={paginationProps.recordsPerPage}
          onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
          totalRecords={filteredGradeOrScales.length}
        />

        {loading ? (
          <TableSkeleton
            rows={5}
            columns={5}
            columnWidths={['10%', '20%', '20%', '20%', '30%']}
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Short Code</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Notch</TableHeader>
                <TableHeader>Basic Pay</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedGradeOrScales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No grades/scales found. Click "Add New Grade/Scale" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedGradeOrScales.map((gradeOrScale) => (
                  <TableRow key={gradeOrScale.id}>
                    <TableCell>{gradeOrScale.short_code}</TableCell>
                    <TableCell>{gradeOrScale.name}</TableCell>
                    <TableCell>{gradeOrScale.notch}</TableCell>
                    <TableCell>{gradeOrScale.basic_pay}</TableCell>
                    <TableCell>
                      <JobOrScaleActions
                        gradeOrScale={gradeOrScale}
                        onEdit={handleEdit}
                        onDelete={setGradeOrScaleToDelete}
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

      {/* Add Modal */}
      <JobOrScaleModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        initialData={null}
        isEditing={false}
      />

      {/* Edit Modal */}
      {selectedGradeOrScale && (
        <JobOrScaleModal
          isOpen={isEditModalOpen}
          closeModal={() => {
            setIsEditModalOpen(false);
            setSelectedGradeOrScale(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={selectedGradeOrScale}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default JobOrScaleList;