import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBar.css";
import PlaylistModal from "./PlaylistModal.js";
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
  const [isLoading, setIsLoading] = useState(false);
  const [addmodalOpen, setAddmodalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedIsbn, setSelectedIsbn] = useState(null);
  const [isplyLoading,setIsplyLoading] = useState(false);

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

  const addPlaylist = (newPlaylist) => {
    setPlaylists([...playlists, newPlaylist]);
  };

  const AddmodalOpen=()=>{
    setAddmodalOpen(true);
  }

  const closeAddModal=()=>{
    setAddmodalOpen(false);
  }
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
    console.log(`클릭한 책 데이터:`, item);
    console.log(`클릭한 책 isbn:`,item.isbn);
  };
  

  const handleSecondButtonClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    setThirdModalPosition({
      top: rect.top,
      left: rect.right,
      isOpen: true,
    });
    setIsThirdModalOpen(true);
  };

  
  const handleClick = (item, playlist) => {
    console.log("클릭한 isbn:",item.isbn)
    console.log("클릭한 플레이리스트Id:",playlist.playlistId);
  };

  const ThirdModelClose = () => {
    setIsThirdModalOpen(false);
  };

  const onClickzzimButton = async () => {
    setIsLoading(true);
    try {
      // selectedIsbn이 null이 아닌지 확인
      if (!selectedIsbn) {
        alert("책 ISBN이 선택되지 않았습니다.");
        return;
      }
  
      // 전달된 isbn 확인
      console.log("전달된 isbn:", selectedIsbn);
  
      // axios 요청
      const response = await axios.post(
        `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/booklikes/mainpage/like-by-isbn?isbn=${selectedIsbn}`, 
        {},  // 빈 본문 전달
        { withCredentials: true }
      );
      console.log("Sending ISBN:", selectedIsbn);
      console.log("Request body:", { isbn: selectedIsbn });
      // 성공적인 응답 처리
      console.log("응답 데이터:", response.data);
      alert('책이 찜되었습니다!');
    } catch (error) {
      // 오류 처리
      console.error("찜 오류:", error.response?.data || error);
      alert('찜 오류 발생');
    }
    setIsLoading(false);
  };

  const resultItemStyle = {
    width: '500px',
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

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`, { state: { book } }); // 책 상세 페이지로 이동
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const AddbooktoPlaylist = async (item, playlist) => {
    try {
      setIsplyLoading(true);
      console.log("클릭한 플레이리스트Id:", playlist.playlistId);  // playlistId 확인
      console.log("isbn:", item.isbn);  // isbn 확인
      
      const response = await axios.post(
        `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/${playlist.playlistId}/addBook?isbn=${item.isbn}`,  // isbn을 query parameter로 전달
        {},
        { withCredentials: true }  // 로그인 상태 유지
      );
  
      console.log("Book added successfully:", response.data);
      alert("성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsplyLoading(false);
  };

  return (
    <div>
      {/* 검색 바 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          top: "20px",
          marginLeft:'105%',
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "700px", // 검색 바 전체 폭
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
              maxWidth: "550px",
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
      {/* 두 번째 모달 */}
      {isSecondModalOpen && (
        <div
          style={{
            height: '120px',
            marginLeft: '20px',
            position: 'absolute',
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left + 20}px`,  // 첫 번째 모달과 일정 간격 두기
            backgroundColor: 'rgba(0, 0, 0, 0)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            width: '200px',
            transform: 'translateY(0)',  // 상대적 위치 조정
          }}
        >
          <div className="searchbar-second-modal" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            {selectedItem ? (
              <>
                <button onClick={closeSecondModal} style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '10px'
                }}>
                  ✖
                </button>
                <button
                  className="searchbar-modal-button"
                  onClick={(e) => handleSecondButtonClick(e)}
                >
                  플레이리스트 추가
                </button>
                {isLoading ? (<div className="playlists-loading"><p></p></div>):(<button className="searchbar-modal-button" onClick={onClickzzimButton}>찜하기</button>)}
              </>
            ) : (
              <p>아이템을 선택해주세요.</p>
            )}
          </div>
        </div>
      )}
    
      {/* 세 번째 모달 */}
      {isThirdModalOpen && (
        <div
          style={{
            position: 'fixed',  // 변경된 부분
            top: `${modalPosition.top + 100}px`,  // viewport에 상대적인 위치
            left: `${modalPosition.left + 413}px`, // 첫 번째 모달과 두 번째 모달의 위치를 고려하여 조정
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 110,
            flexDirection: 'column',
            width: '300px',
            height: '200px',
            overflow: 'hidden',
          }}
        >
          <button
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px', // 우측 상단에 고정
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '16px',
              cursor: 'pointer',
              zIndex: 120, // 버튼이 다른 요소 위로 오게끔 설정
            }}
            onClick={ThirdModelClose}
          >
            ✖
          </button>
    
          {/* 스크롤 가능한 내용 영역 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',  // 세로 스크롤
              marginTop: '30px', // 버튼 아래로 여백 추가
            }}
          >
            {playlists.map((playlist) => (
              <div key={playlist.playlistId} className="playlist-item">
                {isplyLoading ? (<div className="playlists-loading"><p></p></div>) : (<button 
                  className="playlist-list" 
                  onClick={() => {
                    handleClick(selectedItem, playlist);
                    AddbooktoPlaylist(selectedItem, playlist);
                  }}>{playlist.title || "제목없음"}</button>)}
              </div>
            ))}
            <button className="adding" onClick={AddmodalOpen}>+</button>
          </div>
        </div>
      )}
    
      {/* Playlist Modal */}
      {addmodalOpen && (
        <PlaylistModal
          playlistId={selectedPlaylistId}
          addPlaylist={addPlaylist}
          onClose={closeAddModal}
          bookitem={selectedItem}
          style={{
            zIndex: 120000,  // PlaylistModal이 가장 높은 z-index를 가지도록 설정
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;
