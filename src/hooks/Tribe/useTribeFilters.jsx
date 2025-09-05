import { useState, useEffect, useCallback, useMemo } from "react";

export const useTribeFilters = (tribes) => {
  const safeTribes = useMemo(() => Array.isArray(tribes) ? tribes : [], [tribes]);
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filteredTribes, setFilteredTribes] = useState(safeTribes);

  const applyFilters = useCallback(() => {
    let filtered = safeTribes;
    if (filterText) {
      filtered = filtered.filter(
        (tribe) =>
          (tribe.name?.toLowerCase().includes(filterText.toLowerCase()))
      );
    }
    if (filterShortCode) {
      filtered = filtered.filter(
        (tribe) =>
          (tribe.short_code?.toLowerCase().includes(filterShortCode.toLowerCase()))
      );
    }
    setFilteredTribes(filtered);
  }, [safeTribes, filterText, filterShortCode]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleReset = () => {
    setFilterText("");
    setFilterShortCode("");
  };

  return {
    filteredTribes,
    filterProps: {
      filterText,
      setFilterText,
      filterShortCode,
      setFilterShortCode,
      handleReset,
    },
  };
};
