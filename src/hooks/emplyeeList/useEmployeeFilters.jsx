import { useState } from 'react';

const useEmployeeFilters = (allUsers, selectedEmployee) => {
  const [filterText, setFilterText] = useState('');
  const [filterStaffNumber, setFilterStaffNumber] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterJobTitle, setFilterJobTitle] = useState('');
  const [filterType, setFilterType] = useState('branch');

  const filteredUsers = selectedEmployee
    ? [selectedEmployee]
    : allUsers.filter(user =>
        (user.surname?.toLowerCase().includes(filterText.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(filterText.toLowerCase()) ||
        user.email?.toLowerCase().includes(filterText.toLowerCase())) &&
        (filterStaffNumber ? user.staff_number?.toLowerCase().includes(filterStaffNumber.toLowerCase()) : true) &&
        (filterStatus ? user.status === filterStatus : true) &&
        (filterDepartment ? user.unit_or_branch?.department?.id == filterDepartment : true) &&
        (filterUnit ? user.unit_or_branch?.id == filterUnit : true) &&
        (filterJobTitle ? user.job_title?.id == filterJobTitle : true) &&
        (filterType ? user.unit_or_branch?.type === filterType : true)
      );

  const handleReset = () => {
    setFilterText('');
    setFilterStaffNumber('');
    setFilterStatus('');
    setFilterDepartment('');
    setFilterUnit('');
    setFilterJobTitle('');
    setFilterType('branch');
  };

  return {
    filteredUsers,
    filterProps: {
      filterText,
      setFilterText,
      filterStaffNumber,
      setFilterStaffNumber,
      filterStatus,
      setFilterStatus,
      filterDepartment,
      setFilterDepartment,
      filterUnit,
      setFilterUnit,
      filterJobTitle,
      setFilterJobTitle,
      filterType,
      setFilterType,
      handleReset,
    },
  };
};

export default useEmployeeFilters;