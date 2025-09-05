import { useState, useMemo } from 'react';

export const useRegionPagination = (regions = []) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const totalPages = useMemo(() => {
    return Math.ceil(regions.length / recordsPerPage);
  }, [regions, recordsPerPage]);

  const paginatedRegions = useMemo(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return regions.slice(indexOfFirstRecord, indexOfLastRecord);
  }, [regions, currentPage, recordsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  return {
    paginatedRegions,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      handlePageChange,
      handleRecordsPerPageChange
    }
  };
};
