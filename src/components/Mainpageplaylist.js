import React, { useState, useEffect } from 'react';
import '../Mypage/Mypageplaylist.css';
import axios from 'axios';

function LikedPlaylistModal({ onClose, playlistId }) {
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
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

  // 찜 여부 데이터 가져오기
  useEffect(() => {
    const fetchLikeData = async () => {
      const token = getToken();
      if (!token) {
        alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
        setIsLoading(false);
        return;
      }
  
      try {
        const [isLikedData, likeCountData] = await Promise.all([
          axios.get(
            `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId}/isLiked`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId}/likeCount`,
            { withCredentials: true }
          ),
        ]);
  
        setIsLiked(isLikedData.data);
        setLikeCount(likeCountData.data.likeCount);
      } catch (error) {
        console.error('찜 정보 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (playlistId) {
      fetchLikeData();
    }
  }, [playlistId]);
  const handleLike = () => {
    setIsLoading(true); // 찜하기 버튼 클릭 시 로딩 시작
    const token = getToken();
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      setIsLoading(false); 
      return;
    }
  
    // 요청 URL
    const likeUrl = `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId}/like`;
    const unlikeUrl = `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId}/unlike`;
  
    // 요청 헤더에 Authorization 추가
    const headers = {
      'Authorization': `Bearer ${token}`,  // 토큰을 Authorization 헤더에 포함
    };
  
    if (!isLiked) {
      // 찜하기
      axios
        .post(likeUrl, {}, {
          headers: headers,
          withCredentials: true,
        })
        .then(() => {
          setIsLiked(true);
          setLikeCount((prevCount) => prevCount + 1);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("찜하기 실패:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // 찜 취소
      axios
        .delete(unlikeUrl, {
          headers: headers,
          withCredentials: true,
        })
        .then(() => {
          setIsLiked(false);
          setLikeCount((prevCount) => prevCount - 1);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("찜 취소 실패:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };



  

  


  
  return (
    <>
      {/* 첫 번째 모달 */}
      <div className="playlist-modal-overlay" onClick={closeModal}>
        <div
          className="playlist-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="playlist-close-btn" onClick={closeModal}>
            닫기
          </button>
          <div className="playlist-playlist-header">
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
                <div className="playlist-pledit2">
                  <div className="playlist-edittitle2">
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
                  <button
                    onClick={handleSaveTitle}
                    className="playlist-pltitlesave"
                  >
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                  </button>
                </div>
              ) : (
                <div className="playlist-pledit1">
                  <div className="playlist-edittitle1">
                    <h2>{playlistTitle || "플레이리스트 제목"}</h2>
                    <p>{playlistDescription || "플레이리스트 설명"}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="playlist-plcount">
              <p>❤️: {isLoading ? ( <div className="playlist-likecount-loader"></div> ) : (
                <span className='playlist-plcount-after-p'>{likeCount}</span>
              )}</p>
            </div>
            <button
              className="playlist-plliked"
              onClick={handleLike}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="playlist-loader"></div> 
              ) : isLiked ? (
                <>
                  <p>❤️ 찜취소</p>
                </>
              ) : (
                <>
                  <p>❤️ 찜하기</p>
                </>
              )}
            </button>
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