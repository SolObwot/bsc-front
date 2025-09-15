import { useState, useMemo } from "react";

export const useJobTitleFilters = (jobTitles) => {
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredJobTitles = useMemo(() => {
    if (!Array.isArray(jobTitles)) return [];
    return jobTitles.filter((jobTitle) => {
      const matchesText =
        filterText === "" ||
        jobTitle.name?.toLowerCase().includes(filterText.toLowerCase());
      const matchesShortCode =
        filterShortCode === "" ||
        jobTitle.short_code?.toLowerCase().includes(filterShortCode.toLowerCase());
      const matchesStatus =
        filterStatus === "" || (jobTitle.status || "") === filterStatus;
      return matchesText && matchesShortCode && matchesStatus;
    });
  }, [jobTitles, filterText, filterShortCode, filterStatus]);

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
