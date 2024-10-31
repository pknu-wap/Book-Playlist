import React, { useState, useEffect } from "react"; // useEffect 추가
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/SimpleSlider.css";
import { SiCalendly } from "react-icons/si";
import axios from 'axios';

const SimpleSlider = () => {
  const [hoveredBook, setHoveredBook] = useState(null); // playlist에서 book으로 변경
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  // API 요청을 위한 함수
  const handlePlaylistSearch = async () => {
    setLoading(true); // 요청 시작 시 로딩 상태 true로 설정
    try {
      const response = await axios.get(`https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/top`);

      setSearchResults(response.data.items); // API 응답으로부터 책 목록 설정
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // 요청 완료 후 로딩 상태 false로 설정
    }
  };

  useEffect(() => {
    handlePlaylistSearch(); // 컴포넌트가 마운트될 때 API 요청
  }, []);

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
    maxWidth: '1200px', // 최대 너비
    minWidth: '1100px',  // 최소 너비
    padding: '0 20px',
    boxSizing: 'border-box',
    marginLeft: '100px',
    marginRight: '100px',
    marginBottom: '100px',
  };

  return (
    <main className="slider-container" style={containerStyle}>
      <div>
        <h3>지금 가장 핫한 책들을 만나보세요 !</h3> {/* 제목 수정 */}
        <Slider {...settings}>
          {searchResults.map((book) => ( // playlists를 searchResults로 변경하고, playlist를 book으로 변경
            <div key={book.id} style={{ textAlign: 'center', margin: '0 5px', padding: '10px' }}>
              <img src={book.imageUrl} alt={book.title} style={{
                marginTop: '20px',
                marginLeft: '20px',
                objectFit: 'cover', // 이미지 비율 유지
                width: '180px',
                height: '282px',
                borderRadius: '10px',
                transition: 'transform 0.3s ease',
                transform: hoveredBook === book.id ? 'scale(1.1)' : 'scale(1)',
              }}
                onMouseEnter={() => setHoveredBook(book.playlistId)} // hoveredPlaylist를 hoveredBook으로 변경
                onMouseLeave={() => setHoveredBook(null)} />
              <h4 className='book-title' style={{ marginLeft: '40px', width: '110px', paddingRight: '20px', marginBottom: '0' }}>{book.title}</h4>
              <p className='playlist-author' style={{ color: 'gray', fontSize: '13px', marginLeft: '40px' }}>저자 : {book.username}</p> {/* '만든이'를 '저자'로 변경 */}
            </div>
          ))}
        </Slider>
      </div>
    </main>
  );
}

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

export default SimpleSlider;
