import React, { useState } from 'react';
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SimpleSlider from './components/SimpleSlider.js';
import SimpleSlider1 from './components/SimpleSlider1.js';
import Playlist from './playlist/playlist.js';

const books = Array.from({ length: 20 }, (_, index) => ({
  id: `book-${index + 1}`,
  title: `책 ${index + 1}`,
  author: '저자명',
  imageUrl: `https://via.placeholder.com/150?text=Item+${index + 1}`,
}));

const playlists = Array.from({ length: 20 }, (_, index) => ({
  id: `playlist-${index + 1}`,
  title: `플레이리스트 ${index + 1}`,
  author: '저자명',
  imageUrl: `https://via.placeholder.com/150?text=Item+${index + 1}`,
}));

const Sidebar = () => {
  return (   
    <aside>
      <div className="sidebar" style={{width:'150px', height:'1000px', float:'left'}}>
        <nav>
          <ul style={{ width: '250px', height: '40px', fontFamily: 'Pretendard Variable', fontStyle: 'normal', fontWeight: 500, fontSize: '18px', lineHeight: '42px', color: '#000000' }}>
            <li><a href="#" >로그인</a></li>
            <li><a href="#">회원가입</a></li>
            <li><a href="#">마이페이지</a></li>
            <li><a href="#">북 카테고리</a></li>
            <li><a href="#">전체 북 플레이리스트</a></li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

const PlaylistButton = ({onClick}) => {
  return (
    <div className="MakePlaylist">
      <button className="playlistButton" type="button" onClick={onClick}>플레이리스트 만들기</button>
    </div>
  );
}


const Header = () => {
  return (
    <header className="header">

      <img src="logo192.png" alt="책 이미지" className='logo' href="./App.js"/>

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
  const [isPlaylistOpen, setIsPlaylistModalOpen] = useState(false);

  const openPlaylistModal = () => {
    setIsPlaylistModalOpen(true);
  };

  const closePlaylistModal = () => {
    setIsPlaylistModalOpen(false);
  };
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
        <PlaylistButton onClick={openPlaylistModal} />
        {isPlaylistOpen && <Playlist onClose={closePlaylistModal} />}
      </main>
    </div>
  );
}

export default App;
