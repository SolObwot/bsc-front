import React, { useState, useEffect } from 'react';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/20/solid';
import { userService } from '../../services/user.service';
import FilterBox from '../ui/FilterBox';
import Button from '../ui/Button';
import { useToast } from "../../hooks/useToast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/AlertDialog';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../ui/Tables';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
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

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await userService.deleteUser(userToDelete.id);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setUserToDelete(null);
    }
  };

  const handleSearch = () => {
    // Implement search logic if needed
  };

  const handleReset = () => {
    setFilterText('');
    setFilterRole('');
    setFilterStatus('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
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
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <UserPlusIcon className="h-5 w-5" aria-hidden="true" />
            Add user
          </button>
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
              <TableHeader>Update</TableHeader>
              <TableHeader>Edit</TableHeader>
              <TableHeader>Delete</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, userIdx) => (
              <TableRow key={user.email}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                <TableCell>{user.title || 'Employee Job Title'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role || 'System Role'}</TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => {}} 
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-x-1.5"
                  >
                    <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
                    <span>Update</span>
                    <span className="sr-only">, {`${user.first_name} ${user.last_name}`}</span>
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => {}} 
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
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {userToDelete && ` ${userToDelete.first_name} ${userToDelete.last_name}`}
              's account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersList;