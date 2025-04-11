import React from 'react';
import { PencilSquareIcon, TrashIcon, EyeIcon, DocumentDuplicateIcon } from '@heroicons/react/20/solid';

const TemplateActions = ({ template, onEdit, onDelete, onPreview, onCopy }) => {
  return (
    <>
      <button
        onClick={() => onEdit(template.id)}
        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer"
      >
        <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
        <span>Edit</span>
        <span className="sr-only">, {template.name}</span>
      </button>
      
      <button
        onClick={() => onPreview(template)}
        className="text-teal-600 hover:text-teal-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer"
      >
        <EyeIcon className="h-5 w-5" aria-hidden="true" />
        <span>Preview</span>
      </button>
      <button
        onClick={() => onCopy(template)}
        className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-x-1.5 cursor-pointer"
      >
        <DocumentDuplicateIcon className="h-5 w-5" aria-hidden="true" />
        <span>Make a Copy</span>
      </button>
      <button
        onClick={() => onDelete(template)}
        className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer"
      >
        <TrashIcon className="h-5 w-5" aria-hidden="true" />
        <span>Delete</span>
      </button>
    </>
  );
};

export default TemplateActions;
