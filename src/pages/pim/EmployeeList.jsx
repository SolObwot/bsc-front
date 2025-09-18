import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../../redux/userSlice';
import { fetchDepartments } from '../../redux/departmentSlice';
import { fetchJobTitles } from '../../redux/jobTitleSlice';
import { fetchUnitOrBranches } from '../../redux/unitOrBranchSlice';
import FilterBox from '../../components/ui/FilterBox';
import { useToast } from "../../hooks/useToast";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader, TableSkeleton } from '../../components/ui/Tables';
import DeleteUser from '../../components/users/DeleteUser';
import EmailTruncator from '../../components/ui/EmailTruncator';
import Pagination from '../../components/ui/Pagination';
import EmployeeToolbar from './EmployeeToolbar';
import EmployeeActions from './EmployeeActions';
import useEmployeeFilters from '../../hooks/emplyeeList/useEmployeeFilters';
import useEmployeePagination from '../../hooks/emplyeeList/useEmployeetPagination';

const UsersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allUsers = [], loading, error } = useSelector((state) => state.users || {});
  const { allDepartments = [] } = useSelector((state) => state.departments || {});
  const { allJobTitles = [] } = useSelector((state) => state.jobTitles || {});
  const { allUnitOrBranches = [] } = useSelector((state) => state.unitOrBranches || {});
  const { toast } = useToast();
  const [userToDelete, setUserToDelete] = React.useState(null);

  const { filteredUsers, filterProps } = useEmployeeFilters(allUsers);
  const { paginatedUsers, paginationProps } = useEmployeePagination(filteredUsers);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDepartments());
    dispatch(fetchJobTitles());
    dispatch(fetchUnitOrBranches());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleEdit = (id) => {
    navigate(`/pim/employees/profile/${id}`);
  };

  const handleDeleteSuccess = (userId) => {
    // Since no delete action in Redux yet, refetch
    dispatch(fetchUsers());
  };

  const showType = filterProps.filterType || 'branch'; // Default to branch

  const unitOptions = filterProps.filterType === 'branch' 
    ? allUnitOrBranches.filter(u => u.type === 'branch') 
    : filterProps.filterType === 'unit' 
    ? allUnitOrBranches.filter(u => u.type === 'unit') 
    : allUnitOrBranches;

  const showDepartmentFilter = filterProps.filterType === 'unit';
  const filters = [
    {
      id: 'filterText',
      label: 'Employee Name',
      type: 'search',
      placeholder: 'Type for employees name...',
      value: filterProps.filterText,
      onChange: (e) => filterProps.setFilterText(e.target.value),
    },
    {
      id: 'filterStaffNumber',
      label: 'Staff Number',
      type: 'search',
      placeholder: 'Type for staff number...',
      value: filterProps.filterStaffNumber,
      onChange: (e) => filterProps.setFilterStaffNumber(e.target.value),
    },
    {
      id: 'filterType',
      label: 'Type',
      type: 'select',
      value: filterProps.filterType || 'branch',
      onChange: (e) => filterProps.setFilterType(e.target.value),
      options: [
        { value: 'branch', label: 'Branch' },
        { value: 'unit', label: 'Unit' },
      ],
    },
    ...(showDepartmentFilter ? [{
      id: 'filterDepartment',
      label: 'Department',
      type: 'select',
      value: filterProps.filterDepartment,
      onChange: (e) => filterProps.setFilterDepartment(e.target.value),
      options: [
        { value: '', label: '-- Select --' },
        ...allDepartments.map(dept => ({ value: dept.id, label: dept.name })),
      ],
    }] : []),
    {      id: 'filterUnit',
      label: showType === 'branch' ? 'Branch' : 'Unit',
      type: 'select',
      value: filterProps.filterUnit,
      onChange: (e) => filterProps.setFilterUnit(e.target.value),
      options: [
        { value: '', label: '-- Select --' },
        ...unitOptions.map(unit => ({ value: unit.id, label: unit.name })),
      ],
    },
    {
      id: 'filterJobTitle',
      label: 'Job Title',
      type: 'select',
      value: filterProps.filterJobTitle,
      onChange: (e) => filterProps.setFilterJobTitle(e.target.value),
      options: [
        { value: '', label: '-- Select --' },
        ...allJobTitles.map(job => ({ value: job.id, label: job.name })),
      ],
    },
  ];

  return (
    <div className="w-full p-4 mt-8">
      <FilterBox
        title="Employee List"
        filters={filters}
        buttons={[
          {
            label: 'Reset',
            variant: 'secondary',
            onClick: filterProps.handleReset,
          },
        ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <EmployeeToolbar
          onAddEmployee={() => navigate('/pim/employees/add')}
          recordsPerPage={paginationProps.recordsPerPage}
          onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
          totalRecords={filteredUsers.length}
        />

        {loading ? (
          <TableSkeleton
            rows={8}
            columns={showType === 'unit' ? 7 : 6}
            columnWidths={showType === 'unit' ? ['10%', '20%', '15%', '15%', '15%', '15%', '10%'] : ['10%', '20%', '15%', '15%', '15%', '15%']}
          />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Staff No</TableHeader>
                  <TableHeader>Name</TableHeader>
                  {showType === 'unit' && <TableHeader>Department</TableHeader>}
                  <TableHeader>Unit/Branch</TableHeader>
                  <TableHeader>Job Title</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showType === 'unit' ? 7 : 6} className="text-center py-8 text-gray-500">
                      No Employees found. Click "Add New Employee" to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1 whitespace-normal">
                          <span>{user.staff_number}</span>
                          {user.staffType && (
                            <span className="ml-0 px-1.5 py-0.5 text-xs font-medium rounded-full max-w-fit
                              bg-blue-100 text-blue-800">
                              {user.staffType}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 whitespace-normal">
                          <span>
                            {`${user.surname} ${user.first_name}${user.other_name ? ` ${user.other_name}` : ''}`}
                          </span>
                          {user.employmentCategory && (
                            <span className="ml-0 px-1.5 py-0.5 text-xs font-medium rounded-full max-w-fit bg-blue-100 text-blue-800 capitalize">
                              {user.employmentCategory}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      {showType === 'unit' && (
                        <TableCell title={user.fullDepartment}>
                          <div className="flex flex-col gap-1 whitespace-normal">
                            <span>{user.department || 'Set Department'}</span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell title={user.fullUnit}>
                        <div className="flex flex-col gap-1 whitespace-normal">
                          <span>{user.unit || 'Set Unit'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 whitespace-normal">
                          <span>{user.jobTitle}</span>
                          <span className={`ml-0 px-1.5 py-0.5 text-xs font-medium rounded-full max-w-fit ${user.isProbation ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {user.isProbation ? 'Probation' : 'Confirmed'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 whitespace-normal">
                          <span>{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <EmployeeActions
                          employee={user}
                          onEdit={handleEdit}
                          onDelete={setUserToDelete}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <Pagination
              currentPage={paginationProps.currentPage}
              totalPages={paginationProps.totalPages}
              onPageChange={paginationProps.handlePageChange}
              className="mt-4"
            />
          </>
        )}
      </div>

      <DeleteUser
        userToDelete={userToDelete}
        setUserToDelete={setUserToDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default UsersList;