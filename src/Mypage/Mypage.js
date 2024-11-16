import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Mypage.css';

const MyPage = () => {
  const [username, setUsername] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileResponse, playlistsResponse] = await axios.all([
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/profile', { withCredentials: true }),
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/mine/playlists', { withCredentials: true }),
        ]);

        // username API 응답 처리
        if (profileResponse.data && profileResponse.data.username) {
          setUsername(profileResponse.data.username);
        } else {
          console.log('프로필 API에서 데이터를 받지 못했습니다.');
        }

        // 플레이리스트 API 응답 처리
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

  return (
    <div>
      <div className='mypage-topbox'>
        <div className='mypage-userbox'>
          <div className='mypage-userimage'>
            {/* 사용자 이미지 표시 (선택 사항) */}
          </div>
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
                {playlist.imageData ? (
                  <img
                    src={`data:image/jpeg;base64,${playlist.imageData}`}
                    alt={playlist.title}
                    className='mypage-playlist-image'
                  />
                ) : (
                  <div className='mypage-placeholder-image'>이미지 없음</div>
                )}
                <p className='mypage-playlist-title'>{playlist.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
