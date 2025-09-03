import { useState, useMemo } from "react";

export const useDistrictPagination = (districts = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(districts.length / recordsPerPage);
  const paginatedDistricts = useMemo(() => {
    return districts.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [districts, currentPage, recordsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  return {
    paginatedDistricts,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: districts.length,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
