import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/SimpleSlider.css";

const playlists = Array.from({ length: 100 }, (_, index) => ({
  id: `playlist-${index + 1}`,
  title: `플레이리스트 ${index + 1}`,
  author: '저자명',
  imageUrl: `https://via.placeholder.com/150?text=Item+${index + 1}`,
}));

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "gray", width:'18px', height:'16px', borderRadius:'50%' }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "gray", width:'18px', height:'16px', borderRadius:'50%'}}
      onClick={onClick}
    />
  );
}

function SimpleSlider() {
  const settings = {
    arrows: true,
    dots: true,
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
    maxWidth: '1100px', // 최대 너비
    minWidth: '800px',  // 최소 너비
    padding: '0 20px',
    boxSizing: 'border-box',
    marginLeft: '100px',
    marginRight: '100px',
    marginBottom: '100px',
  };

  
    return (
      <main  className="slider-container" style={containerStyle}>
        <div>
          <h3> 지금 가장 핫한 플레이리스트를 만나보세요 !</h3>
          <Slider {...settings}>
            {playlists.map((book) => (
              <div key={book.id} style={{ textAlign: 'center', margin: '0 5px', padding: '10px'}}>
                <img src={book.imageUrl} alt={book.title} style={{
                  marginLeft:'40px',
                  width: '100px', // 이미지 너비 100%
                  objectFit: 'cover', // 이미지 비율 유지
                }} />
                <h4 className='book-title' style={{marginLeft:'40px', width:'110px', paddingRight:'20px', marginBottom:'0'}}>{book.title}</h4>
                <p className="author" style={{marginLeft:'40px', marginTop:'10px'}}>저자: {book.author}</p>
              </div>
            ))}
          </Slider>
        </div>
      </main>
    );
}

export default SimpleSlider;
