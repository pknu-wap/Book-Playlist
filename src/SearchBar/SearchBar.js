import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0, isOpen: false });
  const [selectedItem, setSelectedItem] = useState(null); // 클릭된 아이템의 데이터 상태 추가
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅 추가

  const handleSearch = async () => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(
        "https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/search/books",
        {
          params: { query: query },
        }
      );
      setSearchResults(response.data.items);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalPosition({ ...modalPosition, isOpen: false });
  };

  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
  };

  const handleModalClick = (e) => {
    if (e.target.closest(".modal-content")) return;
    closeModal();
  };

  const handleButtonClick = (e, item) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    const rect = e.target.getBoundingClientRect();
    setModalPosition({
      top: rect.top,
      left: rect.right,
      isOpen: true,
    });
    setSelectedItem(item); // 클릭된 아이템의 데이터를 상태에 저장
    setIsSecondModalOpen(true); // 두 번째 모달을 열기
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`, { state: { book } }); // 책 상세 페이지로 이동
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      {/* 검색 바 디자인 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "80%", // 검색 바 전체 폭
          maxWidth: "800px",
          padding: "10px",
          backgroundColor: "#f5f5f5", // 검색창 배경색
          borderRadius: "30px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <input
          className="search-bar"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for books..."
          style={{
            flex: 1,
            height: "40px",
            border: "none",
            outline: "none",
            padding: "0 15px",
            fontSize: "16px",
            borderRadius: "30px 0 0 30px",
            backgroundColor: "#fff",
          }}
        />
        <button
          className="search-button"
          onClick={handleSearch}
          style={{
            padding: "0 20px",
            height: "40px",
            fontSize: "16px",
            border: "none",
            borderRadius: "0 30px 30px 0",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
          }}
        >
          검색
        </button>
      </div>

      {/* 검색 결과 모달 */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "75px",
            left: "0px",
            right: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            zIndex: 9999,
            paddingTop: "10px",
          }}
          onClick={handleModalClick}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "600px",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()} // 모달 외부 클릭 시 닫기 방지
          >
            <div>
              {searchResults.length > 0 ? (
                searchResults.map((book) => (
                  <div
                    key={book.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      cursor: "pointer",
                    }}
                    onClick={() => handleBookClick(book)}
                  >
                    <img
                      src={book.image}
                      style={{
                        width: "100px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginRight: "20px",
                      }}
                      alt={book.title}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          marginBottom: "5px",
                          maxWidth: "200px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {book.title}
                      </p>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "#555",
                          marginBottom: "5px",
                        }}
                      >
                        {book.author}
                      </p>
                    </div>
                    <button
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={(e) => handleButtonClick(e, book)}
                    >
                      보기
                    </button>
                  </div>
                ))
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 두 번째 모달 */}
      {isSecondModalOpen && (
        <div
          style={{
            position: "fixed",
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              backgroundColor: "lightgray",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            {selectedItem ? (
              <>
                <h3>{selectedItem.title}</h3>
                <p>{selectedItem.author}</p>
                <button>찜하기</button>
                <button onClick={closeSecondModal}>닫기</button>
              </>
            ) : (
              <p>아이템을 선택해주세요.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
