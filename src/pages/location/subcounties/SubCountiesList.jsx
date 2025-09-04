import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSubCounties, createSubCounty, updateSubCounty, deleteSubCounty } from "../../../redux/subCountiesSlice";
import { fetchDistricts } from "../../../redux/districtSlice";
import { fetchCounties } from "../../../redux/countySlice";
import { useSubCountiesFilters } from "../../../hooks/subCounties/useSubCountiesFilters";
import { useSubCountiesPagination } from "../../../hooks/subCounties/useSubCountiesPagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import SubCountiesToolbar from "./SubCountiesToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import SubCountiesActions from "./SubCountiesActions";
import DeleteSubCounties from "./DeleteSubCounties";
import Pagination from "../../../components/ui/Pagination";
import SubCountiesModal from "./SubCountiesModal";

const SubCountiesList = () => {
  const dispatch = useDispatch();
  const { allSubCounties = [], loading, error } = useSelector((state) => state.subCounties || {});
  const districts = useSelector((state) => state.districts?.allDistricts || []);
  const counties = useSelector((state) => state.counties?.allCounties || []);
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCounty, setSelectedSubCounty] = useState(null);
  const [subCountyToDelete, setSubCountyToDelete] = useState(null);

  const { filteredSubCounties, filterProps } = useSubCountiesFilters(allSubCounties);
  const { paginatedSubCounties, paginationProps } = useSubCountiesPagination(filteredSubCounties);

  useEffect(() => {
    dispatch(fetchSubCounties());
    dispatch(fetchDistricts());
    dispatch(fetchCounties());
  }, [dispatch]);

  const countyOptionsForFilter = useMemo(() => {
    if (!filterProps.filterDistrictId) return counties.map(c => ({ value: c.id, label: c.name, district_id: c.district_id }));
    return counties.filter(c => String(c.district_id) === String(filterProps.filterDistrictId)).map(c => ({ value: c.id, label: c.name }));
  }, [counties, filterProps.filterDistrictId]);

  const districtOptions = districts.map(d => ({ value: d.id, label: d.name }));

  const handleEdit = (sc) => { setSelectedSubCounty(sc); setIsEditModalOpen(true); };
  const handleAdd = () => { setSelectedSubCounty(null); setIsAddModalOpen(true); };

  const handleAddSubmit = async (newSubCounty) => {
    try {
      await dispatch(createSubCounty(newSubCounty)).unwrap();
      setIsAddModalOpen(false);
      toast({ title: "Success", description: "Sub-County created successfully!" });
      dispatch(fetchSubCounties());
    } catch (err) {
      toast({ title: "Error", description: "Failed to create sub-county.", variant: "destructive" });
    }
  };

  const handleEditSubmit = async (updated) => {
    try {
      await dispatch(updateSubCounty({ id: selectedSubCounty.id, formData: updated })).unwrap();
      setIsEditModalOpen(false);
      toast({ title: "Success", description: "Sub-County updated successfully!" });
      dispatch(fetchSubCounties());
      setSelectedSubCounty(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update sub-county.", variant: "destructive" });
    }
  };

  if (error) {
    toast({ title: "Error", description: "Failed to fetch sub-counties.", variant: "destructive" });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteSubCounties subCountyToDelete={subCountyToDelete} setSubCountyToDelete={setSubCountyToDelete} />

      <FilterBox
        title="Sub-County List"
        filters={[
          { id: "filterText", label: "Sub-County Name", type: "search", placeholder: "Type for sub-county name...", value: filterProps.filterText, onChange: (e) => filterProps.setFilterText(e.target.value) },
          { id: "filterShortCode", label: "Short Code", type: "search", placeholder: "Type for short code...", value: filterProps.filterShortCode, onChange: (e) => filterProps.setFilterShortCode(e.target.value) },
          {
            id: "filterDistrict",
            label: "District",
            type: "select",
            placeholder: "Select District...",
            value: filterProps.filterDistrictId,
            onChange: (e) => { filterProps.setFilterDistrictId(e.target.value); filterProps.setFilterCountyId(""); },
            options: [{ value: "", label: "Select District..." }, ...districtOptions],
          },
          {
            id: "filterCounty",
            label: "County",
            type: "select",
            placeholder: "Select County...",
            value: filterProps.filterCountyId,
            onChange: (e) => filterProps.setFilterCountyId(e.target.value),
            options: [{ value: "", label: "Select County..." }, ...countyOptionsForFilter],
          },
        ]}
        buttons={[ { label: "Reset", variant: "secondary", onClick: filterProps.handleReset } ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <SubCountiesToolbar onAdd={handleAdd} recordsPerPage={paginationProps.recordsPerPage} onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange} totalRecords={filteredSubCounties.length} />

        {loading ? (
          <TableSkeleton rows={5} columns={4} columnWidths={['15%','45%','25%','15%']} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Short Code</TableHeader>
                <TableHeader>Sub-County Name</TableHeader>
                <TableHeader>County</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSubCounties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">No sub-counties found. Click "Add New Sub-County" to get started.</TableCell>
                </TableRow>
              ) : (
                paginatedSubCounties.map((sc) => (
                  <TableRow key={sc.id}>
                    <TableCell>{sc.short_code}</TableCell>
                    <TableCell>{sc.name}</TableCell>
                    <TableCell>{sc.county?.name || "-"}</TableCell>
                    <TableCell>
                      <SubCountiesActions subCounty={sc} onEdit={() => handleEdit(sc)} onDelete={setSubCountyToDelete} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Pagination currentPage={paginationProps.currentPage} totalPages={paginationProps.totalPages} onPageChange={paginationProps.handlePageChange} />
      </div>

      <SubCountiesModal isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} onSubmit={handleAddSubmit} initialData={null} />
      {selectedSubCounty && (
        <SubCountiesModal isOpen={isEditModalOpen} closeModal={() => { setIsEditModalOpen(false); setSelectedSubCounty(null); }} onSubmit={handleEditSubmit} initialData={selectedSubCounty} />
      )}
    </div>
  );
};

export default SubCountiesList;
