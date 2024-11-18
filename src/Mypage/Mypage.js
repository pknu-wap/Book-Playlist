import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Mypage.css';

const MyPage = () => {
  const [username, setUsername] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState({
    title: '책 제목',
    image: null,
    publisher: '출판사',
    author: '지은이',
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileResponse, playlistsResponse] = await axios.all([
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/profile', { withCredentials: true }),
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/mine/playlists', { withCredentials: true }),
        ]);

        if (profileResponse.data && profileResponse.data.username) {
          setUsername(profileResponse.data.username);
        } else {
          console.log('프로필 API에서 데이터를 받지 못했습니다.');
        }

        if (playlistsResponse.data && playlistsResponse.data.length > 0) {
          setPlaylists(playlistsResponse.data);
        } else {
          console.log('플레이리스트 API에서 데이터를 받지 못했습니다.');
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 에러 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleModalOpen = async (playlistId) => {
    try {
      const response = await axios.get(`https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/${playlistId}`, { withCredentials: true });
      if (response.data) {
        setModalData(response.data);
        setIsModalOpen(true);

        if (response.data.books && response.data.books.length > 0) {
          const firstBook = response.data.books[0];
          setSelectedBook({
            title: firstBook.title || '책 제목',
            image: firstBook.image || null,
            author: firstBook.author || '지은이 정보 없음',
            publisher: firstBook.publisher || '출판사 정보 없음',
          });
        }
      }
    } catch (error) {
      console.error('모달 데이터를 가져오는 중 에러 발생:', error);
    }
  };

  const handleModalClose = () => {
    setModalData(null);
    setIsModalOpen(false);
  };

  const handleBookClick = (book) => {
    setSelectedBook({
      title: book.title,
      image: book.image,
      author: book.author,
      publisher: book.publisher,
    });
  };

  const handleEditTitle = () => {
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
  };

  useEffect(() => {
    if (modalData) {
      setPlaylistTitle(modalData.title || '');
      setPlaylistDescription(modalData.description || '');
    }
  }, [modalData]);

  return (
    <div>
      <div className='mypage-topbox'>
        <div className='mypage-userbox'>
          <div className='mypage-userimage'>{/* 사용자 이미지 표시 (선택 사항) */}</div>

          <div className='mypage-username'>
            <p>{username}님</p>
          </div>
        </div>
        <div className='mypage-Mycomment'>
          <p>내가 쓴 댓글</p>
        </div>
      </div>
      <div className='mypage-Mycollection'>
        <p>나의 플레이리스트</p>
        {isLoading ? (
          <p>로딩 중...</p>
        ) : (
          <div className='mypage-playlist-container'>
            {playlists.map((playlist) => (
              <div key={playlist.playlistId} className='mypage-playlist-box'>

                <div className='mypage-playlist-hover-container'>
                  {playlist.imageData ? (
                    <img
                      src={`data:image/jpeg;base64,${playlist.imageData}`}
                      alt={playlist.title}
                      className='mypage-playlist-image'
                    />
                  ) : (
                    <div className='mypage-playlist-image'>
                      <p>이미지 없음</p>
                    </div>
                  )}
                  <button
                    className='mypage-playlist-modal-button'
                    onClick={() => handleModalOpen(playlist.playlistId)}
                  >
                    열기
                  </button>
                </div>
                <p className='mypage-playlist-title'>{playlist.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && modalData && (
        <div className='mypage-modal'>
          <div className='mypage-modal-content'>
            <button className='mypage-modal-close-button' onClick={handleModalClose}>
              닫기
            </button>
            <div className='mypage-modal-plheader'>
            {modalData.base64Image && (
              <img
                src={`data:image/jpeg;base64,${modalData.base64Image}`}
                alt={modalData.title}
                className='mypage-modal-image'
              />
             )}
             {isEditingTitle ? (
                <div className='mypage-modal-plname-edit-save'>
                  <div className='mypage-modal-plname-save'>
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
                  <button onClick={handleSaveTitle}>
                    <span className="material-symbols-outlined">check_circle</span>
                  </button>
                </div>
              ) : (
              <div className='mypage-modal-plname-edit'>
                 <div className='mypage-modal-plname'>
                  <h2>{playlistTitle||modalData.title}</h2>
                  <p>{playlistDescription||modalData.description}</p>
                </div>
                <button onClick={handleEditTitle}>
                 <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              )}
            </div>
            <div className='mypage-modal-books'>
              {modalData.books.map((book, index) => (
                <div key={index} className='mypage-modal-book' onClick={() => handleBookClick(book)}>
                  <img src={book.image} alt={book.title} className='mypage-book-image' />
                  <div className='mypage-modal-booktitle'>
                    <h3>{book.title}</h3>
                    <p>{book.author}/{book.publisher}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className='mypage-playlist-selected-book-cover-before'>
              {selectedBook.image ? (
                <img
                  src={selectedBook.image}
                  alt={selectedBook.title}
                  className="mypage-playlist-selected-book-cover"
                />
              ) : (
                <p></p>
              )}
            </div>
            <div className="mypage-playlist-book-choosetitle">
              <h2>{selectedBook.title}</h2>
              <p>
                {selectedBook.author}/{selectedBook.publisher}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
