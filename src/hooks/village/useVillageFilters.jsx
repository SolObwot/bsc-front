import { useState, useEffect, useCallback, useMemo } from "react";

export const useVillageFilters = (villages = []) => {
  const safe = useMemo(() => Array.isArray(villages) ? villages : [], [villages]);
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filterDistrictId, setFilterDistrictId] = useState("");
  const [filterCountyId, setFilterCountyId] = useState("");
  const [filterSubCountyId, setFilterSubCountyId] = useState("");
  const [filterParishId, setFilterParishId] = useState("");
  const [filteredVillages, setFilteredVillages] = useState(safe);

  const applyFilters = useCallback(() => {
    let f = safe;
    if (filterText) {
      const q = filterText.toLowerCase();
      f = f.filter(v => (v.name || '').toLowerCase().includes(q));
    }
    if (filterShortCode) {
      const q = filterShortCode.toLowerCase();
      f = f.filter(v => (v.short_code || '').toLowerCase().includes(q));
    }
    if (filterDistrictId) {
      const id = Number(filterDistrictId);
      f = f.filter(v => {
        const districtId = v.parish?.subcounty?.county?.district_id ?? v.parish?.subcounty?.county?.district?.id;
        return Number(districtId) === id;
      });
    }
    if (filterCountyId) {
      const cid = Number(filterCountyId);
      f = f.filter(v => Number(v.parish?.subcounty?.county_id) === cid);
    }
    if (filterSubCountyId) {
      const scid = Number(filterSubCountyId);
      f = f.filter(v => Number(v.parish?.subcounty_id) === scid);
    }
    if (filterParishId) {
      const pid = Number(filterParishId);
      f = f.filter(v => Number(v.parish_id) === pid);
    }
    setFilteredVillages(f);
  }, [safe, filterText, filterShortCode, filterDistrictId, filterCountyId, filterSubCountyId, filterParishId]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const handleReset = () => {
    setFilterText(""); setFilterShortCode(""); setFilterDistrictId(""); setFilterCountyId(""); setFilterSubCountyId(""); setFilterParishId("");
  };

  return {
    filteredVillages,
    filterProps: {
      filterText, setFilterText,
      filterShortCode, setFilterShortCode,
      filterDistrictId, setFilterDistrictId,
      filterCountyId, setFilterCountyId,
      filterSubCountyId, setFilterSubCountyId,
      filterParishId, setFilterParishId,
      handleReset,
    },
  };
};
