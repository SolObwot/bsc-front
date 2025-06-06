import { useState, useMemo } from 'react';

const useStrategicPerspectiveFilters = (departments = []) => {
  const [filterText, setFilterText] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterPerspectiveType, setFilterPerspectiveType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Flatten all weights from all departments for easier filtering
  const allWeights = useMemo(() => {
    console.log('Processing departments for weights:', departments);
    let weights = [];
    
    if (!departments || !Array.isArray(departments) || departments.length === 0) {
      console.log('No departments data to process');
      return [];
    }
    
    departments.forEach(dept => {
      console.log('Processing department:', dept);
      
      // Handle case where active_weights might be directly on the department
      if (dept.active_weights && Array.isArray(dept.active_weights)) {
        console.log(`Found ${dept.active_weights.length} weights for department ${dept.name || dept.id}`);
        const weightsWithDept = dept.active_weights.map(weight => ({
          ...weight,
          department_name: dept.name || 'Unknown Department',
          department_id: dept.id
        }));
        weights = [...weights, ...weightsWithDept];
      } 
      // Handle case where weights might be under a different property name
      else if (dept.weights && Array.isArray(dept.weights)) {
        console.log(`Found ${dept.weights.length} weights for department ${dept.name || dept.id}`);
        const weightsWithDept = dept.weights.map(weight => ({
          ...weight,
          department_name: dept.name || 'Unknown Department',
          department_id: dept.id
        }));
        weights = [...weights, ...weightsWithDept];
      }
      // Handle case where department might be a single weight or have a nested structure
      else if (dept.id && dept.strategy_perspective_id) {
        console.log('Department appears to be a single weight object');
        weights.push({
          ...dept,
          department_name: dept.department?.name || 'Unknown Department',
          department_id: dept.department_id || dept.department?.id
        });
      }
    });
    
    console.log('Total weights extracted:', weights.length);
    return weights;
  }, [departments]);
  
  // Filter the weights based on the filter criteria
  const filteredWeights = useMemo(() => {
    if (!allWeights || allWeights.length === 0) {
      return [];
    }
    
    return allWeights.filter(weight => {
      let matchesFilters = true;
      
      // Text search
      if (filterText) {
        const perspectiveName = weight.perspective?.name || '';
        const departmentName = weight.department_name || '';
        matchesFilters = matchesFilters && (
          perspectiveName.toLowerCase().includes(filterText.toLowerCase()) ||
          departmentName.toLowerCase().includes(filterText.toLowerCase())
        );
      }
      
      // Department filter
      if (filterDepartment) {
        matchesFilters = matchesFilters && weight.department_id.toString() === filterDepartment;
      }
      
      // Perspective type filter
      if (filterPerspectiveType) {
        matchesFilters = matchesFilters && weight.perspective?.type === filterPerspectiveType;
      }
      
      // Status filter
      if (filterStatus) {
        matchesFilters = matchesFilters && weight.status === filterStatus;
      }
      
      return matchesFilters;
    });
  }, [allWeights, filterText, filterDepartment, filterPerspectiveType, filterStatus]);

  const handleReset = () => {
    setFilterText('');
    setFilterDepartment('');
    setFilterPerspectiveType('');
    setFilterStatus('');
  };

  return {
    allWeights,
    filteredWeights,
    filterProps: {
      filterText,
      setFilterText,
      filterDepartment,
      setFilterDepartment,
      filterPerspectiveType,
      setFilterPerspectiveType,
      filterStatus,
      setFilterStatus,
      handleReset,
    }
  };
};

export default useStrategicPerspectiveFilters;
