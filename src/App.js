import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function SearchBar(){
  return (
    <input className="search-bar" type="text" placeholder="검색어를 입력하세요">
    </input>
  )
}

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <a>로고</a>
      </div>
      <SearchBar /> {/*검색창 컴포넌트 사용*/}
      <div className="user-menu">
        <a href="#">로그인</a>
        <a href="#">회원가입</a>
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><a href="#">로그인</a></li>
          <li><a href="#">회원가입</a></li>
          <li><a href="#">마이페이지</a></li>
          <li><a href="#">북 카테고리</a></li>
          <li><a href="#">전체 북 플레이리스트</a></li>
        </ul>
      </nav>
    </aside>
  );
}


function BestSeller() {
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  return (
    <div>
      <h2>🔥 베스트셀러 </h2>
        <ul className="bestseller">
          <li><div><div className="placeholder"> 책 제목 </div></div></li>
          <li><div><div className="placeholder"> 책 제목 </div></div></li>
          <li><div><div className="placeholder"> 책 제목 </div></div></li>
          <li><div><div className="placeholder"> 책 제목 </div></div></li>
         </ul> 
    </div>
  );
}

function App() {
  return (
   <div>
    <Header></Header>
    <Sidebar></Sidebar>
    <BestSeller></BestSeller>
   </div>
  );
}

export default App;