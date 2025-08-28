import { useState, useMemo } from 'react';

export function useCourseFilters(courses) {
  const [filterText, setFilterText] = useState('');
  const [filterShortCode, setFilterShortCode] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Ensure courses is always an array
  const safeCourses = Array.isArray(courses) ? courses : [];

  const filteredCourses = useMemo(() => {
    let filtered = safeCourses;
    if (filterText) {
      filtered = filtered.filter(course =>
        (course.name || '').toLowerCase().includes(filterText.toLowerCase())
      );
    }
    if (filterShortCode) {
      filtered = filtered.filter(course =>
        (course.short_code || '').toLowerCase().includes(filterShortCode.toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(course =>
        (course.status || '') === filterStatus
      );
    }
    return filtered;
  }, [safeCourses, filterText, filterShortCode, filterStatus]);

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
    },
  };
}