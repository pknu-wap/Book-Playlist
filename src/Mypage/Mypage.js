import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Mypage.css';

const MyPage = () => {
  const [username, setUsername] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/mine/playlists',
          { withCredentials: true }
        );

        console.log('API 응답 데이터:', response.data);

        // 응답 데이터 구조에 따라 수정
        if (response.data && response.data.length > 0) {
          setUsername(response.data[0].username);
          setPlaylists(response.data);
        } else {
          console.log('API로부터 데이터를 받지 못했습니다.');
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 에러 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
