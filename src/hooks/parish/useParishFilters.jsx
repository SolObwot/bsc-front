import { useState, useEffect, useCallback, useMemo } from "react";

export const useParishFilters = (parishes = []) => {
  const safe = useMemo(() => Array.isArray(parishes) ? parishes : [], [parishes]);
  const [filterText, setFilterText] = useState("");
  const [filterShortCode, setFilterShortCode] = useState("");
  const [filterDistrictId, setFilterDistrictId] = useState("");
  const [filterCountyId, setFilterCountyId] = useState("");
  const [filterSubCountyId, setFilterSubCountyId] = useState("");
  const [filteredParishes, setFilteredParishes] = useState(safe);

  const applyFilters = useCallback(() => {
    let f = safe;
    if (filterText) {
      const q = filterText.toLowerCase();
      f = f.filter(p => (p.name || '').toLowerCase().includes(q));
    }
    if (filterShortCode) {
      const q = filterShortCode.toLowerCase();
      f = f.filter(p => (p.short_code || '').toLowerCase().includes(q));
    }
    if (filterDistrictId) {
      const id = Number(filterDistrictId);
      f = f.filter(p => {
        const districtId = p.subcounty?.county?.district_id ?? p.subcounty?.county?.district?.id;
        return Number(districtId) === id;
      });
    }
    if (filterCountyId) {
      const cid = Number(filterCountyId);
      f = f.filter(p => Number(p.subcounty?.county_id) === cid);
    }
    if (filterSubCountyId) {
      const scid = Number(filterSubCountyId);
      f = f.filter(p => Number(p.subcounty_id) === scid);
    }
    setFilteredParishes(f);
  }, [safe, filterText, filterShortCode, filterDistrictId, filterCountyId, filterSubCountyId]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const handleReset = () => {
    setFilterText(""); setFilterShortCode(""); setFilterDistrictId(""); setFilterCountyId(""); setFilterSubCountyId("");
  };

  return {
    filteredParishes,
    filterProps: {
      filterText, setFilterText,
      filterShortCode, setFilterShortCode,
      filterDistrictId, setFilterDistrictId,
      filterCountyId, setFilterCountyId,
      filterSubCountyId, setFilterSubCountyId,
      handleReset,
    },
  };
};
