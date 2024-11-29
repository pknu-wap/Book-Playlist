import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PlaylistModal from './Mypageplaylist'; 
import Mainpageplaylist from '../components/Mainpageplaylist';
import './Mypage.css';
import myPlaylistsBg from './내가만든플리.svg';
import likedBooksBg from './찜한책.svg';
import likedPlaylistsBg from './찜한플리.svg';

const MyPage = () => {
  const [hoveredBook, setHoveredBook] = useState(null);
  const [username, setUsername] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [likedPlaylists, setLikedPlaylists] = useState([]); // 상태 변수 이름 변경
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);
  const [likedBooks, setLikedBooks] = useState([]);
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // New state variables for editing username
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  // State variable to track active tab
  const [activeTab, setActiveTab] = useState('myPlaylists'); // 기본값은 '내가 만든 플레이리스트'

  const getBackgroundImage = () => {
    switch (activeTab) {
      case 'myPlaylists':
        return `url(${myPlaylistsBg})`;
      case 'likedBooks':
        return `url(${likedBooksBg})`;
      case 'likedPlaylists':
        return `url(${likedPlaylistsBg})`;
      default:
        return 'none';
    }
  };

  const studyContainerRef = useRef(null);

  // 왼쪽으로 스크롤하는 함수
  const scrollLeft = () => {
    if (studyContainerRef.current) {
      studyContainerRef.current.scrollBy({
        left: -987, // 원하는 스크롤 거리 조정
        behavior: 'smooth',
      });
    }
  };

  // 오른쪽으로 스크롤하는 함수
  const scrollRight = () => {
    if (studyContainerRef.current) {
      studyContainerRef.current.scrollBy({
        left: 987, // 원하는 스크롤 거리 조정
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken(); // getToken으로 JWT 가져오기
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      setIsLoading(false); 
      return;
    }
      try {
        const [profileResponse, playlistsResponse, commentsResponse, playlistResponse, booksResponse] = await axios.all([
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/mine/playlists', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/mine/comments', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/favorite/playlists', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/favorite/books', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),  
        ]);

        if (profileResponse.data?.username) {
          setUsername(profileResponse.data.username);
          setNewUsername(profileResponse.data.username);
        }
        if (playlistsResponse.data) setPlaylists(playlistsResponse.data);
        if (commentsResponse.data) setComments(commentsResponse.data);
        if (playlistResponse.data) setLikedPlaylists(playlistResponse.data); 
        if (booksResponse.data) setLikedBooks(booksResponse.data);
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 모달 열기
  const openModal = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setIsModalOpen(true);
  };

  const LikedopenModal = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setIsLikedModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedPlaylistId(null);
    setIsModalOpen(false);
    setIsLikedModalOpen(false);
  };


  const renderStars = (rating) => {
    const fullStar = '★';
    const emptyStar = '☆';
    return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
  };

  // Handle username save
  const handleUsernameSave = async () => {
    const token = getToken(); // getToken으로 JWT 가져오기
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      setIsLoading(false); 
      return;
    }
    if (!newUsername.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    try {
      await axios.put(
        'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/profile/username',
        { newUsername },
        {  headers:{
          Authorization: `Bearer ${token}`,}}
      );
      setUsername(newUsername);
      setIsEditingUsername(false);
      alert('닉네임이 성공적으로 변경되었습니다.');
    } catch (error) {
      console.error('Username update error:', error);
      alert('닉네임 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlike = async (isbn) => {
    const token = getToken();
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      setIsLoading(false); 
      return;
    }
    try {
      await axios.delete(`https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/booklikes/${isbn}/unlike`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLikedBooks((prevBooks) => prevBooks.filter((book) => book.isbn !== isbn)); // 책 목록에서 제거
      alert('찜 취소가 완료되었습니다.');
    } catch (error) {
      console.error('찜 취소 오류:', error);
      alert('찜 취소 중 오류가 발생했습니다.');
    }
  };
  

  return (
    <div>
      <div className="mypage-topbox">
        <div className="mypage-userbox">
          <div className="mypage-userimage">{/* 사용자 이미지 표시 */}</div>
          <div className="mypage-username">
            {isLoading ? (
              <div className="mypage-loader"></div>
            ) : (
              <div className="mypage-username-box">
                <div className="mypage-username-p">
                  {isEditingUsername ? (
                    <div className="mypage-username-editing">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                      />
                    </div>
                  ) : (
                    <p>{username}님</p>
                  )}
                </div>
                <div
                  className="mypage-username-edit"
                  onClick={
                    isEditingUsername
                      ? handleUsernameSave
                      : () => setIsEditingUsername(true)
                  }
                >
                  {isEditingUsername ? (
                    <button className="mypage-username-save">
                      <span className="material-symbols-outlined">Check</span>
                    </button>
                  ) : (
                    <span className="material-symbols-outlined">edit</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mypage-Mycomment">
          <p>내가 쓴 댓글</p>
          <div className="mypage-Mycomment-list">
            {isLoading ? (
              <div className="mypage-Mycomment-loadingbox">
                <div className="mypage-loader"></div>
                <p>댓글 불러오는중...</p>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.isbn} className="mypage-comment">
                  <div className="mypage-comment-info">
                    <div className="mypage-comment-info-img">
                      <img src={comment.image} alt={comment.title} />
                    </div>
                    <div>
                      <div className="mypage-comment-info-header">
                        <h4>{comment.title}</h4>
                        <p>{renderStars(comment.rating)}</p>
                      </div>
                      <p className="mypage-comment-info-comment">
                        "{comment.content}"
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>작성한 댓글이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
      <div
        className="mypage-Mycollection"
        style={{
          backgroundImage: getBackgroundImage(),
          backgroundSize: '100%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="mypage-Mycollection-header">
          <div
            className={`mypage-Mycollection-button1 ${
              activeTab === 'myPlaylists' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('myPlaylists')}
          >
            <p>내가 만든 플레이리스트</p>
          </div>
          <div
            className={`mypage-Mycollection-button2 ${
              activeTab === 'likedBooks' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('likedBooks')}
          >
            <p>찜한 책</p>
          </div>
          <div
            className={`mypage-Mycollection-button3 ${
              activeTab === 'likedPlaylists' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('likedPlaylists')}
          >
            <p>찜한 플레이리스트</p>
          </div>
        </div>
        {isLoading ? (
          <div className="mypage-Mycollection-loadingbox">
            <div className="mypage-loader"></div>
            <p>불러오는 중...</p>
          </div>
        ) : (
          <div className="mypage-Mycollection-content">
              <button className="mypage-playlist-arrow mypage-playlist-arrow-left" onClick={scrollLeft}>
                <span className="material-symbols-outlined">Arrow_Back</span>
              </button> 
            {activeTab === 'myPlaylists' && (
              <div className="mypage-playlist-container">
                {playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <div key={playlist.playlistId} className="mypage-playlist-box">
                      <div className="mypage-playlist-hover-container">
                        {playlist.imageData ? (
                          <img
                            src={`data:image/jpeg;base64,${playlist.imageData}`}
                            alt={playlist.title}
                            className="mypage-playlist-image"
                            onClick={() => openModal(playlist.playlistId)}
                          />
                        ) : (
                          <div
                            className="mypage-placeholder-image"
                            onClick={() => openModal(playlist.playlistId)}
                          >
                            이미지 없음
                          </div>
                        )}
                      </div>
                      <div className="mypage-playlist-title">
                        <p>{playlist.title}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>생성한 플레이리스트가 없습니다.</p>
                )}     
              </div>
            )}
              <button className="mypage-playlist-arrow mypage-playlist-arrow-right" onClick={scrollRight}>
                <span className="material-symbols-outlined">Arrow_forward</span>
              </button>
            {activeTab === 'likedBooks' && (
              <div className="mypage-Mycollection-content">
                <button className="mypage-playlist-arrow mypage-playlist-arrow-left" onClick={scrollLeft}>
                  <span className="material-symbols-outlined">Arrow_Back</span>
                </button> 
                <div className="mypage-playlist-container" ref={studyContainerRef}>
                {likedBooks.length > 0 ? (
                    likedBooks.map((book) => {
                      let imageUrl = '';
                      try {
                        imageUrl = atob(book.image);
                      } catch (e) {
                        console.error('이미지 URL 디코딩 오류:', e);
                      }
                      return (
                        <div
                          key={book.isbn}
                          className="mypage-playlist-box"
                          onMouseEnter={() => setHoveredBook(book.isbn)}
                          onMouseLeave={() => setHoveredBook(null)}
                        >
                          <div className="mypage-playlist-hover-container">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={book.title}
                                className="mypage-playlist-image"
                              />
                            ) : (
                              <div className="mypage-placeholder-image">
                                이미지 없음
                              </div>
                            )}
                            <button
                              className={`mypage-unlike-button ${
                                hoveredBook === book.isbn ? "show" : ""
                              }`}
                              onClick={() => handleUnlike(book.isbn)}
                            >
                            {isLoading ? (
          
                            <div className="mypage-unlike-loader"></div>
            
                          ) : (
                              <p>💔 찜취소</p>
                          )}
                            </button>
                          </div>
                          <div className="mypage-playlist-title">
                            <p>{book.title}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>찜한 책이 없습니다.</p>
                  )}
                  
                </div>
                <button className="mypage-playlist-arrow mypage-playlist-arrow-right" onClick={scrollRight}>
                   <span className="material-symbols-outlined">Arrow_forward</span>
                  </button>
              </div>
            )}
            {activeTab === 'likedPlaylists' && (
              <div className="mypage-likedplaylists-container">
                <button className="mypage-playlist-arrow mypage-playlist-arrow-left" onClick={scrollLeft}>
                  <span className="material-symbols-outlined">Arrow_Back</span>
                </button> 
                <div className="mypage-playlist-container">
                  {likedPlaylists.length > 0 ? ( // 변경된 상태 변수 사용
                    likedPlaylists.map((playlist) => ( // 변경된 상태 변수 사용
                      <div key={playlist.playlistId} className="mypage-playlist-box">
                        <div className="mypage-playlist-hover-container">
                          {playlist.imageData ? (
                            <img
                              src={`data:image/jpeg;base64,${playlist.imageData}`}
                              alt={playlist.title}
                              className="mypage-playlist-image"
                              onClick={() => LikedopenModal(playlist.playlistId)}
                            />
                          ) : (
                            <div
                              className="mypage-placeholder-image"
                              onClick={() => LikedopenModal(playlist.playlistId)}
                            >
                              이미지 없음
                            </div>
                          )}
                        </div>
                        <div className="mypage-playlist-title">
                          <p>{playlist.title}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>찜한 플레이리스트가 없습니다.</p> 
                  )}
                </div>
                <button className="mypage-playlist-arrow mypage-playlist-arrow-right" onClick={scrollRight}>
                   <span className="material-symbols-outlined">Arrow_forward</span>
                  </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <PlaylistModal playlistId={selectedPlaylistId} onClose={closeModal} />
      )}
      {isLikedModalOpen && (
        <Mainpageplaylist playlistId={selectedPlaylistId} onClose={closeModal} />
      )}
    </div>
  );
};

export default MyPage;