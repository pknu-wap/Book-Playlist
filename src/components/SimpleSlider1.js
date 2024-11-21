import React, { useState, useEffect, Suspense, lazy } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/SimpleSlider.css";
import axios from "axios";

const Modals = lazy(() => import("../BookPlaylist/Modals")); // 동적 import

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

// 화살표 커스터마이징
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "gray",
        width: "18px",
        height: "16px",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "gray",
        width: "18px",
        height: "16px",
        borderRadius: "50%",
      }}
      onClick={onClick}
    />
  );
}

function SimpleSlider() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const settings = {
    arrows: true,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    centerPadding: "20px",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true);
      const data = await fetchPlaylists();
      if (data) {
        setPlaylists(data);
        setError(null);
      } else {
        setError("플레이리스트를 불러오는 데 실패했습니다.");
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
      alert("플레이리스트 데이터를 불러오는 데 실패했습니다.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlaylist(null);
  };
  const containerStyle = {
    width: '100%',
    maxWidth: '1200px',
    minWidth: '1100px',
    padding: '0 20px',
    boxSizing: 'border-box',
    marginLeft: '100px',
    marginRight: '100px',
    marginBottom: '100px',
  };
  return (
    <main className="slider-container" style={containerStyle}>
      <h3>지금 가장 핫한 플레이리스트를 만나보세요!</h3>
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <Slider {...settings}>
          {playlists.map((playlist) => (
            <div
              key={playlist.playlistId}
              onClick={() => handleItemClick(playlist.playlistId)}
              style={{
                textAlign: "center",
                margin: "0 5px",
                padding: "10px",
                cursor: "pointer",
              }}

            >
              <img
                src={`data:image/jpeg;base64,${playlist.base64Image}`}
                alt={playlist.title}
                style={{
                  objectFit: "cover",
                  width: "180px",
                  height: "282px",
                  borderRadius: "10px",
                }}
                className="book_image"
              />
              <h4>{playlist.title}</h4>
              <p style={{ color: "gray", fontSize: "13px" }}>
                만든이: {playlist.username}
              </p>
            </div>
          ))}
        </Slider>
      )}
      <Suspense fallback={<div>Loading Modal...</div>}>
        <Modals
          show={isModalOpen}
          onClose={handleCloseModal}
          data={selectedPlaylist}
          loading={modalLoading}
        />
      </Suspense>
    </main>
  );
}

export default SimpleSlider;
