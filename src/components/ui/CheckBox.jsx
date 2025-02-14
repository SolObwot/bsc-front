import * as Headless from '@headlessui/react';
import { useState } from 'react';
import clsx from 'clsx';

export function Checkbox({ color = 'zinc', className, ...props }) {
  const [checked, setChecked] = useState(props.checked || false);

  return (
    <Headless.Checkbox
      data-slot="control"
      checked={checked}
      onChange={setChecked}
      {...props}
      className={clsx(
        className,
        'group inline-flex items-center justify-center border-2 rounded-md w-5 h-5',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        checked ? 'bg-blue-500 border-transparent' : 'bg-white border-gray-300'
      )}
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-white"
        >
          <path
            fillRule="evenodd"
            d="M20.25 5.25a.75.75 0 0 1 1.06 1.06l-10.5 10.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06L10 14.94l9.25-9.69z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </Headless.Checkbox>
  );
}

export function CheckboxField({ label, className, ...props }) {
  return (
    <label className={clsx('flex items-center gap-2', className)}>
      <Checkbox {...props} />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}

export function CheckboxGroup({ className, children, ...props }) {
  return (
    <Headless.CheckboxGroup {...props} className={clsx('space-y-2', className)}>
      {children}
    </Headless.CheckboxGroup>
  );
}
