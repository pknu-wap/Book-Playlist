import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/SimpleSlider.css";

// Arrow components for the slider
const SampleNextArrow = ({ className, style, onClick }) => (
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

const SamplePrevArrow = ({ className, style, onClick }) => (
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

const SimpleSlider = () => {
  const [hoveredBook, setHoveredBook] = useState(null); // 현재 hover된 책의 ID
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [books, setBooks] = useState([]);

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
    boxSizing: "border-box",
    margin: "0 100px 100px",
  };

  return (
    <main className="slider-container" style={containerStyle}>
      <h3>지금 가장 핫한 책을 만나보세요!</h3>
      {loading ? ( // 로딩 상태에 따라 로딩 메시지 표시
        <div className="loader">로딩 중...</div>
      ) : (
        <Slider {...settings}>
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                textAlign: "center",
                margin: "0 5px",
                padding: "10px",
              }}
            >
              <img
                src={book.image}
                alt={book.title}
                style={{
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

              <h4
                className="book-title"
                style={{
                  margin: "10px 0 0",
                  width: "100px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {book.title}
              </h4>
              <p>{book.author}</p>
            </div>
          ))}
        </Slider>
      )}
    </main>
  );
};

export default SimpleSlider;

  // // API 요청을 위한 함수
  // const handleSearch = async () => {
  //   setLoading(true); // 요청 시작 시 로딩 상태 true로 설정
  //   try {
  //     const response = await axios.get(
  //       `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/search/books`,
  //       {
  //         params: { query: "한강" }, // 검색할 쿼리
  //       }
  //     );
  
  //     // JSON 응답에서 items에 순서 부여
  //     const itemsWithId = response.data.items.map((item, index) => ({
  //       ...item, // 기존 item의 모든 속성을 복사
  //       id: index + 1, // index + 1로 id 속성 추가
  //     }));
  
  //     setSearchResults(itemsWithId); // API 응답으로부터 책 목록 설정
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false); // 요청 완료 후 로딩 상태 false로 설정
  //   }
  // };
  
  // useEffect(() => {
  //   handleSearch(); // 컴포넌트가 마운트될 때 API 요청
  // }, []);
