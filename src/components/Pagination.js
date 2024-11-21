import React from 'react';
import './Pagination.css'; // 버튼 스타일

const Pagination = ({ currentPage, totalPages, pagesPerGroup, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // totalPages가 1 이하인 경우 Pagination을 렌더링하지 않음
  }

  const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
  const startPage = currentGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={currentPage === i ? "active" : ""}
      >
        {i}
      </button>
    );
  }

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
      {pageButtons}
      {endPage < totalPages && (
        <button onClick={() => onPageChange(endPage + 1)}>
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
