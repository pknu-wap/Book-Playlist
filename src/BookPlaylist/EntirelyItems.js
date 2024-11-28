import React, { useState, useEffect, lazy, Suspense } from "react";
import "./EntireItem.css";
import Filter from "./Filter.js";
import Pagination from "../components/Pagination";
import axios from "axios";
import Mainpageplaylist from '../components/Mainpageplaylist.js'

const fetchPlaylists = async () => {
  try {
    const response = await axios.get(
      "https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/playlists",
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("플레이리스트 목록을 불러오는 데 실패했습니다.", error);
    return null;
  }
};

const fetchPlaylistDetails = async (playlistId) => {
  try {
    const response = await axios.get(
      `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/${playlistId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(`플레이리스트 ${playlistId} 데이터를 불러오는 데 실패했습니다.`, error);
    return null;
  }
};

const EntireItems = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const itemsPerPage = 15;

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true);
      const data = await fetchPlaylists();
      if (data) {
        setPlaylists(data);
        setError(null);
      } else {
        setError("플레이리스트를 불러오는데 실패했습니다.");
      }
      setLoading(false);
    };

    loadPlaylists();
  }, []);

  const openModal = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setSelectedPlaylistId(null);
    setIsModalOpen(false);
  };

  const sortedPlaylists = [...playlists];
  switch(sortOrder){
    case "latest":
      sortedPlaylists.sort((a,b)=>b.playlistId-a.playlistId);
      break;
    case "date":
      sortedPlaylists.sort((a,b)=>a.playlistId-b.playlistId);
      break;
    case "best":
      sortedPlaylists.sort((a,b)=>b.likeCount-a.likeCount);
      break;
    default:
      break;
  }

  const currentItems = sortedPlaylists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedPlaylists.length / itemsPerPage);

  return (
    <div>
      <Filter onSortChange={(order) => setSortOrder(order)} />
      {loading ? (
        <div className="playlists-loading"></div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="grid-container">
            {currentItems.map((playlist) => (
              <div key={playlist.playlistId}>
                <div
                  className="grid-item"
                  onClick={() => openModal(playlist.playlistId)}
                >
                  <img
                    src={`data:image/jpeg;base64,${playlist.base64Image || ""}`}
                    alt={playlist.title}
                    style={{ width: "200px", height: "275px", borderRadius: "10px",boxShadow:'2px 4px 4px rgba(0, 0, 0, 0.5)' }}
                    id="grid-item-img"
                  />
                  <p 
                    style={{
                      fontWeight: 'bold',
                      margin: '0px',
                      fontSize: '25px',
                      whiteSpace: 'nowrap',      // 텍스트가 한 줄로 유지되도록 설정
                      overflow: 'hidden',       // 넘친 텍스트를 숨김
                      textOverflow: 'ellipsis', // 넘친 부분에 ... 추가
                    }}>
                      {playlist.title || "제목 없음"}
                  </p>
                  <p style={{margin:'0px', color:'lightgray'}}>만든이 : {playlist.username}</p>
                  <p style={{paddingBottom:'10px', color:'lightgray'}}> ❤️ {playlist.likeCount}</p>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pagesPerGroup={5} // 예시로 5페이지 그룹
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </>
      )}
      {isModalOpen && (
        <Mainpageplaylist playlistId={selectedPlaylistId} onClose={closeModal} />
      )}
    </div>
  );
};

export default EntireItems;