import { useState, useMemo } from 'react';

export const useUnitOrBranchFilters = (unitOrBranches) => {
    const [filterShortCode, setFilterShortCode] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterType, setFilterType] = useState('');

    const filteredUnitOrBranches = useMemo(() => {
        return unitOrBranches.filter((unitOrBranch) => {
            const matchesShortCode = filterShortCode === '' || unitOrBranch.short_code?.toLowerCase().includes(filterShortCode.toLowerCase());
            const matchesName = filterName === '' || unitOrBranch.name?.toLowerCase().includes(filterName.toLowerCase());
            const matchesType = filterType === '' || unitOrBranch.type === filterType;
            return matchesShortCode && matchesName && matchesType;
        });
    }, [unitOrBranches, filterShortCode, filterName, filterType]);

    const handleReset = () => {
        setFilterShortCode('');
        setFilterName('');
        setFilterType('');
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
            handleReset,
        },
    };
};
