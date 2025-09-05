import { useState, useEffect, useCallback, useMemo } from "react";

export const useTribeFilters = (tribes = []) => {
  const safe = useMemo(() => Array.isArray(tribes) ? tribes : [], [tribes]);
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filteredTribes, setFilteredTribes] = useState(safe);

  const applyFilters = useCallback(() => {
    let f = safe;
    if (filterText) {
      const q = filterText.toLowerCase();
      f = f.filter(t => (t.name || '').toLowerCase().includes(q));
    }
    if (filterShortCode) {
      const q = filterShortCode.toLowerCase();
      f = f.filter(t => (t.short_code || '').toLowerCase().includes(q));
    }
    setFilteredTribes(f);
  }, [safe, filterText, filterShortCode]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const handleReset = () => { setFilterText(""); setFilterShortCode(""); };

  return {
    filteredTribes,
    filterProps: {
      filterText, setFilterText,
      filterShortCode, setFilterShortCode,
      handleReset,
    },
  };
};
