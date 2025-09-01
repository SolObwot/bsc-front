import { useState, useMemo } from 'react';

export const useDepartmentFilters = (departments) => {
  const [filterText, setFilterText] = useState('');
  const [filterShortCode, setFilterShortCode] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredDepartments = useMemo(() => {
    if (!Array.isArray(departments)) return [];
    return departments.filter((department) => {
      const matchesText = filterText === '' || department.name.toLowerCase().includes(filterText.toLowerCase());
      const matchesShortCode = filterShortCode === '' || department.short_code.toLowerCase().includes(filterShortCode.toLowerCase());
      const matchesStatus = filterStatus === '' || department.status === filterStatus;
      return matchesText && matchesShortCode && matchesStatus;
    });
  }, [departments, filterText, filterShortCode, filterStatus]);

  const handleReset = () => {
    setFilterText('');
    setFilterShortCode('');
    setFilterStatus('');
  };

  return {
    filteredDepartments,
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
