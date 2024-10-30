import React from 'react';
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SimpleSlider from './components/SimpleSlider.js';
import SimpleSlider1 from './components/SimpleSlider1.js';
import Icon1 from './logos/아이콘1.png';
import Icon2 from './logos/아이콘2.png';
import Icon3 from './logos/아이콘3.png';
import Icon4 from './logos/아이콘4.png';
import Icon5 from './logos/아이콘5.png';
import Logo from './logos/로고.png';

const books = Array.from({ length: 20 }, (_, index) => (  {
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
));

const playlists = Array.from({ length: 20 }, (_, index) => ({
  id: `playlist-${index + 1}`,
  title: `플레이리스트 ${index + 1}`,
  author: '저자명',
  imageUrl: `https://via.placeholder.com/150?text=Item+${index + 1}`,
}));

const Sidebar = () => {
  return (   
    <aside>
      <div className="sidebar">
        <nav>
          <ul>
            <li>
              <img src={Icon1} alt="로그인 아이콘" />
              <a href="#">로그인</a>
            </li>
            <li>
              <img src={Icon2} alt="회원가입 아이콘" />
              <a href="#">회원가입</a>
            </li>
            <li>
              <img src={Icon3} alt="마이페이지 아이콘" />
              <a href="#">마이페이지</a>
            </li>
            <li>
              <img src={Icon4} alt="북 카테고리 아이콘" />
              <a href="#">북 카테고리</a>
            </li>
            <li>
              <img src={Icon5} alt="전체 북 플레이리스트 아이콘" />
              <a href="#">전체 북 플레이리스트</a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
const PlaylistButton = () => {
  return (
    <div className="MakePlaylist">
      <button className="playlistButton" type="button">플레이리스트 만들기</button>
    </div>
  );
}


const Header = () => {
  return (
    <header className="header">

      <img src={Logo} alt="로고 이미지" className='logo' />

      <SearchBar />
      <button className="login" style={{fontSize:'18px'}}>로그인 / 회원가입</button>
    </header>
  );
};

const SearchBar = () => {
  return (
    <input className="search-bar" type="text" placeholder="  검색어를 입력하세요" />
  );
};


function App() {
  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  };

  return (
    <div className="App">
      <Header />
      <div>
        <Sidebar />
      </div>
      <main className="main-content">
        <div className="slider-container">
          <section className="slider-section" style={{padding: '10px', marginRight:'200px'}}>
            <h2 style={{marginLeft:'120px'}}>🔥 BEST SELLER</h2>
            
            <SimpleSlider {...settings}>
              {books.map((book) => (
                <div key={book.id} style={{ textAlign: 'center', padding: '10px'}}>
                  <img src={book.imageUrl} alt={book.title} />
                  <h4 style={{ margin: '10px 0' }}>{book.title}</h4>
                </div>
              ))}
            </SimpleSlider>
          </section>

          <section className="slider-section" style={{padding: '10px', marginRight:'200px'}}>
            <h2 style={{marginLeft:'120px'}}>🔥 TODAY'S PLAYLIST</h2>
            <SimpleSlider1 playlists={playlists} {...settings}>
              {playlists.map((playlist) => (
                <div key={playlist.id} style={{ textAlign: 'center', padding: '10px' }}>
                  <img src={playlist.imageUrl} alt={playlist.title} />
                  <h4 style={{ margin: '10px 0' }}>{playlist.title}</h4>
                </div>
              ))}
            </SimpleSlider1>
          </section>
        </div>
         <PlaylistButton />
      </main>
    </div>
  );
}

export default App;
