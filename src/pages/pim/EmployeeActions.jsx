import React, { useState } from 'react';
import { PencilSquareIcon, TrashIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/20/solid';
import { useDispatch } from 'react-redux';
import { toggleUserLock } from '../../redux/userSlice';
import { useToast } from '../../hooks/useToast';

const EmployeeActions = ({ employee, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isLocking, setIsLocking] = useState(false);
  const handleLockToggle = async () => {
    try {
      setIsLocking(true);
      await dispatch(toggleUserLock({ 
        id: employee.id, 
        isActive: employee.is_active 
      })).unwrap();
      
      toast({
        title: "Success",
        description: employee.is_active 
          ? "User account has been locked successfully." 
          : "User account has been unlocked successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change user account status.",
        variant: "destructive",
      });
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit(employee.id)}
        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
        <span>Edit</span>
      </button>
      {/* <button
        onClick={() => onDelete(employee)}
        className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <TrashIcon className="h-5 w-5" aria-hidden="true" />
        <span>Delete</span>
      </button> */}
      <button
        onClick={handleLockToggle}
        disabled={isLocking}
        className={`inline-flex items-center gap-x-1.5 cursor-pointer ${
          isLocking ? 'opacity-50 cursor-not-allowed' : 
          employee.is_active ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'
        }`}
      >
        {employee.is_active ? (
          <>
            <LockClosedIcon className="h-5 w-5" aria-hidden="true" />
            <span>Lock</span>
          </>
        ) : (
          <>
            <LockOpenIcon className="h-5 w-5" aria-hidden="true" />
            <span>Unlock</span>
          </>
        )}
      </button>
    </div>
  );
};

export default EmployeeActions;