import { useState, useMemo } from "react";

export const useCountyPagination = (counties = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(counties.length / recordsPerPage);
  const paginatedCounties = useMemo(() => {
    return counties.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [counties, currentPage, recordsPerPage]);

  const handlePageChange = (page) => { setCurrentPage(page); };
  const handleRecordsPerPageChange = (value) => { setRecordsPerPage(Number(value)); setCurrentPage(1); };

  return {
    paginatedCounties,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: counties.length,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
