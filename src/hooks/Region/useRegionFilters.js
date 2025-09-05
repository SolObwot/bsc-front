import { useState, useEffect, useMemo } from 'react';

export const useRegionFilters = (regions = []) => {
  const [filterText, setFilterText] = useState('');
  const [filterShortCode, setFilterShortCode] = useState('');
  const [filterManagerId, setFilterManagerId] = useState('');

  const handleReset = () => {
    setFilterText('');
    setFilterShortCode('');
    setFilterManagerId('');
  };

  const filteredRegions = useMemo(() => {
    return regions.filter((region) => {
      const matchesText = !filterText || 
        region.name.toLowerCase().includes(filterText.toLowerCase());
      
      const matchesShortCode = !filterShortCode || 
        region.short_code.toLowerCase().includes(filterShortCode.toLowerCase());
      
      const matchesManager = !filterManagerId || 
        (region.regional_manager_id && region.regional_manager_id.toString() === filterManagerId.toString());
      
      return matchesText && matchesShortCode && matchesManager;
    });
  }, [regions, filterText, filterShortCode, filterManagerId]);

  return {
    filteredRegions,
    filterProps: {
      filterText,
      setFilterText,
      filterShortCode,
      setFilterShortCode,
      filterManagerId,
      setFilterManagerId,
      handleReset
    }
  };
};
