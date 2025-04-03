import { useState, useMemo } from 'react';

const useUniversityPagination = (universities = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(universities.length / recordsPerPage);
  const paginatedUniversities = useMemo(() => {
    return universities.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [universities, currentPage, recordsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  return {
    paginatedUniversities,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: universities.length,
      handlePageChange,
      handleRecordsPerPageChange,
    }
  };
};

export default useUniversityPagination;
