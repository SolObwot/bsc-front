import { useState, useMemo } from 'react';

const useStrategicObjectiveFilters = (objectives = []) => {
  const currentYear = new Date().getFullYear();
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPerspective, setFilterPerspective] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  
  // Use useMemo for derived state to prevent unnecessary recalculations
  const filteredObjectives = useMemo(() => {
    if (!objectives || objectives.length === 0) {
      return [];
    }
    
    return objectives.filter(objective => {
      let matchesFilters = true;
      
      // Text search on objective name
      if (filterText) {
        const nameToCheck = objective.objective?.name || objective.name || '';
        matchesFilters = matchesFilters && nameToCheck.toLowerCase().includes(filterText.toLowerCase());
      }
      
      // Status filter
      if (filterStatus) {
        matchesFilters = matchesFilters && objective.status === filterStatus;
      }
      
      // Perspective filter
      if (filterPerspective) {
        matchesFilters = matchesFilters && objective.perspective?.name === filterPerspective;
      }
      
      // Type filter
      if (filterType) {
        matchesFilters = matchesFilters && objective.perspective?.type === filterType;
      }
      
      // Department filter
      if (filterDepartment) {
        // Check both department_id and department_name
        const departmentId = parseInt(filterDepartment, 10);
        matchesFilters = matchesFilters && (
          (objective.department_id && objective.department_id === departmentId) || 
          (objective.department_name && objective.department_name.toLowerCase().includes(filterDepartment.toLowerCase()))
        );
      }
      
      // Year filter
      if (filterYear) {
        const createdAt = objective.created_at ? new Date(objective.created_at) : null;
        const objectiveYear = createdAt ? createdAt.getFullYear().toString() : '';
        matchesFilters = matchesFilters && (!filterYear || objectiveYear === filterYear);
      }
      
      return matchesFilters;
    });
  }, [objectives, filterText, filterStatus, filterPerspective, filterType, filterDepartment, filterYear]);

  const handleReset = () => {
    setFilterText('');
    setFilterStatus('');
    setFilterPerspective('');
    setFilterType('');
    setFilterDepartment('');
    setFilterYear(currentYear.toString()); // Reset to current year, not empty
  };

  return {
    filteredObjectives,
    filterProps: {
      filterText,
      setFilterText,
      filterStatus,
      setFilterStatus,
      filterPerspective,
      setFilterPerspective,
      filterType,
      setFilterType,
      filterDepartment,
      setFilterDepartment,
      filterYear,
      setFilterYear,
      currentYear,
      handleReset,
    }
  };
};

export default useStrategicObjectiveFilters;
