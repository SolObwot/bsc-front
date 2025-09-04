import { useState, useEffect, useCallback, useMemo } from "react";

export const useSubCountiesFilters = (subCounties = []) => {
  const safe = useMemo(() => Array.isArray(subCounties) ? subCounties : [], [subCounties]);
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filterDistrictId, setFilterDistrictId] = useState("");
  const [filterCountyId, setFilterCountyId] = useState("");
  const [filteredSubCounties, setFilteredSubCounties] = useState(safe);

  const applyFilters = useCallback(() => {
    let f = safe;
    if (filterText) {
      const q = filterText.toLowerCase();
      f = f.filter(s => (s.name || '').toLowerCase().includes(q));
    }
    if (filterShortCode) {
      const q = filterShortCode.toLowerCase();
      f = f.filter(s => (s.short_code || '').toLowerCase().includes(q));
    }
    if (filterDistrictId) {
      const id = Number(filterDistrictId);
      f = f.filter(s => {
        const districtId = s.county?.district_id ?? s.county?.district?.id ?? (s.county?.district && s.county.district.id);
        return Number(districtId) === id;
      });
    }
    if (filterCountyId) {
      const cid = Number(filterCountyId);
      f = f.filter(s => Number(s.county_id) === cid);
    }
    setFilteredSubCounties(f);
  }, [safe, filterText, filterShortCode, filterDistrictId, filterCountyId]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const handleReset = () => {
    setFilterText("");
    setFilterShortCode("");
    setFilterDistrictId("");
    setFilterCountyId("");
  };

  return {
    filteredSubCounties,
    filterProps: {
      filterText,
      setFilterText,
      filterShortCode,
      setFilterShortCode,
      filterDistrictId,
      setFilterDistrictId,
      filterCountyId,
      setFilterCountyId,
      handleReset,
    },
  };
};
