import { useState, useMemo } from 'react';

export const useDepartmentPagination = (departments) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50); 
  const totalPages = useMemo(() => Math.ceil(departments.length / recordsPerPage), [departments.length, recordsPerPage]);

  const paginatedDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return departments.slice(startIndex, startIndex + recordsPerPage);
  }, [departments, currentPage, recordsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(value);
    setCurrentPage(1);
  };

  return {
    paginatedDepartments,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
