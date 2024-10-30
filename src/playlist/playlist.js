import React, { useState } from 'react';
import './playlist.css';
import axios from 'axios';

function PlaylistModal({ onClose }) {
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState({
    title: '책 제목',
    cover: null,
    publisher: '출판사',
    author: '지은이',
  });
  const [bookList, setBookList] = useState([]);

  // 최대 책 아이템 수
  const MAX_BOOK_ITEMS = 5;

  // State variables for playlist title and description
  const [playlistTitle, setPlaylistTitle] = useState('플레이리스트 제목');
  const [playlistDescription, setPlaylistDescription] = useState('플레이리스트 설명');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // State variable for playlist ID
  const [playlistId, setPlaylistId] = useState(null);

  const closeModal = () => {
    if (onClose) onClose();
  };

  const openSecondModal = () => {
    setIsSecondModalOpen(true);
  };

  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/search/books',
        {
          params: { query: searchQuery }, // query parameter
        }
      );

      setSearchResults(response.data.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddBook = (book) => {
    if (bookList.length >= MAX_BOOK_ITEMS) {
      alert('최대 5개의 책만 추가할 수 있습니다.');
      return;
    }
    const isbn = book.isbn || book.isbn13 || book.isbn10 || '';
    setBookList((prevBookList) => [
      ...prevBookList,
      {
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        cover: book.image,
        isbn: isbn,
      },
    ]);
  };

  const handleRemoveBook = (index) => {
    setBookList((prevBookList) =>
      prevBookList.filter((_, i) => i !== index)
    );
  };

  const handleBookClick = (book) => {
    setSelectedBook({
      title: book.title,
      cover: book.cover,
      author: book.author,
      publisher: book.publisher,
    });
  };

  // Function to handle editing playlist title and description
  const handleEditTitle = () => {
    setIsEditingTitle(true);
  };

  // Function to save edited title and description
  const handleSaveTitle = () => {
    setIsEditingTitle(false);
  };

  // Function to handle saving the playlist
  const handleSavePlaylist = async () => {
    try {
      // 플레이리스트 생성 요청을 쿼리 파라미터로 변경
      const createResponse = await axios.post(
        'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/create',
        null, // POST 요청의 본문은 비워둠
        {
          params: {
            title: playlistTitle,
            description: playlistDescription,
          },
          withCredentials: true,
        }
      );

      // playlistId를 숫자 타입으로 변환
      const newPlaylistId = Number(createResponse.data.playlistId);

      setPlaylistId(newPlaylistId);

      // 각 책을 플레이리스트에 추가
      for (const book of bookList) {
        await axios.post(
          'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/addBook',
          null, // POST 요청의 본문은 비워둠
          {
            params: {
              playlistId: newPlaylistId,
              isbn: book.isbn,
            },
            withCredentials: true,
          }
        );
      }

      // 모달 닫기 또는 성공 메시지 표시
      closeModal();
    } catch (error) {
      console.error(
        'Error saving playlist:',
        error.response ? error.response.data : error.message
      );
      // 에러 처리 (예: 에러 메시지 표시)
    }
  };

  return (
    <>
      {/* First Modal */}
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={closeModal}>
            닫기
          </button>

          <div className="plname">
            {isEditingTitle ? (
              <div className='pledit2'>
                <div className='edittitle2'>
                  <input
                    type="text"
                    value={playlistTitle}
                    onChange={(e) => setPlaylistTitle(e.target.value)}
                    placeholder="플레이리스트 제목을 입력하세요"
                  />
                  <input
                    type="text"
                    value={playlistDescription}
                    onChange={(e) => setPlaylistDescription(e.target.value)}
                    placeholder="플레이리스트 설명을 입력하세요"
                  />
                </div>
                <button onClick={handleSaveTitle} className='pltitlesave'>
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
            ) : (
              <div className='pledit1'>
                <div className='edittitle1'>
                  <h2>{playlistTitle}</h2>
                  <p>{playlistDescription}</p>
                </div>
                <button onClick={handleEditTitle}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
            )}
          </div>

          <div className="plimage">
            <p>사진</p>
          </div>

          <button className="pladd" onClick={openSecondModal}>
            +
          </button>

          <button className="plsave" onClick={handleSavePlaylist}>
            <span className="material-symbols-outlined">check</span>
            <p>저장</p>
          </button>

          <div className="book-cover-box">
            {selectedBook.cover ? (
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                className="selected-book-cover"
              />
            ) : (
              <p>책을 추가해보세요!</p>
            )}
          </div>

          <div className="book-choosetitle">
            <h2>{selectedBook.title}</h2>
            <p>
              {selectedBook.author}/{selectedBook.publisher}
            </p>
          </div>

          <div className="book-list">
            {Array.from({ length: MAX_BOOK_ITEMS }).map((_, index) => {
              const book = bookList[index];
              return book ? (
                <div
                  key={index}
                  className="book-item"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="book-info">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="book-mcover"
                    />
                    <div className="booktitle">
                      <h3>{book.title}</h3>
                      <p>
                        {book.author}/{book.publisher}
                      </p>
                    </div>
                    <button
                      className="remove-book-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBook(index);
                      }}
                    >
                      <span className='material-symbols-outlined'>delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                // 빈 책 아이템 자리 표시자
                <div key={index} className="book-item empty">
                  <div className="booktitle">
                   <h3>책이름 | 저자</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Second Modal */}
      {isSecondModalOpen && (
        <div className="modal-overlay" onClick={closeSecondModal}>
          <div
            className="second-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeSecondModal}>
              닫기
            </button>

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

            <div className="search-results">
              {searchResults.length === 0 ? (
                <p>검색 결과가 없습니다.</p>
              ) : (
                searchResults.map((book, index) => (
                  <div key={index}>
                    <div className="book-result">
                      <img
                        src={book.image}
                        className="result-book-cover"
                        alt={book.title}
                      />
                      <div className="result-title">
                        <h3>{book.title}</h3>
                        <p>
                          {book.author}/{book.publisher}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddBook(book)}
                        className="add-book-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mystudy">
              <p>내 서재</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PlaylistModal;
