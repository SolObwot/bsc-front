import { useState, useMemo } from "react";

export const useJobTitlePagination = (jobTitles = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(jobTitles.length / recordsPerPage);
  const paginatedJobTitles = useMemo(() => {
    return jobTitles.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [jobTitles, currentPage, recordsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  return {
    paginatedJobTitles,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: jobTitles.length,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
