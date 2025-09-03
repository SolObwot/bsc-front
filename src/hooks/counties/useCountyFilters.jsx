import { useState, useEffect, useCallback, useMemo } from "react";

export const useCountyFilters = (counties) => {
  const safe = useMemo(() => Array.isArray(counties) ? counties : [], [counties]);
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filteredCounties, setFilteredCounties] = useState(safe);

  const applyFilters = useCallback(() => {
    let f = safe;
    if (filterText) {
      const q = filterText.toLowerCase();
      f = f.filter(c => (c.name || '').toLowerCase().includes(q));
    }
    if (filterShortCode) {
      const q = filterShortCode.toLowerCase();
      f = f.filter(c => (c.short_code || '').toLowerCase().includes(q));
    }
    if (filterDistrict) {
      const q = filterDistrict.toLowerCase();
      f = f.filter(c => (c.district?.name || '').toLowerCase().includes(q));
    }
    setFilteredCounties(f);
  }, [safe, filterText, filterShortCode, filterDistrict]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const handleReset = () => {
    setFilterText("");
    setFilterShortCode("");
    setFilterDistrict("");
  };

  return {
    filteredCounties,
    filterProps: {
      filterText,
      setFilterText,
      filterShortCode,
      setFilterShortCode,
      filterDistrict,
      setFilterDistrict,
      handleReset,
    },
  };
};
