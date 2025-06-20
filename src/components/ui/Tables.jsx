import React from "react";

export const Table = ({ children, className }) => (
  <div className="overflow-x-auto md:overflow-x-visible">
    <table className={`min-w-full border-separate border-spacing-0 rounded-lg border border-gray-300 ${className}`}>
      {children}
    </table>
  </div>
);

export const TableSkeleton = ({ 
  rows = 5, 
  columns = 5, 
  headerEnabled = true,
  columnWidths = [],
  columnNames = []
}) => {
  // Default column widths if not provided
  const defaultColumnWidths = ['25%', '15%', '20%', '20%', '20%'];
  const widths = columnWidths.length > 0 ? columnWidths : defaultColumnWidths;
  
  return (
    <div className="overflow-x-auto md:overflow-x-visible">
      <table className="min-w-full border-separate border-spacing-0 rounded-lg border border-gray-300">
        {headerEnabled && (
          <thead className="bg-[#08796c] text-white animate-pulse">
             <tr>
              {Array(columns).fill().map((_, i) => (
                <th key={`header-${i}`} className="border border-gray-300 py-3.5 px-4 text-sm font-semibold">
                  {columnNames[i] || (
                    <div 
                      className="h-5 bg-gray-300 opacity-70 rounded animate-pulse" 
                      style={{ width: widths[i] || defaultColumnWidths[i % defaultColumnWidths.length] }}
                    ></div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="animate-pulse">
          {Array(rows).fill().map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`} className={rowIndex % 2 === 0 ? 'bg-gray-50' : ''}>
              {Array(columns).fill().map((_, colIndex) => (
                <td key={`cell-${rowIndex}-${colIndex}`} className="border border-gray-300 py-4 px-4">
                  <div 
                    className="h-4 bg-gray-200 rounded" 
                    style={{ width: widths[colIndex] || defaultColumnWidths[colIndex % defaultColumnWidths.length] }}
                  ></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

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