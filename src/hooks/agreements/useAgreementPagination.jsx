import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../../redux/agreementSlice';

const useAgreementPagination = (agreements = [], paginationData, isApiPaginated = true) => {
  const dispatch = useDispatch();
  const [recordsPerPage, setRecordsPerPage] = useState(paginationData?.perPage || 20);
  
  // For client-side pagination (when not using API pagination)
  const clientPaginatedAgreements = useMemo(() => {
    if (isApiPaginated) return agreements; // Return all if using API pagination
    
    const startIndex = (paginationData.currentPage - 1) * recordsPerPage;
    return agreements.slice(startIndex, startIndex + recordsPerPage);
  }, [agreements, paginationData.currentPage, recordsPerPage, isApiPaginated]);

  // Handler for page change
  const handlePageChange = useCallback((page) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  // Handler for records per page change
  const handleRecordsPerPageChange = useCallback((value) => {
    setRecordsPerPage(Number(value));
    dispatch(setCurrentPage(1)); // Reset to first page
  }, [dispatch]);

  return {
    paginatedAgreements: isApiPaginated ? agreements : clientPaginatedAgreements,
    paginationProps: {
      currentPage: paginationData.currentPage,
      totalPages: paginationData.totalPages,
      recordsPerPage,
      totalRecords: paginationData.total,
      handlePageChange,
      handleRecordsPerPageChange,
    }
  };
};

export default useAgreementPagination;