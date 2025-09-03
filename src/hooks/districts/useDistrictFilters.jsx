import { useState, useEffect, useCallback, useMemo } from "react";

export const useDistrictFilters = (districts) => {
  const safe = useMemo(() => Array.isArray(districts) ? districts : [], [districts]);
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filteredDistricts, setFilteredDistricts] = useState(safe);

  const applyFilters = useCallback(() => {
    let f = safe;
    if (filterText) {
      const q = filterText.toLowerCase();
      f = f.filter(d => (d.name || '').toLowerCase().includes(q));
    }
    if (filterShortCode) {
      const q = filterShortCode.toLowerCase();
      f = f.filter(d => (d.short_code || '').toLowerCase().includes(q));
    }
    setFilteredDistricts(f);
  }, [safe, filterText, filterShortCode]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const handleReset = () => {
    setFilterText("");
    setFilterShortCode("");
  };

  return {
    filteredDistricts,
    filterProps: {
      filterText,
      setFilterText,
      filterShortCode,
      setFilterShortCode,
      handleReset,
    },
  };
};
