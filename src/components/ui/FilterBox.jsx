import React from 'react';
import { Field, Label } from './FieldSet';
import { Input } from './Input';
import { Select } from './Select';
import Button from './Button';

const FilterBox = ({ title, filters, buttons }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
      <h1 className="text-base font-semibold text-gray-900 pb-4">{title}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {filters.map((filter, index) => (
          <Field key={index}>
            <Label htmlFor={filter.id}>{filter.label}</Label>
            {filter.type === 'select' ? (
              <Select
                id={filter.id}
                value={filter.value}
                onChange={filter.onChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {filter.options.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id={filter.id}
                type={filter.type}
                placeholder={filter.placeholder}
                value={filter.value}
                onChange={filter.onChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            )}
          </Field>
        ))}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        {buttons.map((button, index) => (
          <Button key={index} variant={button.variant} onClick={button.onClick}>
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterBox;
