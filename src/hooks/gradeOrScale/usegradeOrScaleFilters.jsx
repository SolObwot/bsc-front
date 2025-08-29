import { useState, useEffect } from "react";

export const useGradeOrScaleFilters = (gradeOrScales) => {
  const safeList = Array.isArray(gradeOrScales) ? gradeOrScales : [];
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredGradeOrScales, setFilteredGradeOrScales] = useState([]);

  useEffect(() => {
    let filtered = safeList;
    if (filterText) {
      filtered = filtered.filter(
        (item) => item.name?.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    if (filterShortCode) {
      filtered = filtered.filter(
        (item) => item.short_code?.toLowerCase().includes(filterShortCode.toLowerCase())
      );
    }
    if (filterStatus) {
      filtered = filtered.filter(
        (item) => (item.status || "") === filterStatus
      );
    }
    // Only update state if the filtered array is different
    if (
      filtered.length !== filteredGradeOrScales.length ||
      filtered.some((item, idx) => item.id !== (filteredGradeOrScales[idx]?.id))
    ) {
      setFilteredGradeOrScales(filtered);
    }
  }, [safeList, filterText, filterShortCode, filterStatus]);

  const handleReset = () => {
    setFilterText("");
    setFilterShortCode("");
    setFilterStatus("");
  };

  return {
    filteredGradeOrScales,
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
