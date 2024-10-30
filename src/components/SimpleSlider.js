import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/SimpleSlider.css";

const books = [
  {
    id: 1,
    title: "소년이 온다",
    author: "한강",
    imageUrl: "https://shopping-phinf.pstatic.net/main_3249140/32491401626.20231004072435.jpg",
    link: "https://search.shopping.naver.com/book/catalog/32491401626",
  },
  {
    id: 2,
    title: "채식주의자",
    author: "한강",
    imageUrl: "https://shopping-phinf.pstatic.net/main_3248204/32482041666.20230725121007.jpg",
    link: "https://search.shopping.naver.com/book/catalog/32482041666",
  },
  {
    id: 3,
    title: "작별하지 않는다",
    author: "한강",
    imageUrl: "https://shopping-phinf.pstatic.net/main_3243636/32436366634.20231124160335.jpg",
    link: "https://search.shopping.naver.com/book/catalog/32436366634",
  },
  {
    id: 4,
    title: "서랍에 저녁을 넣어 두었다",
    author: "한강",
    imageUrl: "https://shopping-phinf.pstatic.net/main_3246312/32463129802.20230906071157.jpg",
    link: "https://search.shopping.naver.com/book/catalog/32463129802",
  },
  {
    id: 5,
    title: "흰",
    author: "한강",
    imageUrl: "https://shopping-phinf.pstatic.net/main_3247462/32474620790.20230411162531.jpg",
    link: "https://search.shopping.naver.com/book/catalog/32474620790",
  },
  {
    id: 6,
    title: "디 에센셜: 한강(무선 보급판)",
    author: "한강",
    imageUrl: "https://shopping-phinf.pstatic.net/main_4033456/40334563624.20230905101215.jpg",
    link: "https://search.shopping.naver.com/book/catalog/40334563624",
  },
  {
    id: 7,
    title: "희랍어 시간",
    author: "한강",
    imageUrl: "https://shopping-phinf.pstatic.net/main_3247609/32476098329.20230829085010.jpg",
    link: "https://search.shopping.naver.com/book/catalog/32476098329",
  },
  {
    id: 8,
    title: "바람이 분다 가라",
    author: "한강",
    imageUrl: "https://shopping-phinf.pstatic.net/main_3243612/32436121771.20240420071014.jpg",
    link: "https://search.shopping.naver.com/book/catalog/32436121771",
  },
  {
    id: 9,
    title: "여수의 사랑",
    author: "한강",
    imageUrl: "https://shopping-phinf.pstatic.net/main_3247665/32476659958.20221019142626.jpg",
    link: "https://search.shopping.naver.com/book/catalog/32476659958",
  },
  {
    id: 10,
    title: "천둥 꼬마 선녀 번개 꼬마 선녀",
    author: "한강",
    imageUrl: "https://shopping-phinf.pstatic.net/main_3249260/32492607737.20230502164320.jpg",
    link: "https://search.shopping.naver.com/book/catalog/32492607737",
  }
];

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "gray", width: "18px", height: "16px", borderRadius: "50%" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "gray", width: "18px", height: "16px", borderRadius: "50%" }}
      onClick={onClick}
    />
  );
}

function SimpleSlider() {
  const [hoveredBook, setHoveredBook] = useState(null); // 현재 hover된 책의 ID

  const settings = {
    arrows: true,
    lazyLoad: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    centerPadding: "20px",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  const containerStyle = {
    width: "100%",
    maxWidth: "1200px",
    minWidth: "1100px",
    padding: "0 20px",
    boxSizing: "border-box",
    marginLeft: "100px",
    marginRight: "100px",
    marginBottom: "100px"
  };

  return (
    <main className="slider-container" style={containerStyle}>
      <div>
        <h3>지금 가장 핫한 책을 만나보세요!</h3>
        <Slider {...settings}>
          {books.map((book) => (
            <div key={book.id} style={{ textAlign: "center", margin: "0 5px", padding: "10" }}>
              <a href={book.link}>
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  style={{
                    marginTop: "20px",
                    marginLeft: "20px",
                    objectFit: "cover",
                    width: "143.81px",
                    height: "190.4px",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease",
                    transform: hoveredBook === book.id ? "scale(1.1)" : "scale(1)"
                  }}
                  onMouseEnter={() => setHoveredBook(book.id)}
                  onMouseLeave={() => setHoveredBook(null)}
                />
              </a>
              <h4 className="book-title" style={{ marginLeft: "40px", width: "100px", paddingRight: "20px", marginBottom: "0" }}>
                {book.title}
              </h4>
            </div>
          ))}
        </Slider>
      </div>
    </main>
  );
}

export default SimpleSlider;
