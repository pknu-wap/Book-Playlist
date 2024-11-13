import React from 'react';
import { useLocation } from 'react-router-dom';

function BookDetail() {
    const location = useLocation();
    const book = location.state?.book; // 전달된 데이터를 가져옴

    if (!book) {
        return <div>책 정보를 로드할 수 없습니다.</div>;
    }

    return (
        <div>
            <h2>{book.title}</h2>
            <p><strong>저자:</strong> {book.author}</p>
            <p><strong>출판사:</strong> {book.publisher}</p>
            <p><strong>설명:</strong> {book.description}</p>
            <img src={book.imageUrl} alt={book.title} width="100" />
        </div>
    );
}

export default BookDetail;
