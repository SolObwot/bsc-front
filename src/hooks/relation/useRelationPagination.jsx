import { useState, useMemo } from "react";

export const useRelationPagination = (relations = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(relations.length / recordsPerPage);
  const paginatedRelations = useMemo(() => {
    return relations.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [relations, currentPage, recordsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  return {
    paginatedRelations,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: relations.length,
      handlePageChange,
      handleRecordsPerPageChange,
    },
  };
};
