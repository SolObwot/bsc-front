import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRegions, createRegion, updateRegion, deleteRegion } from "../../../redux/regionSlice";
import { useRegionFilters } from "../../../hooks/Region/useRegionFilters";
import { useRegionPagination } from "../../../hooks/Region/useRegionPagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import RegionToolbar from "./RegionToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import RegionActions from "./RegionActions";
import DeleteRegion from "./DeleteRegion";
import Pagination from "../../../components/ui/Pagination";
import RegionModal from "./RegionModal";

const RegionList = () => {
  const dispatch = useDispatch();
  const { allRegions = [], loading, error } = useSelector((state) => state.regions || {});
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionToDelete, setRegionToDelete] = useState(null);

  const { filteredRegions, filterProps } = useRegionFilters(allRegions);
  const { paginatedRegions, paginationProps } = useRegionPagination(filteredRegions);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const managerOptions = useMemo(() => {
    // derive unique manager list from regions
    const opts = [];
    (allRegions || []).forEach(r => {
      if (r.regional_manager) opts.push({ value: r.regional_manager.id, label: `${r.regional_manager.username} ${r.regional_manager.surname}` });
    });
    // unique by value
    const map = new Map();
    opts.forEach(o => map.set(o.value, o));
    return Array.from(map.values());
  }, [allRegions]);

  const handleEdit = (r) => { setSelectedRegion(r); setIsEditModalOpen(true); };
  const handleAdd = () => { setSelectedRegion(null); setIsAddModalOpen(true); };

  const handleAddSubmit = async (newRegion) => {
    try {
      await dispatch(createRegion(newRegion)).unwrap();
      setIsAddModalOpen(false);
      toast({ title: "Success", description: "Region created successfully!" });
      dispatch(fetchRegions());
    } catch (err) {
      toast({ title: "Error", description: "Failed to create region.", variant: "destructive" });
    }
  };

  const handleEditSubmit = async (updated) => {
    try {
      await dispatch(updateRegion({ id: selectedRegion.id, formData: updated })).unwrap();
      setIsEditModalOpen(false);
      toast({ title: "Success", description: "Region updated successfully!" });
      dispatch(fetchRegions());
      setSelectedRegion(null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to update region.", variant: "destructive" });
    }
  };

  if (error) {
    toast({ title: "Error", description: "Failed to fetch regions.", variant: "destructive" });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteRegion regionToDelete={regionToDelete} setRegionToDelete={setRegionToDelete} />

      <FilterBox
        title="Region List"
        filters={[
          { id: "filterText", label: "Region Name", type: "search", placeholder: "Type for region name...", value: filterProps.filterText, onChange: (e) => filterProps.setFilterText(e.target.value) },
          { id: "filterShortCode", label: "Short Code", type: "search", placeholder: "Type for short code...", value: filterProps.filterShortCode, onChange: (e) => filterProps.setFilterShortCode(e.target.value) },
          {
            id: "filterManager",
            label: "Regional Manager",
            type: "select",
            placeholder: "Select Manager...",
            value: filterProps.filterManagerId,
            onChange: (e) => filterProps.setFilterManagerId(e.target.value),
            options: [{ value: "", label: "Select Manager..." }, ...managerOptions],
          },
        ]}
        buttons={[ { label: "Reset", variant: "secondary", onClick: filterProps.handleReset } ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <RegionToolbar onAdd={handleAdd} recordsPerPage={paginationProps.recordsPerPage} onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange} totalRecords={filteredRegions.length} />

        {loading ? (
          <TableSkeleton rows={5} columns={4} columnWidths={['15%','45%','25%','15%']} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Short Code</TableHeader>
                <TableHeader>Region Name</TableHeader>
                <TableHeader>Regional Manager</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRegions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">No regions found. Click "Add New Region" to get started.</TableCell>
                </TableRow>
              ) : (
                paginatedRegions.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.short_code}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.regional_manager ? `${r.regional_manager.username} ${r.regional_manager.surname}` : "-"}</TableCell>
                    <TableCell>
                      <RegionActions region={r} onEdit={() => handleEdit(r)} onDelete={setRegionToDelete} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Pagination currentPage={paginationProps.currentPage} totalPages={paginationProps.totalPages} onPageChange={paginationProps.handlePageChange} />
      </div>

      <RegionModal isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)} onSubmit={handleAddSubmit} initialData={null} />
      {selectedRegion && (
        <RegionModal isOpen={isEditModalOpen} closeModal={() => { setIsEditModalOpen(false); setSelectedRegion(null); }} onSubmit={handleEditSubmit} initialData={selectedRegion} />
      )}
    </div>
  );
};

export default RegionList;
