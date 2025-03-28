import React from "react";

export const Table = ({ children, className }) => (
  <div className="overflow-x-auto md:overflow-x-visible">
    <table className={`min-w-full border-separate border-spacing-0 rounded-lg border border-gray-300 ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHead = ({ children }) => (
  <thead className="bg-[#08796c] text-white">{children}</thead>
);

export const TableHeader = ({ children, align = "left", className }) => (
  <th
    scope="col"
    className={`sticky top-0 z-10 border border-gray-300 py-3.5 px-4 text-${align} text-sm font-semibold whitespace-normal ${className}`}
  >
    {children}
  </th>
);

export const TableBody = ({ children, className }) => (
  <tbody className={`[&>*:nth-child(odd)]:bg-gray-50 ${className}`}>{children}</tbody>
);

export const TableRow = ({ children, onClick, className }) => (
  <tr
    onClick={onClick}
    className={`${onClick ? "cursor-pointer hover:bg-gray-100" : ""} ${className}`}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, align = "left", className, as = "td" }) => {
  const Component = as;
  return (
    <Component
      className={`border border-gray-300 py-4 px-4 text-sm font-normal whitespace-normal text-${align} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Table;