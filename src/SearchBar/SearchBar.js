import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBar.css";
import PlaylistModal from "../Mypage/playlist";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [username, setUsername] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0, isOpen: false });
  const [thirdModalPosition, setThirdModalPosition] = useState({ top: 0, left: 0, isOpen: false });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedIsbn, setSelectedIsbn] = useState(null);

  const navigate = useNavigate(); // useNavigate 훅 추가

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileResponse, playlistsResponse] = await axios.all([
          axios.get("https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/profile", {
            withCredentials: true,
          }),
          axios.get("https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/mine/playlists", {
            withCredentials: true,
          }),
        ]);

        if (profileResponse.data?.username) setUsername(profileResponse.data.username);
        if (playlistsResponse.data) setPlaylists(playlistsResponse.data);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
    setIsSecondModalOpen(false); // 두 번째 모달 닫기
    setIsThirdModalOpen(false); // 세 번째 모달 닫기
  };

  const handleModalClick = (e) => {
    if (e.target.closest(".modal-content")) return;
    closeModal();
  };

  const handleButtonClick = (e, item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setSelectedIsbn(item.isbn);
    console.log("선택된 책:", item);
    console.log("ISBN:", item.isbn);
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
      {/* 검색 바 */}
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
          width: "80%",
          maxWidth: "800px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
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
            zIndex: 99,
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
            onClick={(e) => e.stopPropagation()}
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
                    }}
                    onClick={() => handleBookClick(book)}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      style={{
                        width: "100px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginRight: "20px",
                      }}
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
                      ...
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
    </div>
  );
};

export default SearchBar;
