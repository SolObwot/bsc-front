import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/20/solid';
import { userService } from '../../services/user.service';
import FilterBox from '../ui/FilterBox';
import Button from '../ui/Button';
import { useToast } from "../../hooks/useToast";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../ui/Tables';
import DeleteUser from './DeleteUser';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      (user.first_name.toLowerCase().includes(filterText.toLowerCase()) ||
      user.last_name.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(filterText.toLowerCase()) ||
      user.title?.toLowerCase().includes(filterText.toLowerCase())) &&
      (filterRole ? user.role === filterRole : true) &&
      (filterStatus ? user.status === filterStatus : true)
    );
    setFilteredUsers(filtered);
  }, [filterText, filterRole, filterStatus, users]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
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
    setFilterRole('');
    setFilterStatus('');
  };

  const handleEdit = (id) => {
    navigate(`/admin/users/edit/${id}`);
  };

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (userToEdit) {
    return <UpdateUser user={userToEdit} onCancel={() => setUserToEdit(null)} />;
  }

  return (
    <div className="w-full p-4 mt-8">
      <FilterBox
        title="System Users"
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
            id: 'filterRole',
            label: 'User Role',
            type: 'select',
            value: filterRole,
            onChange: (e) => setFilterRole(e.target.value),
            options: [
              { value: '', label: '-- Select --' },
              { value: 'Admin', label: 'Admin' },
              { value: 'User', label: 'User' },
              // Add more roles as needed
            ],
          },
          {
            id: 'filterStatus',
            label: 'Status',
            type: 'select',
            value: filterStatus,
            onChange: (e) => setFilterStatus(e.target.value),
            options: [
              { value: '', label: '-- Select --' },
              { value: 'enabled', label: 'Enabled' },
              { value: 'disabled', label: 'Disabled' },
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

      <div className="bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Button
            type="button"
            variant="pride"
            className="flex items-center gap-2"
            onClick={() => navigate('/admin/user/add')}
          >
            <UserPlusIcon className="h-5 w-5" aria-hidden="true" />
            Add user
          </Button>
          <div className="flex items-center gap-2">
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

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Job Title</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>User Role</TableHeader>
              <TableHeader>Edit</TableHeader>
              <TableHeader>Delete</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user, userIdx) => (
              <TableRow key={user.email}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                <TableCell>{user.title || 'Employee Job Title'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role || 'System Role'}</TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleEdit(user.id)} 
                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5"
                  >
                    <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                    <span>Edit</span>
                    <span className="sr-only">, {`${user.first_name} ${user.last_name}`}</span>
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => setUserToDelete(user)} 
                    className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    <span>Delete</span>
                    <span className="sr-only">, {`${user.first_name} ${user.last_name}`}</span>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredUsers.length > recordsPerPage && (
          <div className="flex justify-center mt-4">
            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.ceil(filteredUsers.length / recordsPerPage) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500'} border border-gray-300 hover:bg-gray-50`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(filteredUsers.length / recordsPerPage)}
                className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
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