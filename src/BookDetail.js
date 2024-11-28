import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookDetail.css";

function BookDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [username, setUsername] = useState(""); // 로그인 시 사용한 닉네임
  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    if (!book || !book.isbn) {
      console.error("Book or ISBN data is missing.");
      return;
    }

    // 책 정보를 백엔드로 전송 (ISBN 기반)
    const postBookByISBN = async () => {
      try {
        console.log("Sending ISBN to backend:", book.isbn);
        await axios.post(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/search/books/isbn`,
          { isbn: book.isbn },
        );
      } catch (error) {
        console.error("Error posting book ISBN to backend:", error);
      }
    };

    // 댓글 가져오기
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/books/${book.isbn}/all/comments`,
          { withCredentials: true }
        );
        setComments(
          response.data.map((comment) => ({
            ...comment,
            isAuthor: comment.username === username, // 댓글 작성자가 현재 사용자와 동일한지 확인
          }))
        );
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    // 평균 평점 가져오기
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/books/${book.isbn}/rating/average`,
          { withCredentials: true }
        );
        setAverageRating(response.data?.data?.averageRating || 0);
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    // 찜하기 상태 확인
    const fetchLikeStatus = async () => {
      try {
        const token = getToken(); // JWT 토큰 가져오기
        const response = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/booklikes/${book.isbn}/isLiked`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 토큰 추가
            },
          }
        );
        setIsLiked(response.data || false);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    // 사용자 닉네임 가져오기
    const fetchUsername = async () => {
      try {
        const token = getToken(); // getToken으로 JWT 가져오기); // JWT 토큰 가져오기
        const response = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 토큰 추가
            },
          }
        );
        setUsername(response.data.username || "익명");
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    postBookByISBN();
    fetchComments();
    fetchAverageRating();
    fetchLikeStatus();
    fetchUsername();
  }, [book, username]);

  const toggleLike = async () => {
    if (!book || !book.isbn) {
      console.error("Book ISBN is undefined. Cannot toggle like status.");
      return;
    }

    const token = getToken(); // getToken으로 JWT 가져오기
  if (!token) {
    alert("로그인이 필요합니다.");
    navigate("/login");
    return;
  }

  setIsLoadingLike(true); // 로딩 상태 활성화
  try {
    const endpoint = isLiked
      ? `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/booklikes/${book.isbn}/unlike` // 찜 취소 API
      : `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/booklikes/${book.isbn}/like`; // 찜하기 API

      const token = getToken(); // getToken으로 JWT 가져오기
      if (!token) {
        alert("로그인이 필요합니다."); // 토큰이 없으면 로그인 필요 알림
        navigate("/login"); // 로그인 페이지로 이동
        return;
      }
      
      const headers = {
      Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함
    };

    if (isLiked) {
      await axios.delete(endpoint, { headers }); // 찜 취소 요청
    } else {
      await axios.post(endpoint, {}, { headers }); // 찜하기 요청
    }

    setIsLiked(!isLiked); // 상태 토글
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("인증이 만료되었습니다. 다시 로그인해주세요."); // 인증 오류 시 알림
      navigate("/login"); // 로그인 페이지로 이동
    } else {
      console.error("Error toggling like status:", error);
    }
  } finally {
    setIsLoadingLike(false); // 로딩 상태 비활성화
  }
};

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    const token = getToken(); // getToken으로 JWT 가져오기 
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/books/${book.isbn}/comments`,
        {
          content: newComment, // 댓글 내용
          rating, // 평점
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함
          },
        }
      );
      setComments([
        ...comments,
        { ...response.data, username, isAuthor: true }, // 새 댓글 추가
      ]);
      setNewComment(""); // 입력 필드 초기화
      setRating(0); // 평점 초기화
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인이 필요합니다."); // 인증 오류 시 알림
        navigate("/login"); // 로그인 페이지로 이동
      } else {
        console.error("Error adding comment:", error);
      }
    }
  };

  // 댓글 삭제 기능 (JWT 토큰 인증)
const handleDeleteComment = async (commentId) => {
  const token = getToken(); // getToken으로 JWT 가져오기c // JWT 토큰 가져오기
  if (!token) {
    alert("로그인이 필요합니다.");
    navigate("/login");
    return;
  }

  try {
    const response = await axios.delete(
      `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/books/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함
        },
      }
    );

    if (response.data.success) {
      setComments(comments.filter((comment) => comment.id !== commentId)); // 댓글 목록 갱신
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert("로그인이 필요합니다."); // 인증 오류 시 알림
      navigate("/login"); // 로그인 페이지로 이동
    } else {
      console.error("Error deleting comment:", error);
    }
  }
};

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  if (!book) {
    return <div>책 정보를 로드할 수 없습니다.</div>;
  }

  return (
    <div className="book-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>

      <div className="book-detail-container">
        <div className="book-detail-book-image">
          <img src={book.image} alt={book.title} />
        </div>
        <div className="book-title"> 
          <h1>{book.title}</h1>
        <div className="book-authorpublisheraverage">
          <p>
            <strong>저자:</strong> {book.author}
            </p> 
          <p>
            <strong>출판사:</strong> {book.publisher}
            </p>
          <p>
          <strong>평점:</strong>{" "}
          {averageRating > 0 ? averageRating.toFixed(1) : "평가 없음"}
          {averageRating > 0 && (
           <span className="average-rating-stars">
             {[1, 2, 3, 4, 5].map((star) => (
              <span
              key={star}
              className={`star ${Math.round(averageRating) >= star ? "active" : ""}`}
              >    
                ★
               </span>
            ))}
          </span>
          )}
       </p>
          <div className="book-description">
          <p>
            <strong>설명:</strong> {book.description}
          </p>
          <button
            className="like-button"
            onClick={toggleLike}
            disabled={isLoadingLike}
          >
            {isLiked ? "♥ 찜 취소" : "♡ 찜하기"}
          </button>
        </div>
        </div>
       </div>  
      </div>

      <div className="add-comment-section">
        <h2>댓글 작성</h2>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${rating >= star ? "active" : ""}`}
              onClick={() => handleStarClick(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="댓글을 입력하세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button onClick={handleAddComment}>댓글 등록</button>
      </div>

      <div className="comments-section">
        <h2>댓글</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="username">{comment.username || "익명"}</span>
                <span className="date">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString()
                    : "날짜 정보 없음"}
                </span>
                {comment.isAuthor && (
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    삭제
                  </button>
                )}
              </div>
              <div className="comment-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${comment.rating >= star ? "active" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="comment-text">{comment.content}</p>
            </div>
          ))
        ) : (
          <p>댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
        )}
      </div>
    </div>
  );
}

export default BookDetail;