import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookDetail.css';

function BookDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book;
  const [comments, setComments] = useState([]); // 초기값 빈 배열
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null); // 초기값 null

  const userId = 1; // 로그인 사용자 ID (로그인 상태라면 실제 ID를 가져오도록 구현 필요)

  useEffect(() => {
    if (!book) return;

    // 댓글 가져오기
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/books/${book.id}/comments`);
        setComments(response.data?.data || []); // 응답 데이터가 없으면 빈 배열
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    // 평균 별점 가져오기
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(`/api/books/${book.id}/rating/average`);
        const rating = response.data?.data?.averageRating || 0; // 데이터가 없으면 기본값 0
        setAverageRating(rating);
      } catch (error) {
        console.error('Error fetching average rating:', error);
      }
    };

    fetchComments();
    fetchAverageRating();
  }, [book]);

  if (!book) {
    return <div>책 정보를 로드할 수 없습니다.</div>;
  }

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const response = await axios.post(`/api/books/${book.id}/comments`, {
        userId,
        content: newComment,
        rating,
      });
      setComments([...comments, response.data.data]);
      setNewComment('');
      setRating(0);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`/api/books/comments/${commentId}`, {
        data: { userId },
      });

      if (response.data.success) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

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
          <p><strong>저자:</strong> {book.author}</p>
          <p><strong>출판사:</strong> {book.publisher}</p>
          <p><strong>평점:</strong> {averageRating ? averageRating.toFixed(1) : '평가 없음'}</p>
          <p><strong>설명:</strong> {book.description}</p>
        </div>
      </div>

      <div className="add-comment-section">
        <h2>댓글 작성</h2>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${rating >= star ? 'active' : ''}`}
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
                <span className="date">{new Date(comment.createdAt).toLocaleDateString()}</span>
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
                    className={`star ${comment.rating >= star ? 'active' : ''}`}
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
