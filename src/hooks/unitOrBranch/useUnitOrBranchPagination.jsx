import { useState, useMemo } from 'react';

export const useUnitOrBranchPagination = (filteredUnitOrBranches) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(50);

    const totalPages = useMemo(() => Math.ceil(filteredUnitOrBranches.length / recordsPerPage), [filteredUnitOrBranches.length, recordsPerPage]);

    const paginatedUnitOrBranches = useMemo(() => {
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        return filteredUnitOrBranches.slice(indexOfFirstRecord, indexOfLastRecord);
    }, [filteredUnitOrBranches, currentPage, recordsPerPage]);

    const handlePageChange = (page) => setCurrentPage(page);
    const handleRecordsPerPageChange = (value) => {
        setRecordsPerPage(Number(value));
        setCurrentPage(1);
    };

    return {
        paginatedUnitOrBranches,
        paginationProps: {
            currentPage,
            totalPages,
            recordsPerPage,
            handlePageChange,
            handleRecordsPerPageChange,
        },
    };
};
