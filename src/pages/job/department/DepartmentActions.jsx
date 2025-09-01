import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';

const DepartmentActions = ({ department, onEdit, onDelete, onArchive }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(department)}
        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5"
      >
        <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
        <span>Edit</span>
        <span className="sr-only">Edit {department.name}</span>
      </button>
      <button
        onClick={() => onDelete(department)}
        className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5"
      >
        <TrashIcon className="h-5 w-5" aria-hidden="true" />
        <span>Delete</span>
        <span className="sr-only">Delete {department.name}</span>
      </button>
    </div>
  );
};

export default DepartmentActions;
