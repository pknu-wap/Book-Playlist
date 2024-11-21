import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlaylistModal from './playlist'; // PlaylistModal 컴포넌트 가져오기
import './Mypage.css';

const MyPage = () => {
  const [username, setUsername] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [comments, setComments] = useState([]); // 댓글 데이터를 저장할 상태 변수 추가
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileResponse, playlistsResponse, commentsResponse] = await axios.all([
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/profile', { withCredentials: true }),
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/mine/playlists', { withCredentials: true }),
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/mine/comments', { withCredentials: true }), // 댓글 데이터 가져오기
        ]);

        if (profileResponse.data?.username) setUsername(profileResponse.data.username);
        if (playlistsResponse.data) setPlaylists(playlistsResponse.data);
        if (commentsResponse.data) setComments(commentsResponse.data); // 댓글 데이터 상태에 저장
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
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

  // 모달 닫기
  const closeModal = () => {
    setSelectedPlaylistId(null);
    setIsModalOpen(false);
  };

  const renderStars = (rating) => {
    const fullStar = '★';
    const emptyStar = '☆';
    return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
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
              <p>{username}님</p>
            )}
          </div>
        </div>
        <div className="mypage-Mycomment">
          <p>내가 쓴 댓글</p>
          <div className="mypage-Mycomment-list">
            {isLoading ? (
              <div className="mypage-loader"></div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.isbn} className="mypage-comment">
                  <div className="mypage-comment-info">
                    <div className='mypage-comment-info-img' >
                      <img src={comment.image} ></img>
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

      <div className="mypage-Mycollection">
        <p>나의 플레이리스트</p>
        {isLoading ? (
          <div className="mypage-Mycollection-loadingbox">
            <div className="mypage-loader"></div>
            <p>플레이리스트 불러오는 중...</p>
          </div>
        ) : (
          <div className="mypage-playlist-container">
            {playlists.map((playlist) => (
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
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <PlaylistModal playlistId={selectedPlaylistId} onClose={closeModal} />
      )}
    </div>
  );
};

export default MyPage;
