import { useState, useEffect, useCallback } from 'react';

export const useCourseFilters = (courses = []) => {
  const [filterText, setFilterText] = useState('');
  const [filterShortCode, setFilterShortCode] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(courses);

  const applyFilters = useCallback(() => {
    const filtered = courses.filter(course => 
      (course.name?.toLowerCase().includes(filterText.toLowerCase())) &&
      (filterShortCode ? course.short_code?.toLowerCase().includes(filterShortCode.toLowerCase()) : true) &&
      (filterStatus ? course.status === filterStatus : true)
    );
    setFilteredCourses(filtered);
  }, [courses, filterText, filterShortCode, filterStatus]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleReset = () => {
    setFilterText('');
    setFilterShortCode('');
    setFilterStatus('');
  };

  return {
    filteredCourses,
    filterProps: {
      filterText,
      setFilterText,
      filterShortCode,
      setFilterShortCode,
      filterStatus,
      setFilterStatus,
      handleReset,
    }
  };
};