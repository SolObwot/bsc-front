import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";

const EmploymentStatusActions = ({ employmentStatus, onEdit, onDelete }) => (
  <div className="flex gap-2">
    <button
      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5"
      onClick={() => onEdit(employmentStatus)}
    >
      <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
      <span>Edit</span>
    </button>
    <button
      className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5"
      onClick={() => onDelete(employmentStatus)}
    >
      <TrashIcon className="h-5 w-5" aria-hidden="true" />
      <span>Delete</span>
    </button>
  </div>
);

export default EmploymentStatusActions;
