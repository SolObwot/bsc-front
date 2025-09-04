import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchParishes, createParish, updateParish, deleteParish } from "../../../redux/parishSlice";
import { fetchDistricts } from "../../../redux/districtSlice";
import { fetchCounties } from "../../../redux/countySlice";
import { fetchSubCounties } from "../../../redux/subCountiesSlice";
import { useParishFilters } from "../../../hooks/parish/useParishFilters";
import { useParishPagination } from "../../../hooks/parish/useParishPagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import ParishToolbar from "./ParishToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import ParishActions from "./ParishActions";
import DeleteParish from "./DeleteParish";
import Pagination from "../../../components/ui/Pagination";
import ParishModal from "./ParishModal";

const ParishList = () => {
  const dispatch = useDispatch();
  const { allParishes = [], loading, error } = useSelector((state) => state.parishes || {});
  const districts = useSelector((state) => state.districts?.allDistricts || []);
  const counties = useSelector((state) => state.counties?.allCounties || []);
  const subCounties = useSelector((state) => state.subCounties?.allSubCounties || []);
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParish, setSelectedParish] = useState(null);
  const [parishToDelete, setParishToDelete] = useState(null);

  const { filteredParishes, filterProps } = useParishFilters(allParishes);
  const { paginatedParishes, paginationProps } = useParishPagination(filteredParishes);

  useEffect(() => {
    dispatch(fetchParishes());
    dispatch(fetchDistricts());
    dispatch(fetchCounties());
    dispatch(fetchSubCounties());
  }, [dispatch]);

  const countyOptionsForFilter = useMemo(() => {
    if (!filterProps.filterDistrictId) return counties.map(c => ({ value: c.id, label: c.name, district_id: c.district_id }));
    return counties.filter(c => String(c.district_id) === String(filterProps.filterDistrictId)).map(c => ({ value: c.id, label: c.name }));
  }, [counties, filterProps.filterDistrictId]);

  const subcountyOptionsForFilter = useMemo(() => {
    if (!filterProps.filterCountyId) return subCounties.map(sc => ({ value: sc.id, label: sc.name, county_id: sc.county_id }));
    return subCounties.filter(sc => String(sc.county_id) === String(filterProps.filterCountyId)).map(sc => ({ value: sc.id, label: sc.name }));
  }, [subCounties, filterProps.filterCountyId]);

  const districtOptions = districts.map(d => ({ value: d.id, label: d.name }));

  const handleEdit = (p) => { setSelectedParish(p); setIsEditModalOpen(true); };
  const handleAdd = () => { setSelectedParish(null); setIsAddModalOpen(true); };

  const handleAddSubmit = async (newParish) => {
    try {
      await dispatch(createParish(newParish)).unwrap();
      setIsAddModalOpen(false);
      toast({ title: "Success", description: "Parish created successfully!" });
      dispatch(fetchParishes());
    } catch (err) {
      toast({ title: "Error", description: "Failed to create parish.", variant: "destructive" });
    }
  };

  const handleEditSubmit = async (updated) => {
    try {
      await dispatch(updateParish({ id: selectedParish.id, formData: updated })).unwrap();
      setIsEditModalOpen(false);
      toast({ title: "Success", description: "Parish updated successfully!" });
      dispatch(fetchParishes());
      setSelectedParish(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update parish.", variant: "destructive" });
    }
  };

  if (error) {
    toast({ title: "Error", description: "Failed to fetch parishes.", variant: "destructive" });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteParish parishToDelete={parishToDelete} setParishToDelete={setParishToDelete} />

      <FilterBox
        title="Parish List"
        filters={[
          { id: "filterText", label: "Parish Name", type: "search", placeholder: "Type for parish name...", value: filterProps.filterText, onChange: (e) => filterProps.setFilterText(e.target.value) },
          { id: "filterShortCode", label: "Short Code", type: "search", placeholder: "Type for short code...", value: filterProps.filterShortCode, onChange: (e) => filterProps.setFilterShortCode(e.target.value) },
          {
            id: "filterDistrict",
            label: "District",
            type: "select",
            placeholder: "Select District...",
            value: filterProps.filterDistrictId,
            onChange: (e) => { filterProps.setFilterDistrictId(e.target.value); filterProps.setFilterCountyId(""); filterProps.setFilterSubCountyId(""); },
            options: [{ value: "", label: "Select District..." }, ...districtOptions],
          },
          {
            id: "filterCounty",
            label: "County",
            type: "select",
            placeholder: "Select County...",
            value: filterProps.filterCountyId,
            onChange: (e) => { filterProps.setFilterCountyId(e.target.value); filterProps.setFilterSubCountyId(""); },
            options: [{ value: "", label: "Select County..." }, ...countyOptionsForFilter],
          },
          {
            id: "filterSubCounty",
            label: "Sub-County",
            type: "select",
            placeholder: "Select Sub-County...",
            value: filterProps.filterSubCountyId,
            onChange: (e) => filterProps.setFilterSubCountyId(e.target.value),
            options: [{ value: "", label: "Select Sub-County..." }, ...subcountyOptionsForFilter],
          },
        ]}
        buttons={[ { label: "Reset", variant: "secondary", onClick: filterProps.handleReset } ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <ParishToolbar onAdd={handleAdd} recordsPerPage={paginationProps.recordsPerPage} onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange} totalRecords={filteredParishes.length} />

        {loading ? (
          <TableSkeleton rows={5} columns={4} columnWidths={['15%','45%','25%','15%']} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Short Code</TableHeader>
                <TableHeader>Parish Name</TableHeader>
                <TableHeader>Sub-County</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedParishes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">No parishes found. Click "Add New Parish" to get started.</TableCell>
                </TableRow>
              ) : (
                paginatedParishes.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.short_code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.subcounty?.name || "-"}</TableCell>
                    <TableCell>
                      <ParishActions parish={p} onEdit={() => handleEdit(p)} onDelete={setParishToDelete} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Pagination currentPage={paginationProps.currentPage} totalPages={paginationProps.totalPages} onPageChange={paginationProps.handlePageChange} />
      </div>

      <ParishModal isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} onSubmit={handleAddSubmit} initialData={null} />
      {selectedParish && (
        <ParishModal isOpen={isEditModalOpen} closeModal={() => { setIsEditModalOpen(false); setSelectedParish(null); }} onSubmit={handleEditSubmit} initialData={selectedParish} />
      )}
    </div>
  );
};

export default ParishList;
