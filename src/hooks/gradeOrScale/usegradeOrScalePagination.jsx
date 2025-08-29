import { useState, useMemo } from "react";

export const useGradeOrScalePagination = (items = [], defaultPerPage = 10) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / recordsPerPage);
  const paginatedGradeOrScales = useMemo(() => {
    return items.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [items, currentPage, recordsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  return {
    paginatedGradeOrScales,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: items.length,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
