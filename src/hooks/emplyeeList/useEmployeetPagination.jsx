import { useState } from 'react';

const useEmployeePagination = (filteredUsers) => {
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return {
    paginatedUsers,
    paginationProps: {
      recordsPerPage,
      currentPage,
      totalPages,
      handleRecordsPerPageChange,
      handlePageChange,
    },
  };
};

export default useEmployeePagination;