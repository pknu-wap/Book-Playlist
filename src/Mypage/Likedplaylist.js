import React, { useState, useEffect } from 'react';
import './Mypageplaylist.css';
import axios from 'axios';


function LikedPlaylistModal({ onClose, playlistId }) {;
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedBook, setSelectedBook] = useState({
    title: '책 제목',
    cover: null,
    publisher: '출판사',
    author: '지은이',
  });
  const [bookList, setBookList] = useState([]);

  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // 모달 닫기 함수
  const closeModal = () => {
    if (onClose) onClose();
  };

  // 책 클릭 시 상세 정보 표시 함수
  const handleBookClick = (book) => {
    setSelectedBook({
      title: book.title,
      cover: book.image,
      author: book.author,
      publisher: book.publisher,
    });
  };

  

  // 제목 저장 함수
  const handleSaveTitle = () => {
    setIsEditingTitle(false);
  };

  // 플레이리스트 데이터 가져오기
  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const response = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/${playlistId}`,
          { withCredentials: true }
        );
        if (response.data) {
          setPlaylistTitle(response.data.title || '');
          setPlaylistDescription(response.data.description || '');
          setBookList(response.data.books || []);

          if (response.data.books && response.data.books.length > 0) {
            const firstBook = response.data.books[0];
            setSelectedBook({
              title: firstBook.title || '책 제목',
              cover: firstBook.image || null,
              author: firstBook.author || '지은이',
              publisher: firstBook.publisher || '출판사',
            });
          }

          if (response.data.base64Image) {
            setPreviewUrl(`data:image/jpeg;base64,${response.data.base64Image}`);
          }
        }
      } catch (error) {
        console.error('Error fetching playlist data:', error);
      } finally {
        setIsLoading(false);
      }

    };

    if (playlistId) {
      fetchPlaylistData();
    }
  }, [playlistId]);

  


  
  return (
    <>
      {/* 첫 번째 모달 */}
      <div className="playlist-modal-overlay" onClick={closeModal}>
        <div className="playlist-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="playlist-close-btn" onClick={closeModal}>
            닫기
          </button>
          <div className='playlist-playlist-header'>
            <div className="playlist-plimage">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="플레이리스트 이미지"
                  className="playlist-playlist-image"
                />
              ) : (
                <p></p>
              )}
              
            </div>

            <div className="playlist-plname">
              {isEditingTitle ? (
                <div className='playlist-pledit2'>
                  <div className='playlist-edittitle2'>
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
                  <button onClick={handleSaveTitle} className='playlist-pltitlesave'>
                    <span className="material-symbols-outlined">check_circle</span>
                  </button>
                </div>
              ) : (
                <div className='playlist-pledit1'>
                  <div className='playlist-edittitle1'>
                    <h2>{playlistTitle || '플레이리스트 제목'}</h2>
                    <p>{playlistDescription || '플레이리스트 설명'}</p>
                  </div>
                </div>
              )}
            </div>
            
            
          </div>
          <div className="playlist-book-cover-box">
            {selectedBook.cover ? (
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                className="playlist-selected-book-cover"
              />
            ) : (
              <p>책을 선택하세요!</p>
            )}
          </div>

          <div className="playlist-book-choosetitle">
            <h2>{selectedBook.title}</h2>
            <p>
              {selectedBook.author}/{selectedBook.publisher}
            </p>
          </div>

          <div className="playlist-book-list">
            {isLoading ? (
              <div className="playlist-loader"></div>
            ) : (
              bookList.map((book, index) => (
                <div
                  key={index}
                  className="playlist-book-item"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="playlist-book-info">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="playlist-book-mcover"
                    />
                    <div className="playlist-booktitle">
                      <h3>{book.title}</h3>
                      <p>
                        {book.author}/{book.publisher}
                      </p>
                    </div>
                    
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
          
      


      
      
    </>
  );
}

export default LikedPlaylistModal;
