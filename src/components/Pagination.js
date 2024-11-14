import React from 'react';
import './Pagination.css'; // 버튼 스타일

const Pagination = ({ currentPage, totalPages, pagesPerGroup, onPageChange }) => {
  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => onPageChange(1)}>
          &laquo;
        </button>
      )}
      {startPage > 1 && (
        <button onClick={() => onPageChange(startPage - pagesPerGroup)}>
          &lt;
        </button>
      )}
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
        <button 
          key={index} 
          onClick={() => onPageChange(startPage + index)}
          className={currentPage === startPage + index ? "active" : ""}
        >
          {startPage + index}
        </button>
      ))}
      {endPage < totalPages && (
        <button onClick={() => onPageChange(startPage + pagesPerGroup)}>
          &gt;
        </button>
      )}
      {currentPage < totalPages && (
        <button onClick={() => onPageChange(totalPages)}>
          &raquo;
        </button>
      )}
    </div>
  );
};

export default Pagination;