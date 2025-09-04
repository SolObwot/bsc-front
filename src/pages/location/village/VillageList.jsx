import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchVillages, createVillage, updateVillage, deleteVillage } from "../../../redux/villageSlice";
import { fetchDistricts } from "../../../redux/districtSlice";
import { fetchCounties } from "../../../redux/countySlice";
import { fetchSubCounties } from "../../../redux/subCountiesSlice";
import { fetchParishes } from "../../../redux/parishSlice";
import { useVillageFilters } from "../../../hooks/village/useVillageFilters";
import { useVillagePagination } from "../../../hooks/village/useVillagePagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import VillageToolbar from "./VillageToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import VillageActions from "./VillageActions";
import DeleteVillage from "./DeleteVillage";
import Pagination from "../../../components/ui/Pagination";
import VillageModal from "./VillageModal";

const VillageList = () => {
  const dispatch = useDispatch();
  const { allVillages = [], loading, error } = useSelector((state) => state.villages || {});
  const districts = useSelector((state) => state.districts?.allDistricts || []);
  const counties = useSelector((state) => state.counties?.allCounties || []);
  const subCounties = useSelector((state) => state.subCounties?.allSubCounties || []);
  const parishes = useSelector((state) => state.parishes?.allParishes || []);
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [villageToDelete, setVillageToDelete] = useState(null);

  const { filteredVillages, filterProps } = useVillageFilters(allVillages);
  const { paginatedVillages, paginationProps } = useVillagePagination(filteredVillages);

  useEffect(() => {
    dispatch(fetchVillages());
    dispatch(fetchDistricts());
    dispatch(fetchCounties());
    dispatch(fetchSubCounties());
    dispatch(fetchParishes());
  }, [dispatch]);

  const countyOptionsForFilter = useMemo(() => {
    if (!filterProps.filterDistrictId) return counties.map(c => ({ value: c.id, label: c.name }));
    return counties.filter(c => String(c.district_id) === String(filterProps.filterDistrictId)).map(c => ({ value: c.id, label: c.name }));
  }, [counties, filterProps.filterDistrictId]);

  const subcountyOptionsForFilter = useMemo(() => {
    if (!filterProps.filterCountyId) return subCounties.map(sc => ({ value: sc.id, label: sc.name }));
    return subCounties.filter(sc => String(sc.county_id) === String(filterProps.filterCountyId)).map(sc => ({ value: sc.id, label: sc.name }));
  }, [subCounties, filterProps.filterCountyId]);

  const parishOptionsForFilter = useMemo(() => {
    if (!filterProps.filterSubCountyId) return parishes.map(p => ({ value: p.id, label: p.name }));
    return parishes.filter(p => String(p.subcounty_id) === String(filterProps.filterSubCountyId)).map(p => ({ value: p.id, label: p.name }));
  }, [parishes, filterProps.filterSubCountyId]);

  const districtOptions = districts.map(d => ({ value: d.id, label: d.name }));

  const handleEdit = (v) => { setSelectedVillage(v); setIsEditModalOpen(true); };
  const handleAdd = () => { setSelectedVillage(null); setIsAddModalOpen(true); };

  const handleAddSubmit = async (newVillage) => {
    try {
      await dispatch(createVillage(newVillage)).unwrap();
      setIsAddModalOpen(false);
      toast({ title: "Success", description: "Village created successfully!" });
      dispatch(fetchVillages());
    } catch (err) {
      toast({ title: "Error", description: "Failed to create village.", variant: "destructive" });
    }
  };

  const handleEditSubmit = async (updated) => {
    try {
      await dispatch(updateVillage({ id: selectedVillage.id, formData: updated })).unwrap();
      setIsEditModalOpen(false);
      toast({ title: "Success", description: "Village updated successfully!" });
      dispatch(fetchVillages());
      setSelectedVillage(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update village.", variant: "destructive" });
    }
  };

  if (error) {
    toast({ title: "Error", description: "Failed to fetch villages.", variant: "destructive" });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteVillage villageToDelete={villageToDelete} setVillageToDelete={setVillageToDelete} />

      <FilterBox
        title="Village List"
        filters={[
          { id: "filterText", label: "Village Name", type: "search", placeholder: "Type for village name...", value: filterProps.filterText, onChange: (e) => filterProps.setFilterText(e.target.value) },
          { id: "filterShortCode", label: "Short Code", type: "search", placeholder: "Type for short code...", value: filterProps.filterShortCode, onChange: (e) => filterProps.setFilterShortCode(e.target.value) },
          {
            id: "filterDistrict",
            label: "District",
            type: "select",
            placeholder: "Select District...",
            value: filterProps.filterDistrictId,
            onChange: (e) => { filterProps.setFilterDistrictId(e.target.value); filterProps.setFilterCountyId(""); filterProps.setFilterSubCountyId(""); filterProps.setFilterParishId(""); },
            options: [{ value: "", label: "Select District..." }, ...districtOptions],
          },
          {
            id: "filterCounty",
            label: "County",
            type: "select",
            placeholder: "Select County...",
            value: filterProps.filterCountyId,
            onChange: (e) => { filterProps.setFilterCountyId(e.target.value); filterProps.setFilterSubCountyId(""); filterProps.setFilterParishId(""); },
            options: [{ value: "", label: "Select County..." }, ...countyOptionsForFilter],
          },
          {
            id: "filterSubCounty",
            label: "Sub-County",
            type: "select",
            placeholder: "Select Sub-County...",
            value: filterProps.filterSubCountyId,
            onChange: (e) => { filterProps.setFilterSubCountyId(e.target.value); filterProps.setFilterParishId(""); },
            options: [{ value: "", label: "Select Sub-County..." }, ...subcountyOptionsForFilter],
          },
          {
            id: "filterParish",
            label: "Parish",
            type: "select",
            placeholder: "Select Parish...",
            value: filterProps.filterParishId,
            onChange: (e) => filterProps.setFilterParishId(e.target.value),
            options: [{ value: "", label: "Select Parish..." }, ...parishOptionsForFilter],
          },
        ]}
        buttons={[ { label: "Reset", variant: "secondary", onClick: filterProps.handleReset } ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <VillageToolbar onAdd={handleAdd} recordsPerPage={paginationProps.recordsPerPage} onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange} totalRecords={filteredVillages.length} />

        {loading ? (
          <TableSkeleton rows={5} columns={4} columnWidths={['15%','45%','25%','15%']} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Short Code</TableHeader>
                <TableHeader>Village Name</TableHeader>
                <TableHeader>Parish</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVillages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">No villages found. Click "Add New Village" to get started.</TableCell>
                </TableRow>
              ) : (
                paginatedVillages.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.short_code}</TableCell>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>{v.parish?.name || "-"}</TableCell>
                    <TableCell>
                      <VillageActions village={v} onEdit={() => handleEdit(v)} onDelete={setVillageToDelete} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Pagination currentPage={paginationProps.currentPage} totalPages={paginationProps.totalPages} onPageChange={paginationProps.handlePageChange} />
      </div>

      <VillageModal isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} onSubmit={handleAddSubmit} initialData={null} />
      {selectedVillage && (
        <VillageModal isOpen={isEditModalOpen} closeModal={() => { setIsEditModalOpen(false); setSelectedVillage(null); }} onSubmit={handleEditSubmit} initialData={selectedVillage} />
      )}
    </div>
  );
};

export default VillageList;