import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/SimpleSlider.css";
import LeftArrow from "../BookPlaylist/left-arrow.svg";
import RightArrow from "../BookPlaylist/right-arrow.svg";

const arrowCss = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
};

const SampleNextArrow = ({ currentSlide, slideCount, ...props }) => (
  <img src={RightArrow} alt="nextArrow" {...props} style={arrowCss} />
);

const SamplePrevArrow = ({ currentSlide, slideCount, ...props }) => (
  <img src={LeftArrow} alt="preArrow" {...props} style={arrowCss} />
);

const SimpleSlider = () => {
  const [hoveredBook, setHoveredBook] = useState(null); // 현재 hover된 책의 ID
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/search/top-by-likes",
          { withCredentials: true }
        );
        const sortedBooks = response.data.sort((a, b) => b.likeCount - a.likeCount);
        setBooks(sortedBooks.slice(0, 20));
      } catch (error) {
        console.error("찜한 책 목록을 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`, { state: { book } }); // 책 상세 페이지로 이동
  };
  
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

  const containerStyle = {
    width: "100%",
    maxWidth: "1200px",
    minWidth: "1100px",
    padding: "0 20px",
    marginLeft: "100px",
    marginRight: "100px",
    marginBottom: "100px",
  };

  return (
    <main className="slider-container" style={containerStyle}>
      <h3 style={{ marginLeft: "20px" }}>지금 가장 핫한 책을 만나보세요!</h3>
      {loading ? ( // 로딩 상태에 따라 로딩 메시지 표시
        <div className="loader"></div>
      ) : (
        <Slider {...settings}>
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                textAlign: "center",
                margin: "0 5px",
                padding: "10px",
                cursor: "pointer", // 클릭 가능한 포인터로 설정
              }}
              onClick={() => handleBookClick(book)} // 클릭 이벤트 추가
            >
              <img
                src={book.image}
                alt={book.title}
                style={{
                  marginLeft: "40px",
                  marginTop: "20px",
                  objectFit: "cover",
                  width: "143.81px",
                  height: "190.4px",
                  borderRadius: "10px",
                  transition: "transform 0.3s ease",
                  transform: hoveredBook === book.id ? "scale(1.1)" : "scale(1)",
                }}
                onMouseEnter={() => setHoveredBook(book.id)}
                onMouseLeave={() => setHoveredBook(null)}
              />
              <h3
                className="book-title"
                style={{
                  margin: "10px 0 0 50px",
                  width: "100px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {book.title}
              </h3>
              <p
                style={{
                  color: "lightgray",
                  margin: "10px 0 0 55px",
                  width: "100px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {book.author}
              </p>
            </div>
          ))}
        </Slider>
      )}
    </main>
  );
};

export default SimpleSlider;