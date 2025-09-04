import { useState, useMemo } from "react";

export const useVillagePagination = (villages = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(villages.length / recordsPerPage);
  const paginatedVillages = useMemo(() => {
    return villages.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [villages, currentPage, recordsPerPage]);

  const handlePageChange = (page) => { setCurrentPage(page); };
  const handleRecordsPerPageChange = (value) => { setRecordsPerPage(Number(value)); setCurrentPage(1); };

  return {
    paginatedVillages,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: villages.length,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
