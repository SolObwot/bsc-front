'use client'

import React, { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { MagnifyingGlassIcon, CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

const actionOptions = [
  { title: 'Duplicate objectives', description: 'Create a copy of selected objectives' },
  { title: 'Export objectives', description: 'Export objectives to a downloadable format' },
];

const ObjectiveListHeader = () => {
  const [selectedAction, setSelectedAction] = useState(null);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-4 py-2 text-gray-500">
      <h2 className="font-semibold uppercase text-sm">Strategy Perspective List</h2>
      <div className="flex items-center mt-2 lg:mt-0 w-full lg:w-auto justify-between lg:justify-start">
        <div className="flex items-center mr-4">
          <span className="text-sm font-medium mr-2 ">Overall Weight:</span>
          <span className="text-sm font-semibold">90%</span>
        </div>
        <div className="flex items-center">
          {/* <button className="p-2 rounded-md bg-blue-100 hover:bg-gray-100 mr-2">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button> */}
          <div className="relative">
            <Listbox value={selectedAction} onChange={setSelectedAction}>
              <div className="relative">
                <div className="inline-flex divide-x divide-teal-700 rounded-md">
                  <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-teal-700 px-3 py-2 text-white">
                    <p className="text-sm font-semibold">Actions</p>
                  </div>
                  <ListboxButton className="inline-flex items-center rounded-l-none rounded-r-md bg-teal-700 p-2 hover:bg-teal-800 focus:outline-none">
                    <span className="sr-only">Select an action</span>
                    <ChevronDownIcon className="h-5 w-5 text-white" />
                  </ListboxButton>
                </div>

                <ListboxOptions className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white border border-gray-200 shadow-lg focus:outline-none">
                  {actionOptions.map((option) => (
                    <ListboxOption
                      key={option.title}
                      value={option}
                      className={({ active }) => 
                        `block w-full text-left px-4 py-2 text-sm ${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <div>
                          <span className={selected ? 'font-medium' : 'font-normal'}>
                            {option.title}
                          </span>
                        </div>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectiveListHeader;