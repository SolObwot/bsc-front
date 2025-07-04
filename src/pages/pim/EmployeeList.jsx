import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon, TrashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/20/solid';
import { userService } from '../../services/user.service';
import FilterBox from '../../components/ui/FilterBox';
import Button from '../../components/ui/Button';
import { useToast } from "../../hooks/useToast";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader, TableSkeleton } from '../../components/ui/Tables';
import DeleteUser from '../../components/users/DeleteUser';
import EmailTruncator from '../../components/ui/EmailTruncator'; 
import Pagination from '../../components/ui/Pagination'; 

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [employeeToLock, setEmployeeToLock] = useState(null);
  const [employeeToUnlock, setEmployeeToUnlock] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [filterStaffNumber, setFilterStaffNumber] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterJobTitle, setFilterJobTitle] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      (user.surname?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.title?.toLowerCase().includes(filterText.toLowerCase())) &&
      (filterStaffNumber ? user.staff_number?.toLowerCase().includes(filterStaffNumber.toLowerCase()) : true) &&
      (filterRole ? user.role === filterRole : true) &&
      (filterStatus ? user.status === filterStatus : true)
    );
    setFilteredUsers(filtered);
  }, [filterText, filterStaffNumber, filterRole, filterStatus, users]);

  const truncateText = (text, showChars = 10, suffix = '...') => {
    if (!text) return 'N/A';
    return text.length > showChars ? `${text.slice(0, showChars)}${suffix}` : text;
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      // Filter out users who have the 'employee' role or have an empty roles array
      const EmployeeUsers = response.data.filter(user => 
        user.roles.some(role => role.name === 'employee') || user.roles.length === 0
      ).map(user => {
        const department = truncateText(user.unit_or_branch?.department?.name);
        const unit = truncateText(user.unit_or_branch?.name);
        return {
          ...user,
          department,
          unit,
          fullDepartment: user.unit_or_branch?.department?.name || 'N/A',
          fullUnit: user.unit_or_branch?.name || 'N/A'
        };
      });
      setUsers(EmployeeUsers);
      setFilteredUsers(EmployeeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuccess = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
  };

  const handleSearch = () => {
    // Implement search logic if needed
  };

  const handleReset = () => {
    setFilterText('');
    setFilterStaffNumber('');
    setFilterRole('');
    setFilterStatus('');
  };

  const handleEdit = (id) => {
    navigate(`/pim/employees/profile/${id}`);
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);


  if (userToEdit) {
    return <UpdateUser user={userToEdit} onCancel={() => setUserToEdit(null)} />;
  }

  return (
    <div className="w-full p-4 mt-8">
      <FilterBox
        title="Employee List"
        filters={[
          {
            id: 'filterText',
            label: 'Employee Name',
            type: 'search',
            placeholder: 'Type for employees name...',
            value: filterText,
            onChange: (e) => setFilterText(e.target.value),
          },
          {
            id: 'filterStaffNumber',
            label: 'Staff Number',
            type: 'search',
            placeholder: 'Type for staff number...',
            value: filterStaffNumber,
            onChange: (e) => setFilterStaffNumber(e.target.value),
          },
          {
            id: 'filterStatus',
            label: 'Employment Status',
            type: 'select',
            value: filterStatus,
            onChange: (e) => setFilterStatus(e.target.value),
            options: [
              { value: '', label: '-- Select --' },
              { value: 'enabled', label: 'Probation' },
              { value: 'disabled', label: 'Contract' },
              { value: 'disabled', label: 'Permanent' },
              { value: 'disabled', label: 'Terminated' },
            ],
          },
         
          {
            id: 'filterDepartment',
            label: 'Department',
            type: 'select',
            // value: filterDepartment,
            onChange: (e) => setFilterDepartment(e.target.value),
            options: [
              { value: '', label: '-- Select --' },
              { value: 'People and Culture', label: 'People and Culture' },
              { value: 'BT', label: 'BT' },
              { value: 'Risk', label: 'Risk' },
            ],
          },


          {
            id: 'filterUnit',
            label: 'Unit',
            type: 'select',
            // value: filterRole,
            // onChange: (e) => setFilterRole(e.target.value),
            options: [
              { value: '', label: '-- Select --' },
              { value: 'Innovation', label: 'Innovation' },
              { value: 'e Banking', label: 'e Banking' },
              { value: 'Infrastruture', label: 'Infrastruture' },

              // Add more roles as needed
            ],
          },

          {
            id: 'filterJobTitle',
            label: 'Job Title',
            type: 'select',
            options: [
              { value: '', label: '-- Select --' },
              { value: 'HBT', label: 'HBT' },
              { value: 'Software Developer', label: 'Software Developer' },
              { value: 'Cashier', label: 'Cashier' },
            ],
          },

        ]}
        buttons={[
          {
            label: 'Search',
            variant: 'pride',
            onClick: handleSearch,
          },
          {
            label: 'Reset',
            variant: 'secondary',
            onClick: handleReset,
          },
        ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-4">
          <Button
            type="button"
            variant="pride"
            className="flex items-center gap-2 mb-4 sm:mb-0"
            onClick={() => navigate('/pim/employees/add')}
          >
            <UserPlusIcon className="h-5 w-5" aria-hidden="true" />
            Add New Employee
          </Button>
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <label htmlFor="recordsPerPage" className="text-sm text-gray-700">Records per page:</label>
            <select
              id="recordsPerPage"
              value={recordsPerPage}
              onChange={handleRecordsPerPageChange}
              className="border border-gray-300 rounded-md p-1"
            >
              {[5, 10, 15, 20, 50].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <span className="text-sm text-gray-700">
            {filteredUsers.length > 0 ? `(${filteredUsers.length}) Records Found` : 'No Records Found'}
          </span>
        </div>

        {loading ? (
          <TableSkeleton 
            rows={8} 
            columns={7} 
            columnWidths={['10%', '20%', '15%', '15%', '15%', '15%', '10%']} 
          />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Staff Number</TableHeader>
                  <TableHeader>Display Name</TableHeader>
                  <TableHeader>Department</TableHeader>
                  <TableHeader>Unit/Branch</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Lock/Unlock</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>{user.staff_number}</TableCell>
                    <TableCell>{`${user.surname} ${user.last_name}`}</TableCell>
                    <TableCell title={user.fullDepartment}>{user.department || 'Set Department'}</TableCell>
                    <TableCell title={user.fullUnit}>{user.unit || 'Set Unit'}</TableCell>
                    <TableCell>
                      <EmailTruncator email={user.email} showChars={8} />
                    </TableCell>
                    <TableCell>
                      <button 
                        onClick={() => setEmployeeToLock(user)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer">
                        <LockClosedIcon className="h-5 w-5" aria-hidden="true" />
                        <span>Lock</span>
                      </button>
                      <button 
                        onClick={() => setEmployeeToUnlock(user)}
                        className="text-green-600 hover:text-green-900 inline-flex items-center gap-x-1.5 cursor-pointer">
                        <LockOpenIcon className="h-5 w-5" aria-hidden="true" />
                        <span>Unlock</span>
                      </button>
                    </TableCell>
                    <TableCell>
                      <button 
                        onClick={() => handleEdit(user.id)} 
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer"
                      >
                        <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                        <span>Edit</span>
                        <span className="sr-only">, {`${user.surname} ${user.last_name}`}</span>
                      </button>
                      <button 
                        onClick={() => setUserToDelete(user)} 
                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5 cursor-pointer"
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        <span>Delete</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredUsers.length / recordsPerPage)}
              onPageChange={handlePageChange}
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