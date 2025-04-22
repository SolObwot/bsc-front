'use client'

import React, { useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const perspectiveOptions = [
  { name: 'Annual Review' },
  { name: 'Mid Term Review' },
  { name: 'Probation 6 months' }
];

const ObjectiveHeader = () => {
  const [selectedPerspective, setSelectedPerspective] = useState(perspectiveOptions[0]);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full p-4 bg-[#08796c] text-white mt-8 rounded-t-lg">
      <div className="flex items-center">
        <Listbox value={selectedPerspective} onChange={setSelectedPerspective}>
          <div className="relative">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold mr-1">{selectedPerspective.name}</h1>
              <ListboxButton className="focus:outline-none">
                <ChevronDownIcon className="h-5 w-5 text-white hover:text-gray-200" />
              </ListboxButton>
            </div>

            <ListboxOptions className="absolute z-10 mt-1 w-56 origin-top-left rounded-md bg-white border border-gray-200 shadow-lg focus:outline-none">
              {perspectiveOptions.map((option) => (
                <ListboxOption
                  key={option.name}
                  value={option}
                  className={({ active }) => 
                    `block w-full text-left px-4 py-2 text-sm ${
                      active ? 'bg-teal-100 text-teal-900' : 'text-gray-700'
                    }`
                  }
                >
                  {({ selected }) => (
                    <span className={selected ? 'font-medium' : 'font-normal'}>
                      {option.name}
                    </span>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
      <div className="text-sm mt-2 lg:mt-0">
        Current Performance Framework: <span className="font-bold">BALANCED SCORECARD</span>
      </div>
    </div>
  );
};

export default ObjectiveHeader;
