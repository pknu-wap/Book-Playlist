import './App.css';
import React, { useState, useEffect } from "react"; 

// const Slide = () => {
//   return (
//     <div className='train'>
//       <div className='show'>보여줄 화면</div> // 보여줄 화면
//     </div>
//   );
// };


const Pagination = ({ totalPosts, postsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const pageNumbers = [];
  
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <nav>
      <ul className='pagination'>
        <li className='page-item'>
          <a onClick={(event) => {
            event.preventDefault();
            handlePageChange(1)
            }} href='#' className='page-link'>&laquo;</a>
        </li>
        <li className='page-item'>
          <a onClick={(event) =>{
            event.preventDefault();
            handlePageChange(currentPage - 1)
            }} href='#' className='page-link'>&lt;</a>
        </li>
        {pageNumbers.slice((currentPage - 1) - (currentPage - 1) % 5, (currentPage - 1) - (currentPage - 1) % 5 + 5).map(number => (
          <li key={number} className='page-item'>
            <a onClick={(event) => {
              event.preventDefault();
              handlePageChange(number)
              }} href='#' className={`page-link ${currentPage === number ? 'active' : ''}`}>
              {number}
            </a>
          </li>
        ))}
        <li className='page-item'>
          <a onClick={(event) => {
            event.preventDefault();
            handlePageChange(currentPage + 1)
          }} href='!#' className='page-link'>&gt;</a>
        </li>
        <li className='page-item'>
          <a onClick={(event) => {
            event.preventDefault();
            handlePageChange(totalPages)
            }} href='!#' className='page-link'>&raquo;</a>
        </li>
      </ul>
    </nav>
  );
};

const Header = () => {
  return (
    <header className="header">

      <img src="logo192.png" alt="책 이미지" className='logo' href="./App.js"/>

      <SearchBar />
      <button className="login">로그인/회원가입</button>
    </header>
  );
};

const SearchBar = () => {
  return (
    <input className="search-bar" type="text" placeholder=" 🔍 검색어를 입력하세요" />
  );
};

const Sidebar = () => {
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
};

const PlaylistButton = () => {
  return (
    <div className="MakePlaylist">
      <button className="playlistButton" type="button">플레이리스트 만들기</button>
    </div>
  );
}

const BestSeller = ({ posts, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <section>
      <div className="bestseller-container">
        <h2 className="bestseller-title">BEST SELLER</h2>
        <p className="bestseller-description">지금 가장 핫한 베스트셀러를 만나보세요!</p>
        <div className="bestseller-list">
          {posts.map(post => (
            <div key={post.id} className='bestseller-item'>
              <img src="logo192.png" alt="책 이미지" className='bestseller-image' />
              <h3 className='bestseller-book-title'>{post.title}</h3>
              <p className='bestseller-author'><span className="author">저자: {post.author || '작가명'}</span></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TodayPlaylist = ({ posts, loading}) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <section>
      <div className="TodayPlaylist-container">
        
        <h2 className="TodayPlaylist-title">Today Playlist</h2>
        <p className="TodayPlaylist-description">지금 가장 핫한 플레이리스트를 만나보세요!</p> 
        <div className="TodayPlaylist-list">
          {posts.map(post => (
            <div key={post.id} className='TodayPlaylist-item'>
              <img src="logo192.png" alt="책 이미지" className='TodayPlaylist-image' />
              <h3 className='TodayPlaylist-list-title'>{post.title}</h3>
              <p className='TodayPlaylist-author'>제작자: {post.author || '제작자명'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPageBestSeller, setCurrentPageBestSeller] = useState(1);
  const [currentPageTodayPlaylist, setCurrentPageTodayPlaylist] = useState(1);
  const [postsPerPage] = useState(5);

  useEffect(() => {
    // 더미 데이터
    const fetchPosts = () => {
      setLoading(true);
      const dummyPosts = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        title: `책 ${index + 1}`
      }));
      setPosts(dummyPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // 현재 posts 받기
  const indexOfLastPostBestSeller = currentPageBestSeller * postsPerPage;
  const indexOfFirstPostBestSeller = indexOfLastPostBestSeller - postsPerPage;
  const currentPostsBestSeller = posts.slice(indexOfFirstPostBestSeller, indexOfLastPostBestSeller);

  const indexOfLastPostTodayPlaylist = currentPageTodayPlaylist * postsPerPage;
  const indexOfFirstPostTodayPlaylist = indexOfLastPostTodayPlaylist - postsPerPage;
  const currentPostsTodayPlaylist = posts.slice(indexOfFirstPostTodayPlaylist, indexOfLastPostTodayPlaylist);

  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar />
        <main>
          <div className="content">
            <BestSeller posts={currentPostsBestSeller} loading={loading} />
            <div className="pagination-container">
              <Pagination
                totalPosts={posts.length}
                postsPerPage={postsPerPage}
                currentPage={currentPageBestSeller}
                setCurrentPage={setCurrentPageBestSeller}
              />
            </div>
          </div>
          <div className="content">
            <TodayPlaylist posts={currentPostsTodayPlaylist} loading={loading} />
            <div className="pagination-container">
              <Pagination
                totalPosts={posts.length}
                postsPerPage={postsPerPage}
                currentPage={currentPageTodayPlaylist}
                setCurrentPage={setCurrentPageTodayPlaylist}
              />
            </div>
          </div>
            <PlaylistButton></PlaylistButton>
        </main>   
      </div>
    </div>
  );
}

export default App;
