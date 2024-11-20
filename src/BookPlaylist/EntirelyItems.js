import React, { useState, useEffect } from "react";
import "./EntireItem.css";
import Filter from "./Filter.js";
import Pagination from "../components/Pagination";
import axios from "axios";

// API 요청 함수
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

// 모달 컴포넌트
const Modals = ({ show, onClose, data, loading }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>닫기</button>
        {loading ? (
          <div className="playlist-loading"></div>
        ) : data ? (
          <>
            <img
              src={`data:image/jpeg;base64,${data.base64Image || ""}`}
              alt={data.title}
            />
            <h2>{data.title}</h2>
            <p>작성자: {data.username}</p>
            <p>설명 : {data.description}</p>
            <button>찜하기</button>
            <p>찜 수: (추가 데이터 필요)</p>

            {/* books 값 나열 */}
            {data.books && data.books.length > 0 ? (
              <div className="books-list">
                <h3>책 목록:</h3>
                {data.books.map((book) => (
                  <div key={book.isbn} className="book-item">
                    <img
                      src={book.image}
                      alt={book.title}
                      style={{ width: "50px", height: "75px" }}
                    />
                    <div>
                      <h4>{book.title}</h4>
                      <p>저자: {book.author}</p>
                      <p>ISBN: {book.isbn}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>책 데이터가 없습니다.</p>
            )}
          </>
        ) : (
          <p>데이터를 불러올 수 없습니다.</p>
        )}
      </div>
    </div>
  );
};


// 전체 아이템 컴포넌트
const EntireItems = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const itemsPerPage = 25;

  // 플레이리스트 불러오기
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

  const handleItemClick = async (playlistId) => {
    setModalLoading(true);
    setIsModalOpen(true);
    const data = await fetchPlaylistDetails(playlistId);
    setModalLoading(false);

    if (data) {
      setSelectedPlaylist(data);
    } else {
      setSelectedPlaylist(null);
      alert("플레이리스트 데이터를 불러오는데 실패했습니다.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlaylist(null);
  };

  const sortedPlaylists = [...playlists].sort((a, b) =>
    sortOrder === "latest"
      ? b.playlistId - a.playlistId
      : a.playlistId - b.playlistId
  );

  const currentItems = sortedPlaylists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedPlaylists.length / itemsPerPage);

  return (
    <div>
      <Filter onSortChange={(order) => setSortOrder(order)} />
      {loading ? (
        <div className="playlist-loading"></div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="grid-container">
            {currentItems.map((playlist) => (
              <div key={playlist.playlistId}>
                <div
                  className="grid-item"
                  onClick={() => handleItemClick(playlist.playlistId)}
                >
                  <img
                    src={`data:image/jpeg;base64,${playlist.base64Image || ""}`}
                    alt={playlist.title}
                    style={{ width: "100px", height: "150px", borderRadius: "4px" }}
                  />
                  <p>{playlist.title}</p>
                  <p>{playlist.username}</p>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </>
      )}
      <Modals
        show={isModalOpen}
        onClose={handleCloseModal}
        data={selectedPlaylist}
        loading={modalLoading}
      />
    </div>
  );
};

export default EntireItems;
