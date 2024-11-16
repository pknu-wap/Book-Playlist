import React, { useState } from "react";
import axios from "axios";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0, isOpen: false });
  const [selectedItem, setSelectedItem] = useState(null); // 클릭된 아이템의 데이터 상태 추가
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  

  const handleSearch = async () => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(
        'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/search/books',
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
    if (e.target.closest('.modal-content')) return;
    closeModal();
  };

  const handleButtonClick = (e, item) => {
    const rect = e.target.getBoundingClientRect();
    setModalPosition({
      top: rect.top,
      left: rect.right,
      isOpen: true,
    });
    setSelectedItem(item); // 클릭된 아이템의 데이터를 상태에 저장
    setIsSecondModalOpen(true); // 두 번째 모달을 열기
  };

  const resultItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    padding: '10px',
    borderBottom: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  };

  const imageStyle = {
    width: '100px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '20px',
  };

  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '5px',
    maxWidth: '200px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  };

  const authorStyle = {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '5px',
  };

  const buttonStyle = {
    padding: '8px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
        <div className="search-container">
            <input
                className="search-bar"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for books..."
            />
            <button className="search-button" onClick={handleSearch}>
                검색
            </button>
        </div>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '75px',
            left: '0px',
            right: '0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            zIndex: 9999,
            paddingTop: '10px',
          }}
          onClick={handleModalClick}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '80%',
              maxWidth: '600px',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            <div>
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div key={item.id} style={resultItemStyle}>
                    <img src={item.image} style={imageStyle} alt={item.title} />
                    <div style={{ flex: 1 }}>
                      <p style={titleStyle}>{item.title}</p>
                      <p style={authorStyle}>{item.author}</p>
                    </div>
                    <button
                      style={buttonStyle}
                      onClick={(e) => handleButtonClick(e, item)} // 클릭한 아이템을 전달
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

      {/* 두 번째 모달, 아이템 선택 시 표시됨 */}
      {isSecondModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            width:'200px'
          }}
        >
          <div
            style={{
              backgroundColor: 'lightgray',
              padding: '20px',
              borderRadius: '8px',
              width: '100%',
              height: '100%',
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
