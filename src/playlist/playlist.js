import React, { useState } from 'react';
import './playlist.css';
import axios from 'axios';

function PlaylistModal({ onClose }) {
  const [playlistImage, setPlaylistImage] = useState(null);
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

  const MAX_EMPTY_ITEMS = 5;

  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
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
          params: { query: searchQuery },
        }
      );

      setSearchResults(response.data.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddBook = (book) => {
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPlaylistImage(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (playlistImage) {
      const formData = new FormData();
      formData.append('image', playlistImage);
  
      try {
        const response = await axios.post(
          'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/save',
          formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data.imageUrl; // 서버에서 반환하는 이미지 URL 또는 ID
      } catch (error) {
        console.error('Error uploading image:', error);
        return null;
      }
    }
    return null;
  };

  const handleEditTitle = () => {
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
  };

  const handleSavePlaylist = async () => {
    try {
      const createResponse = await axios.post(
        'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/create',
        null,
        { withCredentials: true }
      );
      const playlistId = Number(createResponse.data.playlistId);
  
      const imageUrl = await uploadImage();

      const playlistData = {
        playlistId, 
        title: playlistTitle,
        description: playlistDescription,
        isbns: bookList.map((book) => book.isbn),
        imageUrl,
      };
  
      await axios.post(
        'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/save',
        playlistData,
        { withCredentials: true }
      );
  
      alert('플레이리스트가 저장되었습니다.');
    } catch (error) {
      console.error(
        'Error saving playlist:',
        error.response ? error.response.data : error.message
      );
    }
  };
  return (
    <>
      {/* 첫 번째 모달 */}
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
                    placeholder="플레이리스트 제목"
                  />
                  <input
                    type="text"
                    value={playlistDescription}
                    onChange={(e) => setPlaylistDescription(e.target.value)}
                    placeholder="플레이리스트 설명"
                  />
                </div>
                <button onClick={handleSaveTitle} className='pltitlesave'>
                  <span className="material-symbols-outlined">check_circle</span>
                </button>
              </div>
            ) : (
              <div className='pledit1'>
                <div className='edittitle1'>
                  <h2>{playlistTitle || '플레이리스트 제목'}</h2>
                  <p>{playlistDescription || '플레이리스트 설명'}</p>
                </div>
                <button onClick={handleEditTitle}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
            )}
          </div>

          <div className="plimage">
            {playlistImage ? (
              <img
                src={URL.createObjectURL(playlistImage)}
                alt="플레이리스트 이미지"
                className="playlist-image"
              />
            ) : (
              <p></p>
            )}
            <button
              className="change-image-btn"
              onClick={() => document.getElementById('imageInput').click()}
            >
              사진변경
            </button>
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
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
            {bookList.length === 0 ? (
              // 책이 없을 때 빈 아이템 박스 5개 표시
              Array.from({ length: MAX_EMPTY_ITEMS }).map((_, index) => (
                <div key={index} className="book-item empty">
                  <div className="booktitle">
                    <h3>책이름 | 저자</h3>
                  </div>
                </div>
              ))
            ) : (
              // 책이 추가되면 추가된 책들만 표시
              bookList.map((book, index) => (
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* 두 번째 모달 */}
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
                placeholder="책 이름/저자를 검색해주세요!"
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
