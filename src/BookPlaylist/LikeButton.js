import React, { useState } from 'react';
import axios from 'axios';

const LikeButton = ({ playlistId, initialIsLiked, initialLikeCount, onLikeChange }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const getToken = () => localStorage.getItem('token');

  const handleLike = () => {
    setIsLoading(true);
    const token = getToken();
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      setIsLoading(false);
      return;
    }

    const likeUrl = `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId}/like`;
    const unlikeUrl = `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId}/unlike`;
    const headers = {
      'Authorization': `Bearer ${token}`,
    };

    if (!isLiked) {
      axios.post(likeUrl, {}, { headers, withCredentials: true })
        .then(() => {
          setIsLiked(true);
          setLikeCount(prevCount => prevCount + 1);
          onLikeChange(true, likeCount + 1); // Callback to parent to update like state
        })
        .catch(error => {
          console.error("찜하기 실패:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios.delete(unlikeUrl, { headers, withCredentials: true })
        .then(() => {
          setIsLiked(false);
          setLikeCount(prevCount => prevCount - 1);
          onLikeChange(false, likeCount - 1); // Callback to parent to update like state
        })
        .catch(error => {
          console.error("찜 취소 실패:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="favorite-button-loading"></div>
      ) : (
        <button
          className={`liking-button ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
        >
          {isLiked ? "찜 취소" : "찜 하기"}
        </button>
      )}
      <p>찜 수: {likeCount}</p>
    </div>
  );
};

export default LikeButton;
