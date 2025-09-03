import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCounties, createCounty, updateCounty, deleteCounty } from "../../../redux/countySlice";
import { fetchDistricts } from "../../../redux/districtSlice";
import { useCountyFilters } from "../../../hooks/counties/useCountyFilters";
import { useCountyPagination } from "../../../hooks/counties/useCountyPagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import CountyToolbar from "./CountyToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import CountyActions from "./CountyActions";
import DeleteCounty from "./DeleteCounty";
import Pagination from "../../../components/ui/Pagination";
import CountyModal from "./CountyModal";

const CountyList = () => {
  const dispatch = useDispatch();
  const { allCounties = [], loading, error } = useSelector((state) => state.counties || {});
  const districts = useSelector((state) => state.districts?.allDistricts || []);
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [countyToDelete, setCountyToDelete] = useState(null);

  const { filteredCounties, filterProps } = useCountyFilters(allCounties);
  const { paginatedCounties, paginationProps } = useCountyPagination(filteredCounties);

  useEffect(() => {
    dispatch(fetchCounties());
    dispatch(fetchDistricts());
  }, [dispatch]);

  const handleEdit = (county) => { setSelectedCounty(county); setIsEditModalOpen(true); };
  const handleAddCounty = () => { setSelectedCounty(null); setIsAddModalOpen(true); };

  const handleAddSubmit = async (newCounty) => {
    try {
      await dispatch(createCounty(newCounty)).unwrap();
      setIsAddModalOpen(false);
      toast({ title: "Success", description: "County created successfully!" });
      dispatch(fetchCounties());
    } catch (err) {
      toast({ title: "Error", description: "Failed to create county.", variant: "destructive" });
    }
  };

  const handleEditSubmit = async (updated) => {
    try {
      await dispatch(updateCounty({ id: selectedCounty.id, formData: updated })).unwrap();
      setIsEditModalOpen(false);
      toast({ title: "Success", description: "County updated successfully!" });
      dispatch(fetchCounties());
      setSelectedCounty(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update county.", variant: "destructive" });
    }
  };

  if (error) {
    toast({ title: "Error", description: "Failed to fetch counties.", variant: "destructive" });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteCounty countyToDelete={countyToDelete} setCountyToDelete={setCountyToDelete} />

      <FilterBox
        title="County List"
        filters={[
          { id: "filterText", label: "County Name", type: "search", placeholder: "Type for county name...", value: filterProps.filterText, onChange: (e) => filterProps.setFilterText(e.target.value) },
          { id: "filterShortCode", label: "Short Code", type: "search", placeholder: "Type for short code...", value: filterProps.filterShortCode, onChange: (e) => filterProps.setFilterShortCode(e.target.value) },
          {
            id: "filterDistrict",
            label: "District",
            type: "select",
            placeholder: "Select district...",
            value: filterProps.filterDistrict,
            onChange: (e) => filterProps.setFilterDistrict(e.target.value),
            options: [
              { value: "", label: "Select District..." }, 
              ...districts.map(d => ({ value: d.name, label: d.name }))
            ],
          },
        ]}
        buttons={[ { label: "Reset", variant: "secondary", onClick: filterProps.handleReset } ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <CountyToolbar onAddCounty={handleAddCounty} recordsPerPage={paginationProps.recordsPerPage} onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange} totalRecords={filteredCounties.length} />

        {loading ? (
          <TableSkeleton rows={5} columns={4} columnWidths={['15%', '45%', '25%', '15%']} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Short Code</TableHeader>
                <TableHeader>County Name</TableHeader>
                <TableHeader>District</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCounties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No counties found. Click "Add New County" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCounties.map((county) => (
                  <TableRow key={county.id}>
                    <TableCell>{county.short_code}</TableCell>
                    <TableCell>{county.name}</TableCell>
                    <TableCell>{county.district?.name || "-"}</TableCell>
                    <TableCell>
                      <CountyActions county={county} onEdit={() => handleEdit(county)} onDelete={setCountyToDelete} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Pagination currentPage={paginationProps.currentPage} totalPages={paginationProps.totalPages} onPageChange={paginationProps.handlePageChange} />
      </div>

      <CountyModal isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} onSubmit={handleAddSubmit} initialData={null} />
      {selectedCounty && (
        <CountyModal isOpen={isEditModalOpen} closeModal={() => { setIsEditModalOpen(false); setSelectedCounty(null); }} onSubmit={handleEditSubmit} initialData={selectedCounty} />
      )}
    </div>
  );
};

export default CountyList;
