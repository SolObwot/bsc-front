import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRelations, createRelation, updateRelation } from "../../../redux/relationSlice";
import { useRelationFilters } from "../../../hooks/relation/useRelationFilters";
import { useRelationPagination } from "../../../hooks/relation/useRelationPagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import RelationToolbar from "./RelationToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import RelationActions from "./RelationActions";
import DeleteRelation from "./DeleteRelation";
import Pagination from "../../../components/ui/Pagination";
import RelationModal from "./RelationModal";

const RelationList = () => {
  const dispatch = useDispatch();
  const { allRelations = [], loading, error } = useSelector((state) => state.relations || {});
  const { toast } = useToast();

  // Modal state management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [relationToDelete, setRelationToDelete] = useState(null);

  const { filteredRelations, filterProps } = useRelationFilters(allRelations);
  const { paginatedRelations, paginationProps } = useRelationPagination(filteredRelations);

  useEffect(() => {
    dispatch(fetchRelations());
  }, [dispatch]);

  const handleEdit = (relation) => {
    setSelectedRelation(relation);
    setIsEditModalOpen(true);
  };

  const handleAddRelation = () => {
    setSelectedRelation(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (newRelation) => {
    try {
      await dispatch(createRelation(newRelation)).unwrap();
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Relation created successfully!",
      });
      dispatch(fetchRelations());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create relation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (updatedRelation) => {
    try {
      await dispatch(updateRelation({ 
        id: selectedRelation.id, 
        formData: updatedRelation 
      })).unwrap();
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Relation updated successfully!",
      });
      dispatch(fetchRelations());
      setSelectedRelation(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update relation. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch relations. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteRelation
        relationToDelete={relationToDelete}
        setRelationToDelete={setRelationToDelete}
      />

      <FilterBox
        title="Relation List"
        filters={[
          {
            id: "filterText",
            label: "Relation Name",
            type: "search",
            placeholder: "Type for relation name...",
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
        <RelationToolbar
          onAddRelation={handleAddRelation}
          recordsPerPage={paginationProps.recordsPerPage}
          onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
          totalRecords={filteredRelations.length}
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
                <TableHeader>Relation Name</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRelations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    No relations found. Click "Add New Relation" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRelations.map((relation) => (
                  <TableRow key={relation.id}>
                    <TableCell>{relation.short_code}</TableCell>
                    <TableCell>{relation.name}</TableCell>
                    <TableCell>
                      <RelationActions
                        relation={relation}
                        onEdit={() => handleEdit(relation)}
                        onDelete={setRelationToDelete}
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

      {/* Add Relation Modal */}
      <RelationModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        initialData={null}
      />
      
      {/* Edit Relation Modal */}
      {selectedRelation && (
        <RelationModal
          isOpen={isEditModalOpen}
          closeModal={() => {
            setIsEditModalOpen(false);
            setSelectedRelation(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={selectedRelation}
        />
      )}
    </div>
  );
};

export default RelationList;