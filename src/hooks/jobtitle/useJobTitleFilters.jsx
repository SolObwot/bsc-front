import { useState, useEffect, useCallback } from "react";

export const useJobTitleFilters = (jobTitles = []) => {
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filteredJobTitles, setFilteredJobTitles] = useState(jobTitles);

  const applyFilters = useCallback(() => {
    const filtered = jobTitles.filter(
      (jobTitle) =>
        (jobTitle.name?.toLowerCase().includes(filterText.toLowerCase())) &&
        (filterShortCode ? jobTitle.short_code?.toLowerCase().includes(filterShortCode.toLowerCase()) : true)
    );
    setFilteredJobTitles(filtered);
  }, [jobTitles, filterText, filterShortCode]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleReset = () => {
    setFilterText("");
    setFilterShortCode("");
  };

  return {
    filteredJobTitles,
    filterProps: {
      filterText,
      setFilterText,
      filterShortCode,
      setFilterShortCode,
      handleReset,
    },
  };
};
