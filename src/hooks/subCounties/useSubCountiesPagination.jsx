import { useState, useMemo } from "react";

export const useSubCountiesPagination = (subCounties = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(subCounties.length / recordsPerPage);
  const paginatedSubCounties = useMemo(() => {
    return subCounties.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [subCounties, currentPage, recordsPerPage]);

  const handlePageChange = (page) => { setCurrentPage(page); };
  const handleRecordsPerPageChange = (value) => { setRecordsPerPage(Number(value)); setCurrentPage(1); };

  return {
    paginatedSubCounties,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: subCounties.length,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
