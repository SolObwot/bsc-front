import { useState, useMemo } from 'react';

const useUniversityFilters = (universities = []) => {
  const [filterText, setFilterText] = useState('');
  const [filterShortCode, setFilterShortCode] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  // Ensure universities is always an array
  const safeUniversities = Array.isArray(universities) ? universities : [];

  const filteredUniversities = useMemo(() => {
    return safeUniversities.filter(university =>
      (university.name?.toLowerCase().includes(filterText.toLowerCase())) &&
      (filterShortCode ? university.short_code?.toLowerCase().includes(filterShortCode.toLowerCase()) : true) &&
      (filterStatus ? university.status === filterStatus : true)
    );
  }, [safeUniversities, filterText, filterShortCode, filterStatus]);

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
