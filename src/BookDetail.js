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
  const [isLiked, setIsLiked] = useState(false); // 찜하기 상태
  const [isLoadingLike, setIsLoadingLike] = useState(false); // 찜하기 처리 중 상태

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
          { withCredentials: true } // 인증 정보 포함
        );
      } catch (error) {
        console.error("Error posting book ISBN to backend:", error);
      }
    };

    // 댓글 가져오기
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/books/${book.isbn}/comments`,
          { withCredentials: true } // 인증 정보 포함
        );
        setComments(response.data || []); // 수정된 부분
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
        const response = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/booklikes/${book.isbn}/isLiked`,
          { withCredentials: true } // 인증 정보 포함
        );
        setIsLiked(response.data || false);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    postBookByISBN();
    fetchComments();
    fetchAverageRating();
    fetchLikeStatus();
  }, [book]);

  // 찜하기/찜 취소 처리
  const toggleLike = async () => {
    if (!book || !book.isbn) {
      console.error("Book ISBN is undefined. Cannot toggle like status.");
      return;
    }

    setIsLoadingLike(true);
    try {
      const endpoint = isLiked
        ? `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/booklikes/${book.isbn}/unlike`
        : `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/booklikes/${book.isbn}/like`;

      console.log("Sending request to:", endpoint);

      if (isLiked) {
        await axios.delete(endpoint, { withCredentials: true });
      } else {
        await axios.post(endpoint, {}, { withCredentials: true });
      }

      setIsLiked(!isLiked);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        console.error("Error toggling like status:", error);
      }
    } finally {
      setIsLoadingLike(false);
    }
  };

  // 댓글 추가 처리
  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const response = await axios.post(
        `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/books/${book.isbn}/comments`,
        {
          content: newComment,
          rating,
        },
        { withCredentials: true } // 인증 정보 포함
      );
      setComments([...comments, response.data]); // 수정된 부분
      setNewComment("");
      setRating(0);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        console.error("Error adding comment:", error);
      }
    }
  };

  // 댓글 삭제 처리
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/books/comments/${commentId}`,
        {
          data: {}, // userId 제거
          withCredentials: true, // 인증 정보 포함
        }
      );

      if (response.data.success) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        console.error("Error deleting comment:", error);
      }
    }
  };

  // 별점 선택 처리
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
        <div className="book-image">
          <img src={book.image} alt={book.title} />
        </div>
        <div className="book-description">
          <h1>{book.title}</h1>
          <p>
            <strong>저자:</strong> {book.author}
          </p>
          <p>
            <strong>출판사:</strong> {book.publisher}
          </p>
          <p>
            <strong>평점:</strong>{" "}
            {averageRating ? averageRating.toFixed(1) : "평가 없음"}
          </p>
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
                <span className="date">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString()
                    : "날짜 정보 없음"}
                </span>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  삭제
                </button>
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