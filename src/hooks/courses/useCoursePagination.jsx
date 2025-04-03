import { useState, useMemo } from 'react';

export const useCoursePagination = (courses = [], defaultPerPage = 50) => {
  const [recordsPerPage, setRecordsPerPage] = useState(defaultPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(courses.length / recordsPerPage);
  const paginatedCourses = useMemo(() => {
    return courses.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
  }, [courses, currentPage, recordsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  return {
    paginatedCourses,
    paginationProps: {
      currentPage,
      totalPages,
      recordsPerPage,
      totalRecords: courses.length,
      handlePageChange,
      handleRecordsPerPageChange,
    }
  };
};