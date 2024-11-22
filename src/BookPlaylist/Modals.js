import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modals.css";

// 모달 컴포넌트
const Modals = ({ show, onClose, data, loading }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    const fetchLikeData = async () => {
      
      try {
        const { data: isLikedData } = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${data.playlistId}/isLiked`,
          { withCredentials: true }
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
    if (!isLiked) {
      // 찜하기
      axios
        .post(`https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${data.playlistId}/like`, {}, {
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
           // 요청 완료 후 로딩 상태 종료
        });
    } else {
      // 찜 취소
      axios
        .delete(`https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${data.playlistId}/unlike`, {
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
           // 요청 완료 후 로딩 상태 종료
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
                    <span>설명: {data.description}</span>
                  </li>
                  <li>
                      <button
                        className={`liking-button ${isLiked ? "liked" : ""}`}
                        onClick={handleLike}
                      >
                        {isLiked ? "찜 취소" : "찜 하기"}
                      </button>
                      {/* {isLoading ? (<div className="favorite-button-loading"><p></p></div>): ()} */}
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
                      />
                      <div className="book-info">
                        <h4>{book.title}</h4>
                        <p>저자: {book.author}</p>
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
