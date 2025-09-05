import { useState, useMemo } from "react";

export const useRegionPagination = (regions = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(regions.length / recordsPerPage);
  const paginatedRegions = useMemo(() => {
    return regions.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [regions, currentPage, recordsPerPage]);

  const handlePageChange = (page) => { setCurrentPage(page); };
  const handleRecordsPerPageChange = (value) => { setRecordsPerPage(Number(value)); setCurrentPage(1); };

  return {
    paginatedRegions,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: regions.length,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
