import { useState, useMemo } from 'react';

export const useTemplatePagination = (templates = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(templates.length / recordsPerPage);
  const paginatedTemplates = useMemo(() => {
    return templates.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [templates, currentPage, recordsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  return {
    paginatedTemplates,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: templates.length,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
