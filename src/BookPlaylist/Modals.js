import React from "react";
import "./Modals.css";
// 모달 컴포넌트
const Modals = ({ show, onClose, data, loading }) => {
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
                    <li><img
                          src={`data:image/jpeg;base64,${data.base64Image || ""}`}
                          alt={data.title}
                          className="modal-image"
                        />
                    </li>
                    <li><h2 className="modal-title">{data.title}</h2></li>
                    <li><span>작성자: {data.username}</span></li>
                    <li><span>설명: {data.description}</span></li>
                    <li><button className="liking-button">찜하기</button></li>            
                    <li><p>찜 수: (추가 데이터 필요)</p></li>
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