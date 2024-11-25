import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Outlet, NavLink } from 'react-router-dom';
import './App.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SimpleSlider from './components/SimpleSlider.js';
import SimpleSlider1 from './components/SimpleSlider1.js';
import Playlist from './playlist/playlist.js';
import SearchBar from './SearchBar/SearchBar.js';
import Icon3 from './logos/아이콘3.png';
import Icon4 from './logos/아이콘4.png';
import Icon5 from './logos/아이콘5.png';
import Logo from './logos/로고.png';
import Login from './login,register/Login.jsx';
import Register from './login,register/Register.jsx';
import axios from 'axios'; // axios를 import합니다.
import BookDetail from './BookDetail';
import BookPlaylist from './BookPlaylist/BookPlaylist.js';
import CaterGory from './BookCategory/BookCategory.js';
import MyPage from './Mypage/Mypage.js'



const Sidebar = () => {
  return (   
    <aside>
      <div className="sidebar">
        <nav>
          <ul>
            <Outlet />
            <li>
              <img src={Icon3} alt="Icon3" />
              <Link to="/mypage">마이페이지</Link>
            </li>
            <li>
              <img src={Icon4} alt="Icon4" />
              <NavLink to="/bookcatergory">북 카테고리</NavLink>
            </li>
            <li>
              <img src={Icon5} alt="Icon5" />
              <NavLink to="/bookplaylist">전체 북 플레이리스트</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

const PlaylistButton = ({ onClick }) => {
  return (
    <div className="MakePlaylist">
      <button className="playlistButton" type="button" onClick={onClick}>플레이리스트 만들기</button>
    </div>
  );
}

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isLoggedIn) {
      onLogout(); // 로그아웃 수행
    } else {
      navigate('/login'); // 로그인 페이지로 이동
    }
  };
  const onClickLogo=()=>{
    navigate('/');
  }
  return (
    <header className="header">
      <Outlet />
      <div>
        <img src={Logo} alt="책 이미지" className="logo" onClick={onClickLogo}/>
        <SearchBar />
        <button className="login" style={{ fontSize: '18px' }} onClick={handleAuthClick}>
          {isLoggedIn ? '로그아웃' : '로그인 / 회원가입'}
        </button>
      </div>
    </header>
  );
};



function App() {
  const [isPlaylistOpen, setIsPlaylistModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const location = useLocation();

  const isLoginOrRegisterPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // API 요청을 위한 useEffect
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/search/books",
          {
            params: { query: "한강" },
          }
        );

        const itemsWithId = response.data.items.map((item, index) => ({
          ...item,
          id: index + 1,
        }));

        setBooks(itemsWithId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBooks();
  }, []);

  const openPlaylistModal = () => {
    if (!isLoggedIn) {
      alert('로그인/회원가입을 해주세요.');
      navigate('/login');
    } else {
      setIsPlaylistModalOpen(true);
    }
  };

  const closePlaylistModal = () => {
    setIsPlaylistModalOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.');
  };

  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
  };

  const playlists = Array.from({ length: 20 }, (_, index) => ({
    id: `playlist-${index + 1}`,
    title: `플레이리스트 ${index + 1}`,
    author: '저자명',
    imageUrl: `https://via.placeholder.com/150?text=Item+${index + 1}`,
  }));

  return (
    <div className="App">
      {!isLoginOrRegisterPage && <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      {!isLoginOrRegisterPage && <Sidebar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <div className="slider-container">
                <section className="slider-section" style={{ padding: '10px', marginRight: '200px' }}>
                  <h1 style={{marginLeft: '120px', fontSize:'35px' }}>🔥 BEST SELLER</h1>
                  <SimpleSlider {...settings}>
                    {books.map((book) => (
                      <div key={book.id} style={{ textAlign: 'center', padding: '10px' }}>
                        <img src={book.imageUrl} alt={book.title} />
                        <h4 style={{ margin: '10px 0' }}>{book.title}</h4>
                      </div>
                    ))}
                  </SimpleSlider>
                </section>
                <section className="slider-section" style={{ padding: '10px', marginRight: '200px' }}>
                  <h1 style={{ marginLeft: '120px', fontSize:'35px' }}>🔥 TODAY'S PLAYLIST</h1>
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
            </>
          } />
          <Route path="/login" element={<Login onLogin={handleLogin}/>} />
          <Route path="/register" element={<Register />} />

          <Route path="/book/:id" element={<BookDetail />} /> {/* 상세 페이지 라우트 추가 */}

          <Route path="/bookcatergory" element={<CaterGory />} />
          <Route path="/bookplaylist" element={<BookPlaylist />} />
          <Route path="/mypage" element={<MyPage />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;