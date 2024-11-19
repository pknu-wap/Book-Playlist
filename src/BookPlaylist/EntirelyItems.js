import React, { useState, useEffect } from "react";
import './EntireItem.css';
import Filter from "./Filter.js";
import Pagination from "../components/Pagination";
import axios from "axios";

const Modals = ({ show, onClose, data }) => {
  if (!show || !data) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>닫기</button>
        <img src={`data:image/jpeg;base64,${data.base64Image}`} alt={data.title} />
        <h2>{data.title}</h2>
        <p>{data.username}</p>
        <button>찜하기</button>
        <p>찜 수: </p>
      </div>
    </div>
  );
};

const PlaylistAPI = async () => {
  try {
    const response = await axios.get(
      "https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/playlists",
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const EntireItems = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const itemsPerPage = 25;
  const pagesPerGroup = 5;

  useEffect(() => {
    const fetchPlaylists = async () => {
      const data = await PlaylistAPI();
      if (data) {
        setPlaylists(data);
        setLoading(false);
      } else {
        setError("Failed to fetch playlists");
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleItemClick = (playlist) => {
    setSelectedPlaylist(playlist);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlaylist(null);
  };

  const sortedPlaylists = [...playlists].sort((a, b) =>
    sortOrder === "latest" ? b.playlistId - a.playlistId : a.playlistId - b.playlistId
  );

  const totalPages = Math.ceil(sortedPlaylists.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const currentItems = sortedPlaylists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const imageStyle = {
    width: "100px",
    height: "150px",
    borderRadius: "4px",
  };

  return (
    <div>
      <Filter onSortChange={handleSortOrderChange} />
      <div className="grid-container">
        {currentItems.map((playlist) => (
          <div
            key={playlist.playlistId}
            onClick={() => handleItemClick(playlist)}
            className="grid-item"
          >
            <img
              src={`data:image/jpeg;base64,${playlist.base64Image}`}
              alt={playlist.title}
              style={imageStyle}
            />
            <p>{playlist.title}</p>
            <p style={{ marginBottom: "10px" }}>{playlist.username}</p>
          </div>
        ))}
      </div>

      <Modals show={isModalOpen} onClose={handleCloseModal} data={selectedPlaylist} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pagesPerGroup={pagesPerGroup}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default EntireItems;
