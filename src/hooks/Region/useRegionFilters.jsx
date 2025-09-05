import { useState, useEffect, useCallback, useMemo } from "react";

export const useRegionFilters = (regions = []) => {
  const safe = useMemo(() => Array.isArray(regions) ? regions : [], [regions]);
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filterManagerId, setFilterManagerId] = useState("");
  const [filteredRegions, setFilteredRegions] = useState(safe);

  const applyFilters = useCallback(() => {
    let f = safe;
    if (filterText) {
      const q = filterText.toLowerCase();
      f = f.filter(r => (r.name || '').toLowerCase().includes(q));
    }
    if (filterShortCode) {
      const q = filterShortCode.toLowerCase();
      f = f.filter(r => (r.short_code || '').toLowerCase().includes(q));
    }
    if (filterManagerId) {
      const id = Number(filterManagerId);
      f = f.filter(r => Number(r.regional_manager_id) === id);
    }
    setFilteredRegions(f);
  }, [safe, filterText, filterShortCode, filterManagerId]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const handleReset = () => {
    setFilterText(""); setFilterShortCode(""); setFilterManagerId("");
  };

  return {
    filteredRegions,
    filterProps: {
      filterText, setFilterText,
      filterShortCode, setFilterShortCode,
      filterManagerId, setFilterManagerId,
      handleReset,
    },
  };
};
