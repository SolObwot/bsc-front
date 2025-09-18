import { useState, useMemo } from 'react';

export const useUnitOrBranchFilters = (unitOrBranches) => {
    const [filterShortCode, setFilterShortCode] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterType, setFilterType] = useState('branch'); 
    const [filterRegion, setFilterRegion] = useState(''); 

    const filteredUnitOrBranches = useMemo(() => {
        return unitOrBranches.filter((unitOrBranch) => {
            const matchesShortCode = filterShortCode === '' || unitOrBranch.short_code?.toLowerCase().includes(filterShortCode.toLowerCase());
            const matchesName = filterName === '' || unitOrBranch.name?.toLowerCase().includes(filterName.toLowerCase());
            const matchesType = filterType === '' || unitOrBranch.type === filterType;
            const matchesRegion = filterRegion === '' || unitOrBranch.region_id == filterRegion; // Filter by Region ID
            return matchesShortCode && matchesName && matchesType && matchesRegion;
        });
    }, [unitOrBranches, filterShortCode, filterName, filterType, filterRegion]);

    const handleReset = () => {
        setFilterShortCode('');
        setFilterName('');
        setFilterType('branch'); 
        setFilterRegion(''); 
    };

    return {
        filteredUnitOrBranches,
        filterProps: {
            filterShortCode,
            setFilterShortCode,
            filterName,
            setFilterName,
            filterType,
            setFilterType,
            filterRegion,
            setFilterRegion, 
        },
    };
};
