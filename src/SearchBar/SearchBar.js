import React, { useState, useEffect,navigate } from "react";
import axios from "axios";
import "./SearchBar.css";
import PlaylistModal from "../Mypage/playlist";

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
  const [isLoading, setIsLoading] = useState(true);
  const [addmodalOpen, setAddmodalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileResponse, playlistsResponse] = await axios.all([
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/profile', { withCredentials: true }),
          axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/mine/playlists', { withCredentials: true }),
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
    setIsThirdModalOpen();
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
    console.log('버튼 클릭된 아이템:', item);
    setSelectedItem(item);
    setIsSecondModalOpen(true);
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

  const handleClick = (playlist) => {
    console.log(playlist);
  };

  const ThirdModelClose = () => {
    setIsThirdModalOpen(false);
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

  const buttonStyle = {
    position: "relative",
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
            width: "100%",
            position: 'absolute',
            top:'70px',
            left:'0',
            right:'0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            zIndex: 99,
            paddingTop: '10px',
          }}
          onClick={handleModalClick}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: 'white',
              padding: '0px',
              borderRadius: '8px',
              maxWidth: '600px',
              maxHeight: '50vh',
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
                      onClick={(e) => handleButtonClick(e, item)}
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

      {isSecondModalOpen && (
        <div
          style={{
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            height:'150px',
            marginLeft: '20px',
            position: 'absolute',
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            width: '200px',
          }}
        >
          <div className="searchbar-second-modal">
            {selectedItem ? (
              <>
                <button onClick={closeSecondModal} style={{             
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding:'10px'  
                }}>
                    ✖
                </button>
                <button
                  className="searchbar-modal-button"
                  onClick={(e)=>handleSecondButtonClick(e)}
                >
                  플레이리스트 추가
                </button>
                <button className="searchbar-modal-button">찜하기</button>
              </>
            ) : (
              <p>아이템을 선택해주세요.</p>
            )}
          </div>
        </div>
      )}

      {isThirdModalOpen && (
        <div
          style={{
            overflow:'scroll',
            width:'300px',
            height:"200px",
            position: 'absolute',
            top: `${modalPosition.top + 100}px`,
            left: `${modalPosition.left + 413}px`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 110,

          }}
        >
          <button
            style={{
              position:'absolute',
              top:'10px',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '16px',
              cursor: 'pointer',
            }}
            onClick={ThirdModelClose}
          >
            ✖
          </button>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {playlists.map((playlist) => (
              <div key={playlist.playlistId} className="playlist-item">
                <button className="playlist-list" onClick={()=>handleClick(playlist)} >{playlist.title}</button>
              </div>
            ))}
            <button className="adding" onClick={AddmodalOpen}>+</button>
          </div>
        </div>
      )}
      {addmodalOpen && (
        <PlaylistModal
          playlistId={selectedPlaylistId}
          onClose={closeAddModal}
          style={{
            zIndex: 120000,  // PlaylistModal이 가장 높은 z-index를 가지도록 설정
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;
