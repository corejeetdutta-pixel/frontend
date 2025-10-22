import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  resultsCount,
  resultsPerPage
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * resultsPerPage + 1;
  const endItem = Math.min(currentPage * resultsPerPage, resultsCount);

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {resultsCount} results
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded flex items-center ${
            currentPage === 1 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-white text-blue-600 hover:bg-blue-50'
          }`}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        
        <div className="flex">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => onPageChange(idx + 1)}
              className={`px-3 py-1 border ${
                currentPage === idx + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              } ${idx === 0 ? 'rounded-l' : ''} ${idx === totalPages - 1 ? 'rounded-r' : ''}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded flex items-center ${
            currentPage === totalPages 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-white text-blue-600 hover:bg-blue-50'
          }`}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;