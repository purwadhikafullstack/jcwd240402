import React from 'react';
import { Pagination } from 'flowbite-react';

const DefaultPagination = ({ currentPage, totalPages, onPageChange }) => {
  
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const adjustedTotalPages = totalPages || 1;
  
  if (currentPage > adjustedTotalPages && adjustedTotalPages > 1) {
    onPageChange(adjustedTotalPages);
  }

  return (
    <div className='shadow-lg'>
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        showIcons
        totalPages={adjustedTotalPages}
      />
    </div>
  );
};

export default DefaultPagination;
