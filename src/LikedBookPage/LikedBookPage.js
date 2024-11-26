// LikedBookPage.jsx
import React, { useState, useEffect } from 'react';
import './LikedBookPage.css'; // CSS 파일 임포트

const LikedBookPage = () => {
  const [books, setBooks] = useState([]); // 전체 책 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태
  const [likedBooks, setLikedBooks] = useState([]); // 찜한 책의 ISBN 목록
  const [likeLoading, setLikeLoading] = useState(null); // 찜하기 로딩 상태
  const [likeError, setLikeError] = useState(null); // 찜하기 오류 상태

  const booksPerPage = 25; // 한 페이지에 표시할 책 수
  const totalPages = Math.ceil(books.length / booksPerPage); // 전체 페이지 수

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/search/top-by-likes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // 현재 페이지에 표시할 책 데이터 계산
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // 찜하기 핸들러 함수
  const handleLike = async (isbn) => {
    // 이미 찜한 책인지 확인
    if (likedBooks.includes(isbn)) {
      alert('이미 찜한 책입니다.');
      return;
    }

    setLikeLoading(isbn);
    setLikeError(null);

    try {
      const response = await fetch('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/booklikes/mainpage/like-by-isbn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isbn }),
      });

      if (!response.ok) {
        throw new Error(`찜하기 실패! 상태 코드: ${response.status}`);
      }

      // 성공적으로 찜하기 완료 시 상태 업데이트
      setLikedBooks((prev) => [...prev, isbn]);

      // 로컬 상태의 likeCount 증가
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.isbn === isbn ? { ...book, likeCount: book.likeCount + 1 } : book
        )
      );
    } catch (err) {
      setLikeError(err.message || '찜하기 중 오류가 발생했습니다.');
    } finally {
      setLikeLoading(null);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 페이지 변경 시 스크롤을 맨 위로
  };

  // 페이지네이션 버튼 생성
  const renderPagination = () => {
    const pages = [];

    // 이전 페이지 버튼
    pages.push(
      <div className='beforepage-button' key="prev-container">
        <button
          key="prev"
          className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className='material-symbols-outlined'>Chevron_Left</span>
        </button>
      </div>
    );

    // 페이지 번호 버튼 (여기서는 1~totalPages 모두 표시)
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // 다음 페이지 버튼
    pages.push(
      <div className='nextpage-button' key="next-container">
        <button
          key="next"
          className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className='material-symbols-outlined'>Chevron_Right</span>
        </button>
      </div>
    );

    return pages;
  };

  return (
    <div className="liked-book-page">
      <h1>책 둘러보기</h1>

      {loading && (
        <div className="liked-bookpage-loadingbox">
          <div className="mypage-loader"></div>
          <p>불러오는 중...</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}

      {likeError && <p className="error">찜하기 오류: {likeError}</p>}

      {!loading && !error && (
        <>
          <div className="likedbookpage-book-grid">
            {currentBooks.map((book) => (
              <div key={book.id} className="likedbookpage-book-card">
                <img src={book.image} alt={book.title} className="likedbookpage-book-image" />
                <h3 className="likedbookpage-book-title">{book.title}</h3>
                <p className="likedbookpage-book-author">
                  {book.author}/{book.publisher}
                </p>
                <p
                  className={`likedbookpage-book-like ${likedBooks.includes(book.isbn) ? 'liked' : ''}`}
                  onClick={() => handleLike(book.isbn)}
                  style={{ cursor: 'pointer' }}
                >
                  ❤️ {book.likeCount}
                  {likeLoading === book.isbn && <span className="like-loading">...</span>}
                </p>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="pagination">{renderPagination()}</div>
          )}
        </>
      )}
    </div>
  );
};

export default LikedBookPage;