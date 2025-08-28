import { useState, useEffect, useCallback } from "react";

export const useJobTitleFilters = (jobTitles) => {
  const safeJobTitles = Array.isArray(jobTitles) ? jobTitles : [];
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredJobTitles, setFilteredJobTitles] = useState(safeJobTitles);

  const applyFilters = useCallback(() => {
    let filtered = safeJobTitles;
    if (filterText) {
      filtered = filtered.filter(
        (jobTitle) =>
          (jobTitle.name?.toLowerCase().includes(filterText.toLowerCase()))
      );
    }
    if (filterShortCode) {
      filtered = filtered.filter(
        (jobTitle) =>
          (jobTitle.short_code?.toLowerCase().includes(filterShortCode.toLowerCase()))
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(
        (jobTitle) => (jobTitle.status || "") === filterStatus
      );
    }
    setFilteredJobTitles(filtered);
  }, [safeJobTitles, filterText, filterShortCode, filterStatus]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleReset = () => {
    setFilterText("");
    setFilterShortCode("");
    setFilterStatus("");
  };

  return {
    filteredJobTitles,
    filterProps: {
      filterText,
      setFilterText,
      filterShortCode,
      setFilterShortCode,
      filterStatus,
      setFilterStatus,
      handleReset,
    },
  };
};
