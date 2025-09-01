import { useState } from "react";

export function useEmploymentStatusPagination(filteredEmploymentStatuses) {
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredEmploymentStatuses.length / recordsPerPage);

  const paginatedEmploymentStatuses = filteredEmploymentStatuses.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return {
    paginatedEmploymentStatuses,
    paginationProps: {
      recordsPerPage,
      setRecordsPerPage,
      currentPage,
      setCurrentPage,
      totalPages,
      handleRecordsPerPageChange,
      handlePageChange,
    },
  };
}
