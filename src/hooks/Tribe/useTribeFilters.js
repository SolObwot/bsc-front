import { useState, useEffect, useMemo } from 'react';

export const useTribeFilters = (tribes = []) => {
  const [filterText, setFilterText] = useState('');
  const [filterShortCode, setFilterShortCode] = useState('');

  const handleReset = () => {
    setFilterText('');
    setFilterShortCode('');
  };

  const filteredTribes = useMemo(() => {
    return tribes.filter((tribe) => {
      const matchesText = !filterText || 
        tribe.name.toLowerCase().includes(filterText.toLowerCase());
      
      const matchesShortCode = !filterShortCode || 
        tribe.short_code.toLowerCase().includes(filterShortCode.toLowerCase());
      
      return matchesText && matchesShortCode;
    });
  }, [tribes, filterText, filterShortCode]);

  return {
    filteredTribes,
    filterProps: {
      filterText,
      setFilterText,
      filterShortCode,
      setFilterShortCode,
      handleReset
    }
  };
};
