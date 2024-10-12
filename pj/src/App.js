import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function Button() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  // 검색어 상태
  const [searchResults, setSearchResults] = useState([]);  // 검색 결과 상태
  const [selectedBook, setSelectedBook] = useState({ title: '책 제목', cover: null, publisher: '출판사',author:'지은이' });  // 선택된 책 상태 (기본값으로 초기화)
  const [bookList, setBookList] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSecondModal = () => {
    setIsSecondModalOpen(true);
  };

  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/search/books`, {
        params: { query: searchQuery },  // query 파라미터 전달
      });

      setSearchResults(response.data.items);  // response.data에서 items를 가져옴
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddBook = (book) => {
    setBookList((prevBookList) => [
      ...prevBookList,
      {
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        cover: book.image
      }
    ]);
  };

  const handleBookClick = (book) => {
    setSelectedBook({
      title: book.title,
      cover: book.cover,
      author: book.author,
      publisher: book.publisher
    });
  };

  return (
    <div className='btd'>
      <button className='plbt' onClick={openModal}>플레이리스트</button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className='pladd' onClick={openSecondModal}>+</button>

            <div className="book-cover-box">
              {selectedBook.cover ? (
                <img src={selectedBook.cover} alt={selectedBook.title} className="selected-book-cover" />
              ) : (
                <p>책을 추가해보세요!</p>  
              )}
            </div>
            <div className='book-choosetitle'>
              <h2>{selectedBook.title}</h2>
              <p>{selectedBook.author}/{selectedBook.publisher}</p> 
            </div>
            <button className="close-btn" onClick={closeModal}>닫기</button>
            <div className="book-list">
              {bookList.map((book, index) => (
                <div key={index} className="book-item" onClick={() => handleBookClick(book)}>
                  <div className="book-info">
                    <img src={book.cover} alt={book.title} className="book-mcover" />
                    <div className='booktitle'>
                      <h3>{book.title}</h3>
                      <p>{book.author}/{book.publisher}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isSecondModalOpen && (
        <div className="modal-overlay" onClick={closeSecondModal}>
          <div className="second-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="search-box">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="책 이름을 검색해주세요!"
              />
              <button onClick={handleSearch}>
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
            <style>
              {`
                .material-symbols-outlined {
                  font-variation-settings:
                  'FILL' 0,
                  'wght' 400,
                  'GRAD' 0,
                  'opsz' 24;
                }
              `}
            </style>
            <button className="close-btn" onClick={closeSecondModal}>닫기</button>

            <div className="search-results">
              {searchResults.length === 0 ? (
                <p>검색 결과가 없습니다.</p>
              ) : (
                searchResults.map((book, index) => (
                  <div key={index}>
                    <div className="book-result">
                      <img src={book.image} className="result-book-cover" />
                      <div className='result-title'>
                        <h3>{book.title}</h3>
                        <p>{book.author}/{book.publisher}</p>
                      </div>
                      <button onClick={() => handleAddBook(book)} className="add-book-btn">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='mystudy'>
              <p>내 서재</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Button;