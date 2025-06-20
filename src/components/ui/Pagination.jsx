import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  prevPageUrl = null,
  nextPageUrl = null,
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) pages.push(<span key="start-ellipsis" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">...</span>);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          aria-current={currentPage === i ? 'page' : undefined}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
            currentPage === i
              ? 'bg-teal-700 text-white'
              : 'bg-white text-gray-500'
          } border border-gray-300 hover:bg-gray-50`}
        >
          {i}
        </button>
      );
    }
    
    if (endPage < totalPages) pages.push(<span key="end-ellipsis" className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">...</span>);

    return pages;
  };

  return (
    <div className={`flex justify-center mt-4 ${className}`}>
      <nav
        className="inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <button
          onClick={() => prevPageUrl && onPageChange(currentPage - 1, prevPageUrl)}
          disabled={currentPage === 1 || !prevPageUrl}
          aria-label="Go to previous page"
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {previousLabel}
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => nextPageUrl && onPageChange(currentPage + 1, nextPageUrl)}
          disabled={currentPage === totalPages || !nextPageUrl}
          aria-label="Go to next page"
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {nextLabel}
        </button>
      </nav>
    </div>
  );
};

export default Pagination;