import React, { useState, useEffect } from 'react';
import { Field, Label } from './FieldSet';
import { Input } from './Input';
import { Select } from './Select';
import Button from './Button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { Checkbox as CheckBox } from './CheckBox'; // Add missing import

const FilterBox = ({ title, filters, buttons, children }) => {
  // console.log('Rendering FilterBox with filters:', filters); // Log to confirm rendering

  // Centralized state for visibility of sensitive fields
  const [visibilityState, setVisibilityState] = useState({});

  const autoHideTimeout = 5000; // Auto-hide timeout in milliseconds

  useEffect(() => {
    const timers = Object.keys(visibilityState).map((fieldId) => {
      if (visibilityState[fieldId]) {
        return setTimeout(() => {
          setVisibilityState((prevState) => ({
            ...prevState,
            [fieldId]: false, // Auto-hide the field
          }));
          // console.log(`Auto-hid visibility for ${fieldId}`);
        }, autoHideTimeout);
      }
      return null;
    });

    return () => {
      timers.forEach((timer) => timer && clearTimeout(timer)); // Clear timers on cleanup
    };
  }, [visibilityState]);

  const toggleVisibility = (fieldId) => {
    setVisibilityState((prevState) => ({
      ...prevState,
      [fieldId]: !prevState[fieldId], // Toggle visibility for the specific field
    }));
    // console.log(`Toggled visibility for ${fieldId}:`, !visibilityState[fieldId]); // Log visibility toggle
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
      <h1 className="text-base font-semibold text-gray-900 pb-4">{title}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {filters.map((filter, index) => {
          // Ensure filter.value is a string before processing
          const stringValue = filter.value != null ? String(filter.value) : '';
          const isVisible = visibilityState[filter.id] || false; // Get visibility state for the field

          // Handle masking based on input type
          const processedValue = filter.sensitive
            ? isVisible
              ? stringValue // Show the actual value when unhidden
              : filter.type === 'text' || filter.type === 'password' // Only mask for text-like inputs
              ? stringValue.replace(/./g, '•') // Mask the value
              : '' // Fallback to an empty string for unsupported types
            : stringValue;

          // console.log(`Processed Value for ${filter.id}:`, processedValue); // Log processed value

          return (
            <Field key={index}>
              <Label htmlFor={filter.id}>{filter.label}</Label>
              {filter.type === 'select' ? (
                <Select
                  id={filter.id}
                  name={filter.id}
                  value={filter.value}
                  onChange={filter.onChange}
                  multiple={filter.multiple}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {filter.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : filter.type === 'checkbox' ? (
                <CheckBox
                  id={filter.id}
                  name={filter.id}
                  checked={filter.checked}
                  onChange={filter.onChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <div className="relative">
                  <Input
                    id={filter.id}
                    name={filter.id}
                    type={filter.type}
                    placeholder={filter.placeholder}
                    value={processedValue} // Pass the processed value
                    onChange={filter.onChange}
                    data-sensitive={filter.sensitive || undefined} // Add custom data attribute
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {filter.sensitive && filter.type === 'text' && ( // Only show toggle for text inputs
                    <button
                      type="button"
                      onClick={() => toggleVisibility(filter.id)} // Toggle visibility for the specific field
                      className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    >
                      {isVisible ? (
                        <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <EyeIcon className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </Field>
          );
        })}
      </div>
      {children}
      <div className="mt-4 flex justify-end space-x-2">
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant}
            type={button.type || 'button'} // Default to 'button' if type is not provided
            onClick={button.onClick}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterBox;


