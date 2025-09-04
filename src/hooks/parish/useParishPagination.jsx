import { useState, useMemo } from "react";

export const useParishPagination = (parishes = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(parishes.length / recordsPerPage);
  const paginatedParishes = useMemo(() => {
    return parishes.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [parishes, currentPage, recordsPerPage]);

  const handlePageChange = (page) => { setCurrentPage(page); };
  const handleRecordsPerPageChange = (value) => { setRecordsPerPage(Number(value)); setCurrentPage(1); };

  return {
    paginatedParishes,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: parishes.length,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
