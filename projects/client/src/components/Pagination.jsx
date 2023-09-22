import React from 'react';
import { Pagination } from 'flowbite-react';

const DefaultPagination = ({ currentPage, totalPages, onPageChange }) => {
  
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  const adjustedTotalPages = totalPages || 1;

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
