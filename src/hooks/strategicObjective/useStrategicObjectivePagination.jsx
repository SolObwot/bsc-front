import { useState, useMemo, useCallback } from 'react';

const useStrategicObjectivePagination = (objectives = [], defaultPerPage = 20) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages efficiently
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(objectives.length / recordsPerPage)),
    [objectives.length, recordsPerPage]
  );

  // Make sure current page is valid after objectives or recordsPerPage changes
  useMemo(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Efficiently paginate the objectives
  const paginatedObjectives = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return objectives.slice(startIndex, startIndex + recordsPerPage);
  }, [objectives, currentPage, recordsPerPage]);

  // Memoized handlers to prevent unnecessary recreations
  const handlePageChange = useCallback((page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  const handleRecordsPerPageChange = useCallback((value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing records per page
  }, []);

  return {
    paginatedObjectives,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: objectives.length,
      handlePageChange,
      handleRecordsPerPageChange,
    }
  };
};

export default useStrategicObjectivePagination;
