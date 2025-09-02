import { useState, useEffect, useCallback, useMemo } from "react";

export const useRelationFilters = (relations) => {
  const safeRelations = useMemo(() => Array.isArray(relations) ? relations : [], [relations]);
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filteredRelations, setFilteredRelations] = useState(safeRelations);

  const applyFilters = useCallback(() => {
    let filtered = safeRelations;
    if (filterText) {
      filtered = filtered.filter(
        (relation) =>
          (relation.name?.toLowerCase().includes(filterText.toLowerCase()))
      );
    }
    if (filterShortCode) {
      filtered = filtered.filter(
        (relation) =>
          (relation.short_code?.toLowerCase().includes(filterShortCode.toLowerCase()))
      );
    }
    setFilteredRelations(filtered);
  }, [safeRelations, filterText, filterShortCode]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleReset = () => {
    setFilterText("");
    setFilterShortCode("");
  };

  return {
    filteredRelations,
    filterProps: {
      filterText,
      setFilterText,
      filterShortCode,
      setFilterShortCode,
      handleReset,
    },
  };
};
