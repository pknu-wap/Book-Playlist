import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Modals.css";

// 모달 컴포넌트
const Modals = ({ show, onClose, data, loading }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const navigate = useNavigate();

  const goToBookDetail = (isbn) => {
    navigate(`/book/detail?isbn=${isbn}`); // ISBN을 쿼리 파라미터로 전달
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchLikeData = async () => {
      const token = getToken();
      if (!token) {
        alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
        setIsLoading(false); 
        return;
      }
      try {
        const { data: isLikedData } = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${data.playlistId}/isLiked`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { data: likeCountData } = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${data.playlistId}/likeCount`,
          { withCredentials: true }
        );
  
        setIsLiked(isLikedData);
        setLikeCount(likeCountData.likeCount);
      } catch (error) {
        console.error('찜 정보 가져오기 실패:', error);
        // 사용자에게 에러 메시지 표시 등 추가 처리
      } finally {

      }
    };
  
    if (data) {
      fetchLikeData();
    }
  }, [data]);
  const handleLike = () => {
    setIsLoading(true); // 찜하기 버튼 클릭 시 로딩 시작
    const token = getToken();
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      setIsLoading(false); 
      return;
    }
  
    // 요청 URL
    const likeUrl = `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${data.playlistId}/like`;
    const unlikeUrl = `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${data.playlistId}/unlike`;
  
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
  
  
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-v" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          닫기
        </button>
        {loading ? (
          <div className="playlist-loading"></div>
        ) : data ? (
          <div className="modal-grid">
            <div className="modal-left">
              <div className="modal-meta">
                <ul className="modal-description">
                  <li>
                    <img
                      src={`data:image/jpeg;base64,${data.base64Image || ""}`}
                      alt={data.title}
                      className="modal-image"
                    />
                  </li>
                  <li>
                    <h2 className="modal-title">{data.title}</h2>
                  </li>
                  <li>
                    <span>작성자: {data.username}</span>
                  </li>
                  <li>
                    <span><p style={{whiteSpace: 'nowrap', width:"200px",overflow: 'hidden', textOverflow: 'ellipsis'}}>설명: {data.description}</p></span>
                  </li>
                  <li>
                    {isLoading ? (
                      <div>
                        <div className="favorite-button-loading">                        
                        </div>
                      </div>
                    ) : (
                      <button
                        className={`liking-button ${isLiked ? "liked" : ""}`}
                        onClick={handleLike}
                      >
                        {isLiked ? "찜 취소" : "찜 하기"}
                      </button>
                    )}
                  </li>
                  <li>
                    <p>찜 수: {likeCount}</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="modal-right">
              {data.books && data.books.length > 0 ? (
                <div className="books-list">
                  {data.books.map((book) => (
                    <div key={book.isbn} className="book-item">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="book-image"
                        onClick={()=>goToBookDetail(book.isbn)}
                      />
                      <div className="book-info">
                        <h4 onClick={()=>goToBookDetail(book.isbn)}>{book.title}</h4>
                        <p onClick={()=>goToBookDetail(book.isbn)}>저자: {book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>책 데이터가 없습니다.</p>
              )}
            </div>
          </div>
        ) : (
          <p>데이터를 불러올 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Modals;