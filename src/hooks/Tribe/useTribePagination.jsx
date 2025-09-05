import { useState, useMemo } from "react";

export const useTribePagination = (tribes = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(tribes.length / recordsPerPage);
  const paginatedTribes = useMemo(() => {
    return tribes.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [tribes, currentPage, recordsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  return {
    paginatedTribes,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: tribes.length,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
