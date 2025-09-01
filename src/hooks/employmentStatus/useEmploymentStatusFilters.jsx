import { useState } from "react";

export function useEmploymentStatusFilters(allEmploymentStatuses) {
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const statuses = Array.isArray(allEmploymentStatuses) ? allEmploymentStatuses : [];

  const filteredEmploymentStatuses = statuses.filter((status) => {
    const matchesText = status.name.toLowerCase().includes(filterText.toLowerCase());
    const matchesStatus = filterStatus ? status.name === filterStatus : true;
    return matchesText && matchesStatus;
  });

  const handleReset = () => {
    setFilterText("");
    setFilterStatus("");
  };

  return {
    filteredEmploymentStatuses,
    filterProps: {
      filterText,
      setFilterText,
      filterStatus,
      setFilterStatus,
      handleReset,
    },
  };
}
