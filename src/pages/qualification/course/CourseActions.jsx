import React from 'react';
import { PencilSquareIcon, ArchiveBoxIcon } from '@heroicons/react/20/solid';

const CourseActions = ({ 
  course, 
  onEdit, 
  onDelete, 
  onArchive 
}) => {
  return (
    <>
      <button 
        onClick={() => onEdit(course.id)} 
        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer"
      >
        <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
        <span>Edit</span>
        <span className="sr-only">, {course.name}</span>
      </button>
      <button 
        onClick={() => onDelete(course)} 
        className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer"
      >
        <ArchiveBoxIcon className="h-5 w-5" aria-hidden="true" />
        <span>Delete</span>
      </button>
      <button 
        onClick={() => onArchive(course)} 
        className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <ArchiveBoxIcon className="h-5 w-5" aria-hidden="true" />
        <span>Archive</span>
      </button>
    </>
  );
};

export default CourseActions;