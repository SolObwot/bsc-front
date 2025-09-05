import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTribes, createTribe, updateTribe } from "../../../redux/tribeSlice";
import { useTribeFilters } from "../../../hooks/Tribe/useTribeFilters";
import { useTribePagination } from "../../../hooks/Tribe/useTribePagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import TribeToolbar from "./TribeToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import TribeActions from "./TribeActions";
import DeleteTribe from "./DeleteTribe";
import Pagination from "../../../components/ui/Pagination";
import TribeModal from "./TribeModal";

const TribeList = () => {
  const dispatch = useDispatch();
  const { allTribes = [], loading, error } = useSelector((state) => state.tribes || {});
  const { toast } = useToast();

  // Modal state management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTribe, setSelectedTribe] = useState(null);
  const [tribeToDelete, setTribeToDelete] = useState(null);

  const { filteredTribes, filterProps } = useTribeFilters(allTribes);
  const { paginatedTribes, paginationProps } = useTribePagination(filteredTribes);

  useEffect(() => {
    dispatch(fetchTribes());
  }, [dispatch]);

  const handleEdit = (tribe) => {
    setSelectedTribe(tribe);
    setIsEditModalOpen(true);
  };

  const handleAddTribe = () => {
    setSelectedTribe(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (newTribe) => {
    try {
      await dispatch(createTribe(newTribe)).unwrap();
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Tribe created successfully!",
      });
      dispatch(fetchTribes());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tribe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (updatedTribe) => {
    try {
      await dispatch(updateTribe({ 
        id: selectedTribe.id, 
        formData: updatedTribe 
      })).unwrap();
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Tribe updated successfully!",
      });
      dispatch(fetchTribes());
      setSelectedTribe(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tribe. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch tribes. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteTribe
        tribeToDelete={tribeToDelete}
        setTribeToDelete={setTribeToDelete}
      />

      <FilterBox
        title="Tribe List"
        filters={[
          {
            id: 'filterText',
            label: 'Tribe Name',
            type: 'search',
            placeholder: 'Type for tribe name...',
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
        <TribeToolbar
          onAdd={handleAddTribe}
          recordsPerPage={paginationProps.recordsPerPage}
          onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
          totalRecords={filteredTribes.length}
        />

        {loading ? (
          <TableSkeleton 
            rows={5} 
            columns={3} 
            columnWidths={['30%', '40%', '30%']} 
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Short Code</TableHeader>
                <TableHeader>Tribe Name</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTribes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    No tribes found. Click "Add New Tribe" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTribes.map((tribe) => (
                  <TableRow key={tribe.id}>
                    <TableCell>{tribe.short_code}</TableCell>
                    <TableCell>{tribe.name}</TableCell>
                    <TableCell>
                      <TribeActions
                        tribe={tribe}
                        onEdit={() => handleEdit(tribe)}
                        onDelete={setTribeToDelete}
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

      {/* Add Tribe Modal */}
      <TribeModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        initialData={null}
      />
      
      {/* Edit Tribe Modal */}
      {selectedTribe && (
        <TribeModal
          isOpen={isEditModalOpen}
          closeModal={() => {
            setIsEditModalOpen(false);
            setSelectedTribe(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={selectedTribe}
        />
      )}
    </div>
  );
};

export default TribeList;
