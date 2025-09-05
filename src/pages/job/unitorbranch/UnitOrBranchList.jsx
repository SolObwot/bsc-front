import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUnitOrBranches, createUnitOrBranch, updateUnitOrBranch, deleteUnitOrBranch } from "../../../redux/unitOrBranchSlice";
import { fetchDepartments } from "../../../redux/departmentSlice";
import { fetchUniversities } from "../../../redux/universitySlice";
import { fetchRegions } from "../../../redux/regionSlice"; // Added for regions
import { useUnitOrBranchFilters } from "../../../hooks/unitOrBranch/useUnitOrBranchFilters";
import { useUnitOrBranchPagination } from "../../../hooks/unitOrBranch/useUnitOrBranchPagination";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from "../../../components/ui/FilterBox";
import UnitOrBranchToolbar from "./UnitOrBranchToolbar";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableSkeleton } from "../../../components/ui/Tables";
import UnitOrBranchActions from "./UnitOrBranchActions";
import Pagination from "../../../components/ui/Pagination";
import UnitOrBranchModal from "./UnitOrBranchModal";

const UnitOrBranchList = () => {
    const dispatch = useDispatch();
    const { allUnitOrBranches = [], loading, error } = useSelector((state) => state.unitOrBranches || {});
    const { allDepartments = [] } = useSelector((state) => state.departments || {});
    const { data: users = [] } = useSelector((state) => state.universities || {}); 
    const { allRegions = [] } = useSelector((state) => state.regions || {}); // Added regions selector

    const { toast } = useToast();

    // Modal state management
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUnitOrBranch, setSelectedUnitOrBranch] = useState(null);

    const { filteredUnitOrBranches, filterProps } = useUnitOrBranchFilters(allUnitOrBranches);
    const { paginatedUnitOrBranches, paginationProps } = useUnitOrBranchPagination(filteredUnitOrBranches);

    useEffect(() => {
        dispatch(fetchUnitOrBranches());
        dispatch(fetchDepartments());
        dispatch(fetchUniversities()); // Replace with user fetch
        dispatch(fetchRegions()); // Added to fetch regions
    }, [dispatch]);

    const handleEdit = async (id) => {
        const found = allUnitOrBranches.find(u => u.id === id);
        setSelectedUnitOrBranch(found);
        setIsEditModalOpen(true);
    };

    const handleAddUnitOrBranch = () => {
        setSelectedUnitOrBranch(null);
        setIsAddModalOpen(true);
    };

    const handleAddSubmit = async (newUnitOrBranch) => {
        try {
            await dispatch(createUnitOrBranch(newUnitOrBranch)).unwrap();
            setIsAddModalOpen(false);
            toast({
                title: "Success",
                description: "Unit/Branch created successfully!",
            });
            dispatch(fetchUnitOrBranches());
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create Unit/Branch. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleEditSubmit = async (updatedUnitOrBranch) => {
        try {
            await dispatch(updateUnitOrBranch({ 
                id: selectedUnitOrBranch.id, 
                formData: updatedUnitOrBranch 
            })).unwrap();
            setIsEditModalOpen(false);
            toast({
                title: "Success",
                description: "Unit/Branch updated successfully!",
            });
            dispatch(fetchUnitOrBranches());
            setSelectedUnitOrBranch(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update Unit/Branch. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (unitOrBranch) => {
        if (window.confirm(`Are you sure you want to delete "${unitOrBranch.name}"?`)) {
            try {
                await dispatch(deleteUnitOrBranch(unitOrBranch.id)).unwrap();
                toast({
                    title: "Deleted",
                    description: "Unit/Branch deleted successfully.",
                });
                dispatch(fetchUnitOrBranches());
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete Unit/Branch.",
                    variant: "destructive",
                });
            }
        }
    };

    if (error) {
        toast({
            title: "Error",
            description: "Failed to fetch Unit/Branches. Please try again later.",
            variant: "destructive",
        });
    }

    return (
        <div className="w-full p-4 mt-8">
            <ToastContainer />
            <FilterBox
                title="Unit/Branch List"
                filters={[
                    {
                        id: 'filterShortCode',
                        label: 'Short Code',
                        type: 'search',
                        placeholder: 'Type for short code...',
                        value: filterProps.filterShortCode,
                        onChange: (e) => filterProps.setFilterShortCode(e.target.value),
                    },
                    {
                        id: 'filterName',
                        label: 'Name',
                        type: 'search',
                        placeholder: 'Type for name...',
                        value: filterProps.filterName,
                        onChange: (e) => filterProps.setFilterName(e.target.value),
                    },
                    {
                        id: 'filterType',
                        label: 'Type',
                        type: 'select',
                        value: filterProps.filterType,
                        onChange: (e) => filterProps.setFilterType(e.target.value),
                        options: [
                            { value: '', label: '-- Select --' },
                            { value: 'unit', label: 'Unit' },
                            { value: 'branch', label: 'Branch' },
                        ],
                    },
                    {
                        id: 'filterRegion',
                        label: 'Region',
                        type: 'select',
                        value: filterProps.filterRegion,
                        onChange: (e) => filterProps.setFilterRegion(e.target.value),
                        options: [
                            { value: '', label: '-- Select --' },
                            ...allRegions.map(region => ({ value: region.id, label: region.name })),
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
                <UnitOrBranchToolbar
                    onAddUnitOrBranch={handleAddUnitOrBranch}
                    recordsPerPage={paginationProps.recordsPerPage}
                    onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
                    totalRecords={filteredUnitOrBranches.length}
                />

                {loading ? (
                    <TableSkeleton 
                        rows={5} 
                        columns={10} 
                        columnWidths={['8%', '14%', '8%', '12%', '12%', '12%', '12%', '12%', '10%', '10%']} 
                    />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Short Code</TableHeader>
                                <TableHeader>Name</TableHeader>
                                <TableHeader>Type</TableHeader>
                                {paginatedUnitOrBranches.some(u => u.type === 'unit') && <TableHeader>Department</TableHeader>}
                                {paginatedUnitOrBranches.some(u => u.type === 'unit') && <TableHeader>Manager</TableHeader>}
                                {paginatedUnitOrBranches.some(u => u.type === 'branch') && <TableHeader>Region</TableHeader>}
                                {paginatedUnitOrBranches.some(u => u.type === 'branch') && <TableHeader>Regional Manager</TableHeader>}
                                {paginatedUnitOrBranches.some(u => u.type === 'branch') && <TableHeader>Branch Manager</TableHeader>}
                                {paginatedUnitOrBranches.some(u => u.type === 'branch') && <TableHeader>Relationship Manager</TableHeader>}
                                {paginatedUnitOrBranches.some(u => u.type === 'branch') && <TableHeader>Branch Operations Manager</TableHeader>}
                                {paginatedUnitOrBranches.some(u => u.type === 'branch') && <TableHeader>Manager Distribution</TableHeader>}
                                <TableHeader>Created</TableHeader>
                                <TableHeader>Actions</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUnitOrBranches.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                                        No Unit/Branches found. Click "Add New Unit/Branch" to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedUnitOrBranches.map((unitOrBranch) => (
                                    <TableRow key={unitOrBranch.id}>
                                        <TableCell>{unitOrBranch.short_code}</TableCell>
                                        <TableCell>{unitOrBranch.name}</TableCell>
                                        <TableCell>{unitOrBranch.type}</TableCell>
                                        {unitOrBranch.type === 'unit' && (
                                            <>
                                                <TableCell>{unitOrBranch.department ? unitOrBranch.department.name : ''}</TableCell>
                                                <TableCell>{unitOrBranch.manager ? `${unitOrBranch.manager.surname} ${unitOrBranch.manager.last_name}` : ''}</TableCell>
                                            </>
                                        )}
                                        {unitOrBranch.type === 'branch' && (
                                            <>
                                                <TableCell>{unitOrBranch.region ? unitOrBranch.region.name : ''}</TableCell>
                                                <TableCell>{unitOrBranch.regional_manager ? `${unitOrBranch.regional_manager.surname} ${unitOrBranch.regional_manager.last_name}` : ''}</TableCell>
                                                <TableCell>{unitOrBranch.branch_manager ? `${unitOrBranch.branch_manager.surname} ${unitOrBranch.branch_manager.last_name}` : ''}</TableCell>
                                                <TableCell>{unitOrBranch.relationship_manager ? `${unitOrBranch.relationship_manager.surname} ${unitOrBranch.relationship_manager.last_name}` : ''}</TableCell>
                                                <TableCell>{unitOrBranch.branch_operations_manager ? `${unitOrBranch.branch_operations_manager.surname} ${unitOrBranch.branch_operations_manager.last_name}` : ''}</TableCell>
                                                <TableCell>{unitOrBranch.manager_distribution ? `${unitOrBranch.manager_distribution.surname} ${unitOrBranch.manager_distribution.last_name}` : ''}</TableCell>
                                            </>
                                        )}
                                        <TableCell>{unitOrBranch.created_at ? new Date(unitOrBranch.created_at).toLocaleDateString() : ''}</TableCell>
                                        <TableCell>
                                            <UnitOrBranchActions
                                                unitOrBranch={unitOrBranch}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
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

            {/* Add Unit/Branch Modal */}
            <UnitOrBranchModal
                isOpen={isAddModalOpen}
                closeModal={() => setIsAddModalOpen(false)}
                onSubmit={handleAddSubmit}
                initialData={null}
                departments={allDepartments}
                regions={allRegions} // Pass fetched regions
                users={users}
            />
            
            {/* Edit Unit/Branch Modal */}
            {selectedUnitOrBranch && (
                <UnitOrBranchModal
                    isOpen={isEditModalOpen}
                    closeModal={() => {
                        setIsEditModalOpen(false);
                        setSelectedUnitOrBranch(null);
                    }}
                    onSubmit={handleEditSubmit}
                    initialData={selectedUnitOrBranch}
                    departments={allDepartments}
                    regions={allRegions} // Pass fetched regions
                    users={users}
                />
            )}
        </div>
    );
};

export default UnitOrBranchList;
