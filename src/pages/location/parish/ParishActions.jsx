import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";

const ParishActions = ({ parish, onEdit, onDelete }) => {
  return (
    <>
      <button onClick={() => onEdit(parish)} className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer">
        <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
        <span>Edit</span>
        <span className="sr-only">, {parish.name}</span>
      </button>
      <button onClick={() => onDelete(parish)} className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer">
        <TrashIcon className="h-5 w-5" aria-hidden="true" />
        <span>Delete</span>
      </button>
    </>
  );
};

export default ParishActions;
