import { useState, useMemo } from 'react';

export const useTribePagination = (tribes = []) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const totalPages = useMemo(() => {
    return Math.ceil(tribes.length / recordsPerPage);
  }, [tribes, recordsPerPage]);

  const paginatedTribes = useMemo(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return tribes.slice(indexOfFirstRecord, indexOfLastRecord);
  }, [tribes, currentPage, recordsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      handlePageChange,
      handleRecordsPerPageChange
    }
  };
};
