import { useState, useMemo, useCallback } from 'react';

const useStrategicPerspectivePagination = (weights = [], defaultPerPage = 10) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(weights.length / recordsPerPage)),
    [weights.length, recordsPerPage]
  );

  // Ensure current page is valid
  useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Paginate the weights
  const paginatedWeights = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return weights.slice(startIndex, startIndex + recordsPerPage);
  }, [weights, currentPage, recordsPerPage]);

  // Handler functions
  const handlePageChange = useCallback((page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  const handleRecordsPerPageChange = useCallback((value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  }, []);

  return {
    paginatedWeights,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: weights.length,
      handlePageChange,
      handleRecordsPerPageChange,
    }
  };
};

export default useStrategicPerspectivePagination;
