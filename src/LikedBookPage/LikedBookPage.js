import React, { useState, useEffect } from 'react';
import './LikedBookPage.css';
import { useNavigate } from 'react-router-dom';

const LikedBookPage = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // 페이지 로딩 상태
  const [error, setError] = useState(null);
  const [likedBooks, setLikedBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState({}); // Loading 상태를 책별로 관리
  const [likeError, setLikeError] = useState(null);
  const navigate = useNavigate();
  
  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  const booksPerPage = 25;
  const totalPages = Math.ceil(books.length / booksPerPage);
  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const storedLikedBooks = JSON.parse(localStorage.getItem('likedBooks')) || [];
    setLikedBooks(storedLikedBooks);

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

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const handleLike = async (isbn) => {
    if (!isbn) {
      console.error('ISBN 값이 없습니다!');
      return;
    }

    if (likedBooks.includes(isbn)) {
      alert('이미 찜한 책입니다.');
      return;
    }

    setLoadingBooks((prev) => ({ ...prev, [isbn]: true })); // 해당 책에 대해 로딩 시작
    setLikeError(null);
    const token = getToken();
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      setLoadingBooks((prev) => ({ ...prev, [isbn]: false })); // 로딩 종료
      return;
    }

    const requestBody = { isbn };

    try {
      const checkResponse = await fetch(`https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${isbn}/isLiked`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!checkResponse.ok) {
        throw new Error('찜 여부 확인 실패');
      }

      const checkData = await checkResponse.json();

      if (checkData) {
        alert('이미 찜한 책입니다.');
        setLoadingBooks((prev) => ({ ...prev, [isbn]: false })); // 로딩 종료
        return;
      }

      const response = await fetch('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/booklikes/mainpage/like-by-isbn', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`찜하기 실패! 상태 코드: ${response.status}`);
      }

      // 책의 likeCount를 +1 증가시키기
      const updatedBooks = books.map((book) => {
        if (book.isbn === isbn) {
          return { ...book, likeCount: book.likeCount + 1 }; // likeCount 업데이트
        }
        return book;
      });

      setBooks(updatedBooks); // 업데이트된 책 데이터 설정

      setLikedBooks((prevLikedBooks) => {
        const updatedLikedBooks = [...prevLikedBooks, isbn];
        localStorage.setItem('likedBooks', JSON.stringify(updatedLikedBooks));
        return updatedLikedBooks;
      });

      alert('찜되었습니다!');
    } catch (err) {
      setLikeError(err.message || '찜하기 중 오류가 발생했습니다.');
    } finally {
      setLoadingBooks((prev) => ({ ...prev, [isbn]: false })); // 로딩 종료
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    const pages = [];
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
                <img
                  src={book.image}
                  alt={book.title}
                  className="likedbookpage-book-image"
                  onClick={() => handleBookClick(book)}
                />
                <h3
                  className="likedbookpage-book-title"
                  onClick={() => handleBookClick(book)}
                >
                  {book.title}
                </h3>
                <p className="likedbookpage-book-author">
                  {book.author}/{book.publisher}
                </p>
                <div className="likedbookpage-likecount">
                  <p
                    className={`likedbookpage-book-like ${likedBooks.includes(book.isbn) ? "liked" : ""}`}
                    onClick={() => handleLike(book.isbn)}
                    style={{ cursor: "pointer" }}
                  >
                    ❤️ 
                    {loadingBooks[book.isbn] ? ( // 로딩 중인 책에 대해서만 로딩 표시
                      <div className="likedbookpage-likecount-loader"></div>
                    ) : (
                      <span className="playlist-plcount-after-p">{book.likeCount}</span> // likeCount 표시
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">{renderPagination()}</div>
          )}
        </>
      )}
    </div>
  );
};

export default LikedBookPage;
