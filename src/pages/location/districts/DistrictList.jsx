import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDistricts, createDistrict, updateDistrict, deleteDistrict } from "../../../redux/districtSlice";
import { useDistrictFilters } from "../../../hooks/districts/useDistrictFilters";
import { useDistrictPagination } from "../../../hooks/districts/useDistrictPagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import DistrictToolbar from "./DistrictToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import DistrictActions from "./DistrictActions";
import DeleteDistrict from "./DeleteDistrict";
import Pagination from "../../../components/ui/Pagination";
import DistrictModal from "./DistrictModal";

const DistrictList = () => {
  const dispatch = useDispatch();
  const { allDistricts = [], loading, error } = useSelector((state) => state.districts || {});
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtToDelete, setDistrictToDelete] = useState(null);

  const { filteredDistricts, filterProps } = useDistrictFilters(allDistricts);
  const { paginatedDistricts, paginationProps } = useDistrictPagination(filteredDistricts);

  useEffect(() => {
    dispatch(fetchDistricts());
  }, [dispatch]);

  const handleEdit = (district) => {
    setSelectedDistrict(district);
    setIsEditModalOpen(true);
  };

  const handleAddDistrict = () => {
    setSelectedDistrict(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (newDistrict) => {
    try {
      await dispatch(createDistrict(newDistrict)).unwrap();
      setIsAddModalOpen(false);
      toast({ title: "Success", description: "District created successfully!" });
      dispatch(fetchDistricts());
    } catch (err) {
      toast({ title: "Error", description: "Failed to create district.", variant: "destructive" });
    }
  };

  const handleEditSubmit = async (updated) => {
    try {
      await dispatch(updateDistrict({ id: selectedDistrict.id, formData: updated })).unwrap();
      setIsEditModalOpen(false);
      toast({ title: "Success", description: "District updated successfully!" });
      dispatch(fetchDistricts());
      setSelectedDistrict(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update district.", variant: "destructive" });
    }
  };

  if (error) {
    toast({ title: "Error", description: "Failed to fetch districts.", variant: "destructive" });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteDistrict districtToDelete={districtToDelete} setDistrictToDelete={setDistrictToDelete} />

      <FilterBox
        title="District List"
        filters={[
          { id: "filterText", label: "District Name", type: "search", placeholder: "Type for district name...", value: filterProps.filterText, onChange: (e) => filterProps.setFilterText(e.target.value) },
          { id: "filterShortCode", label: "Short Code", type: "search", placeholder: "Type for short code...", value: filterProps.filterShortCode, onChange: (e) => filterProps.setFilterShortCode(e.target.value) },
        ]}
        buttons={[
          { label: "Reset", variant: "secondary", onClick: filterProps.handleReset },
        ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <DistrictToolbar onAddDistrict={handleAddDistrict} recordsPerPage={paginationProps.recordsPerPage} onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange} totalRecords={filteredDistricts.length} />

        {loading ? (
          <TableSkeleton rows={5} columns={3} columnWidths={['20%', '60%', '20%']} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Short Code</TableHeader>
                <TableHeader>District Name</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDistricts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    No districts found. Click "Add New District" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDistricts.map((district) => (
                  <TableRow key={district.id}>
                    <TableCell>{district.short_code}</TableCell>
                    <TableCell>{district.name}</TableCell>
                    <TableCell>
                      <DistrictActions district={district} onEdit={() => handleEdit(district)} onDelete={setDistrictToDelete} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Pagination currentPage={paginationProps.currentPage} totalPages={paginationProps.totalPages} onPageChange={paginationProps.handlePageChange} />
      </div>

      <DistrictModal isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} onSubmit={handleAddSubmit} initialData={null} />
      {selectedDistrict && (
        <DistrictModal isOpen={isEditModalOpen} closeModal={() => { setIsEditModalOpen(false); setSelectedDistrict(null); }} onSubmit={handleEditSubmit} initialData={selectedDistrict} />
      )}
    </div>
  );
};

export default DistrictList;
