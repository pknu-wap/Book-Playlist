import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/SimpleSlider.css";
import axios from "axios";

// API request to fetch playlists
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

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "gray", width: '18px', height: '16px', borderRadius: '50%' }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "gray", width: '18px', height: '16px', borderRadius: '50%' }}
      onClick={onClick}
    />
  );
}

function SimpleSlider() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [hoveredPlaylist, setHoveredPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const settings = {
    arrows: true,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    centerPadding: '20px',
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
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

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      const data = await PlaylistAPI();
      if (data) {
        setPlaylists(data);
      } else {
        setError("플레이리스트를 불러오는 데 실패했습니다.");
      }
      setLoading(false);
    };

    fetchPlaylists();
  }, []);

  return (
    <main className="slider-container" style={containerStyle}>
      <div>
        <h3> 지금 가장 핫한 플레이리스트를 만나보세요 !</h3>
        {loading ? (
          <div className="loader"></div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <Slider {...settings}>
            {playlists.slice(0, 20).map((book) => (
              <div key={book.playlistId} style={{ textAlign: 'center', margin: '0 5px', padding: '10px' }}>
                <img
                  src={`data:image/jpeg;base64,${book.base64Image}`}
                  alt={book.title}
                  style={{
                    marginTop: '20px',
                    marginLeft: '20px',
                    objectFit: 'cover',
                    width: '180px',
                    height: '282px',
                    borderRadius: '10px',
                    transition: 'transform 0.3s ease',
                    transform: hoveredPlaylist === book.playlistId ? 'scale(1.1)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredPlaylist(book.playlistId)}
                  onMouseLeave={() => setHoveredPlaylist(null)}
                />
                <h4 className="book-title" style={{ marginLeft: '40px', width: '110px', paddingRight: '20px', marginBottom: '0' }}>
                  {book.title}
                </h4>
                <p className="playlist-author" style={{ color: 'gray', fontSize: '13px', marginLeft: '40px' }}>
                  만든이 : {book.username}
                </p>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </main>
  );
}

export default SimpleSlider;
