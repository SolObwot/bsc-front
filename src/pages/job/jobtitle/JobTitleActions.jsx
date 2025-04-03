import React from "react";
import { PencilSquareIcon, ArchiveBoxIcon } from "@heroicons/react/20/solid";

const JobTitleActions = ({ jobTitle, onEdit, onDelete, onArchive }) => {
  return (
    <>
      <button
        onClick={() => onEdit(jobTitle.id)}
        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer"
      >
        <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
        <span>Edit</span>
        <span className="sr-only">, {jobTitle.name}</span>
      </button>
      <button
        onClick={() => onDelete(jobTitle)}
        className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer"
      >
        <ArchiveBoxIcon className="h-5 w-5" aria-hidden="true" />
        <span>Delete</span>
      </button>
      <button
        onClick={() => onArchive(jobTitle)}
        className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <ArchiveBoxIcon className="h-5 w-5" aria-hidden="true" />
        <span>Archive</span>
      </button>
    </>
  );
};

export default JobTitleActions;
