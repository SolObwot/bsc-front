import { useState, useMemo } from 'react';

const useAgreementFilters = (agreements = []) => {
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  
  // Filter the agreements based on the filter criteria
  const filteredAgreements = useMemo(() => {
    if (!agreements || agreements.length === 0) {
      return [];
    }
    
    return agreements.filter(agreement => {
      let matchesFilters = true;
      
      // Text search across multiple fields
      if (filterText) {
        const searchText = filterText.toLowerCase();
        const nameMatch = (agreement.name || '').toLowerCase().includes(searchText);
        const creatorMatch = agreement.creator ? 
          (agreement.creator.surname + ' ' + agreement.creator.last_name).toLowerCase().includes(searchText) : 
          false;
        const supervisorMatch = agreement.supervisor ? 
          (agreement.supervisor.surname + ' ' + agreement.supervisor.last_name).toLowerCase().includes(searchText) : 
          false;
        
        matchesFilters = nameMatch || creatorMatch || supervisorMatch;
      }
      
      // Status filter
      if (filterStatus && matchesFilters) {
        matchesFilters = agreement.status === filterStatus;
      }
      
      // Period filter
      if (filterPeriod && matchesFilters) {
        matchesFilters = agreement.period === filterPeriod;
      }
      
      // Department filter
      if (filterDepartment && matchesFilters) {
        matchesFilters = agreement.department_id === Number(filterDepartment);
      }
      
      return matchesFilters;
    });
  }, [agreements, filterText, filterStatus, filterPeriod, filterDepartment]);

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterPeriod('');
    setFilterDepartment('');
  };

  return {
    filteredAgreements,
    filterProps: {
      filterText,
      setFilterText,
      filterStatus,
      setFilterStatus,
      filterPeriod,
      setFilterPeriod,
      filterDepartment,
      setFilterDepartment,
      handleReset,
    }
  };
};

export default useAgreementFilters;