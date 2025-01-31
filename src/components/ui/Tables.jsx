import React from 'react';

export const Table = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border-separate border-spacing-0 rounded-lg border border-gray-300">
      {children}
    </table>
  </div>
);

export const TableHead = ({ children }) => (
  <thead className="bg-green-600 text-white">
    {children}
  </thead>
);

export const TableHeader = ({ children }) => (
  <th className="sticky top-0 z-10 border border-gray-300 py-3.5 pr-3 pl-4 text-left text-sm font-semibold backdrop-blur-sm backdrop-filter sm:pl-6 lg:pl-8">
    {children}
  </th>
);

export const TableBody = ({ children }) => (
  <tbody>
    {children}
  </tbody>
);

export const TableRow = ({ children }) => (
  <tr>
    {children}
  </tr>
);

export const TableCell = ({ children, className }) => (
  <td className={`border border-gray-300 py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 lg:pl-8 ${className}`}>
    {children}
  </td>
);

export default Table;
