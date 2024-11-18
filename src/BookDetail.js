import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookDetail.css';

function BookDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const book = location.state?.book; // 전달된 데이터를 가져옴
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [nickname, setNickname] = useState('');
    const [rating, setRating] = useState(0);

    if (!book) {
        return <div>책 정보를 로드할 수 없습니다.</div>;
    }

    const handleAddComment = () => {
        if (newComment.trim() === '' || nickname.trim() === '') return;
        setComments([
            ...comments,
            { id: Date.now(), nickname, rating, comment: newComment, date: new Date() }
        ]);
        setNewComment('');
        setNickname('');
        setRating(0);
    };

    const handleDeleteComment = (id) => {
        setComments(comments.filter((comment) => comment.id !== id)); // ID로 특정 댓글 삭제
    };

    const handleStarClick = (starValue) => {
        setRating(starValue);
    };

    return (
        <div className="book-detail-page">
            {/* 뒤로가기 버튼 */}
            <button className="back-button" onClick={() => navigate(-1)}>
                ← 뒤로가기
            </button>

            {/* 책 상세 정보 섹션 */}
            <div className="book-detail-container">
                <div className="book-image">
                    <img src={book.image} alt={book.title} />
                </div>
                <div className="book-description">
                    <h1>{book.title}</h1>
                    <p><strong>저자:</strong> {book.author}</p>
                    <p><strong>출판사:</strong> {book.publisher}</p>
                    <p className="rating"><strong>평점:</strong> {"★".repeat(Math.round(book.rating))}</p>
                    <p><strong>설명:</strong> {book.description}</p>
                </div>
            </div>

            {/* 댓글 작성 섹션 */}
            <div className="add-comment-section">
                <h2>댓글 작성</h2>
                <input
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
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

            {/* 댓글 리스트 */}
            <div className="comments-section">
                <h2>댓글</h2>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <span className="nickname">{comment.nickname}</span>
                                <span className="date">{comment.date.toLocaleDateString()}</span>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteComment(comment.id)} // 댓글 삭제 버튼
                                >
                                    삭제
                                </button>
                            </div>
                            <div className="comment-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${
                                            comment.rating >= star ? 'active' : ''
                                        }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="comment-text">{comment.comment}</p>
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
