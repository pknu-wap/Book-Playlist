import React, { useState, useEffect,navigate,useRef } from "react";
import axios from "axios";
import "./SearchBar.css";
import PlaylistModal from "./PlaylistModal.js";
import { useNavigate } from "react-router-dom";
import Moreview from "./더보기.png";

const SearchBar = () => {
  const [username, setUsername] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0, isOpen: false });
  const [thirdmodalPosition, setThirdModalPosition] = useState({ top: 0, left: 0, isOpen: false });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addmodalOpen, setAddmodalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedIsbn, setSelectedIsbn] = useState(null);
  const [isplyLoading,setIsplyLoading] = useState(false);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchUserData = async () => {
        const token = getToken();
      if (!token) {
        alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
        setIsLoading(false); 
        return;
      }
      try {
        const [profileResponse, playlistsResponse] = await axios.all([
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/mine/playlists', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (profileResponse.data?.username) setUsername(profileResponse.data.username);
        if (playlistsResponse.data) setPlaylists(playlistsResponse.data);
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const addPlaylist = (newPlaylist) => {
    setPlaylists([...playlists, newPlaylist]);
  };

  const navigate = useNavigate(); // useNavigate 훅 추가

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
    setIsSecondModalOpen(false);  // 두 번째 모달도 닫기
    setIsThirdModalOpen(false);   // 세 번째 모달도 닫기
  };

  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
    setIsThirdModalOpen(false);
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
    setSelectedItem(item);
    setIsSecondModalOpen(true);
    
    // 동위 인덱스 출력
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
    const token = getToken();
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      setIsLoading(false); 
      return;
    }
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
        { isbn: selectedIsbn },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("전송된 요청 데이터:", {
        isbn: selectedIsbn,
        token: token, // 사용된 토큰을 콘솔에 로그로 남깁니다
      });
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
    width: '720px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ddd',
    height:'140px'
  };

  const imageStyle = {
    width: '90px',
    height: '130px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '20px',
    marginLeft:'10px',
    marginTop:'10px',
    marginBottom:'10px',
    boxShadow:'1px 2px 2px rgb(55,55,55,0.2)'
  };

  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '5px',
    maxWidth: '300px',
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
    closeModal();
    navigate(`/book/${book.id}`, { state: { book } }); // 책 상세 페이지로 이동
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const AddbooktoPlaylist = async (item, playlist) => {
    const token = getToken();
    try {
      setIsplyLoading(true);
      console.log("클릭한 플레이리스트Id:", playlist.playlistId);  // playlistId 확인
      console.log("isbn:", item.isbn);  // isbn 확인
      
      const response = await axios.post(
        `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/${playlist.playlistId}/addBook?isbn=${item.isbn}`,  // isbn을 query parameter로 전달
        { isbn: selectedIsbn },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } // 로그인 상태 유지
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
      {/* 검색 바 디자인 */}
      <div
      className="search-bar-box"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          top: "20px",
          marginLeft:'105%',
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "750px", 
          maxWidth: "800px",
          height: "60px",
          backgroundColor: "white", 
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
          placeholder="책을 검색해주세요!"
          style={{
            flex: 1,
            height: "50px",
            border: "none",
            outline: "none",
            fontSize: "16px",
            borderRadius: "30px 0 0 30px",
            backgroundColor: "#fff",
          }}
        />
        <button
          className="search-button"
          onClick={handleSearch}
          style={{
            
            height: "40px",
            fontSize: "16px",
            border: "none",
            borderRadius: "0 30px 30px 0",
            backgroundColor: "white",
            color: "#61d87b",
            cursor: "pointer",
          }}
        >
          <span className="material-symbols-outlined">Search</span>
        </button>
      </div>
    
      {/* 검색 결과 모달 */}
      {isModalOpen && (
        <div
          style={{
            position: "absolute",
            top: "75px",
            left: "0px",
            right: "0",
            backgroundColor: "rgba(0, 0, 0, 0)",
            display: "flex",
            bottom:'0',
            paddingRight:"50%",
            paddingLeft:"440px",
            zIndex: 99,
            paddingTop: "10px",
          }}
          onClick={handleModalClick}
        >
          <div
            className="modal-content"
            style={{
              height:'500px',
              border:'1px solid lightgray',
              backgroundColor: "white",
              borderRadius: "30px",
              width: "750px",
              maxWidth: "750px",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
            onClick={(e) =>e.stopPropagation()}
          >
            <div>
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div
                    className="modal-search-result"
                    key={item.id || item.isbn}
                    style={resultItemStyle}
                    onClick={() => handleBookClick(item)}
                  >
                    <img
                      src={item.image}
                      style={imageStyle}
                      alt={item.title}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={titleStyle}>{item.title}</p>
                      <p style={authorStyle}>{item.author}</p>
                    </div>
                    <div className='dots'
                    
                    onClick={(e) => handleButtonClick(e, item)}
                    >
                     
                   </div> 
                  </div>
                ))
              ) : (
                <p>검색 결과가 없습니다.</p>
              )}
            </div>
            {/* 스크롤바 숨기기 */}
            <style>
              {`
                .modal-content::-webkit-scrollbar {
                  display: none; /* 웹킷 기반 브라우저에서 스크롤바 숨기기 */
                }
              `}
            </style>
          </div>
        </div>
      )}
    
      {/* 두 번째 모달 */}
      {isSecondModalOpen && (
        <div
          style={{
            height: '142px',
            marginLeft: '20px',
            position: 'absolute',
            marginTop: `${modalPosition.top - 100}px`,
            marginLeft:"1060px",
            backgroundColor: 'rgba(0, 0, 0, 0)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            width: '200px',
            transform: 'translateY(0)',  // 상대적 위치 조정
          }}
        >
          <div className="searchbar-second-modal" style={{border:'2px solid lightgray', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',borderRadius:'30px' }}>
            {selectedItem ? (
              <>
                <button onClick={closeSecondModal} style={{
                  width:'140px',
                  margin:'0 0 0 0',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '10px',
                  borderBottom:'1px solid lightgray'
                }}>
                  ✖
                </button>
                <button
                  className="searchbar-modal-button"
                  onClick={(e) => handleSecondButtonClick(e)}
                >
                  <p className="s-p">플레이리스트 추가</p>
                </button>
                {isLoading ? (<div className="playlists1-loading"></div>):(
                  <button 
                    className="searchbar-modal-button" 
                    onClick={onClickzzimButton}
                    style={{borderRadius:'0 0 30px 30px'}}
                  >
                    찜하기
                  </button>
                )}
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
            position: 'absolute',
            top: `${modalPosition.top + 100}px`,
            left: `${modalPosition.left + 410}px`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: '30px',
            padding: '10px',
            border: '1px solid lightgray',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 110,
            flexDirection: 'column',
            width: '150px',
            height: '200px',
            overflow: 'hidden',  // 전체 모달 영역에서 스크롤 숨기기
          }}
        >
          <button
            style={{
              position: 'absolute',
              paddingBottom:"10px",
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '15px',
              cursor: 'pointer',
              width:"180px",
              zIndex: 120,
              borderBottom:'1px solid lightgray'
            }}
            onClick={ThirdModelClose}
          >
            ✖
          </button>

          {/* 스크롤을 허용하되, 스크롤바는 숨기기 */}
          <div
            className="t-b"
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflowX: 'hidden',
              overflowY: 'auto',  // 세로 스크롤 허용
              marginTop: '30px', // 버튼 아래로 여백 추가
              maxHeight: 'calc(100% - 40px)', // 전체 모달 높이에 맞게 조정
              }}
          >
            {playlists.map((playlist) => (
              <div key={playlist.playlistId} className="playlist-item">
                {isplyLoading ? (
                  <div className="playlists1-loading"><p></p></div>
                ) : (
                  <button
                    className="playlist-list"
                    onClick={() => {
                      handleClick(selectedItem, playlist);
                      AddbooktoPlaylist(selectedItem, playlist);
                    }}
                  >
                    {playlist.title || "제목없음"}
                  </button>
                )}
              </div>
            ))}
            <button className="adding" onClick={AddmodalOpen}>+</button>
          </div>

          {/* 웹킷 브라우저에서 스크롤바 숨기기 */}
          <style>
            {`
              /* 웹킷 기반 브라우저에서 스크롤바 숨기기 */
              .playlist-item::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
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
