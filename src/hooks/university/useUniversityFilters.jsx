import { useState, useEffect, useCallback } from 'react';

const useUniversityFilters = (universities = []) => {
  const [filterText, setFilterText] = useState('');
  const [filterShortCode, setFilterShortCode] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState(universities);

  const applyFilters = useCallback(() => {
    const filtered = universities.filter(university =>
      (university.name?.toLowerCase().includes(filterText.toLowerCase())) &&
      (filterShortCode ? university.short_code?.toLowerCase().includes(filterShortCode.toLowerCase()) : true) &&
      (filterStatus ? university.status === filterStatus : true)
    );
    setFilteredUniversities(filtered);
  }, [universities, filterText, filterShortCode, filterStatus]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleReset = () => {
    setFilterText('');
    setFilterShortCode('');
    setFilterStatus('');
  };

  return {
    filteredUniversities,
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

export default useUniversityFilters;
