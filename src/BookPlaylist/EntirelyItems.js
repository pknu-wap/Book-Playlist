import React, { useState, useEffect, lazy, Suspense } from "react";
import "./EntireItem.css";
import Filter from "./Filter.js";
import Pagination from "../components/Pagination";
import axios from "axios";

const Modals = lazy(() => import("./Modals")); // 동적 import

const fetchPlaylists = async () => {
  try {
    const response = await axios.get(
      "https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/playlists",
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("플레이리스트 목록을 불러오는 데 실패했습니다.", error);
    return null;
  }
};

const fetchPlaylistDetails = async (playlistId) => {
  try {
    const response = await axios.get(
      `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/${playlistId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(`플레이리스트 ${playlistId} 데이터를 불러오는 데 실패했습니다.`, error);
    return null;
  }
};

const EntireItems = () => {
  const [isLiked, setIsLiked] = useState(false); //찜 상태
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); //현재 선택한 플리 id
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const [isLoading, setIsLoading] = useState(false); //로딩상태 
  const [likeCount, setLikeCount] = useState(0);
  const itemsPerPage = 15;
  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const loadPlaylists = async () => {
      setLoading(true);
      const data = await fetchPlaylists();
      if (data) {
        setPlaylists(data);
        setError(null);
      } else {
        setError("플레이리스트를 불러오는데 실패했습니다.");
      }
      setLoading(false);
    };

    loadPlaylists();
  }, []);

  useEffect(()=>{
    const fetchLikeData = async (playlistId)=>{
      const token = getToken();
      if(!token){
        alert("로그인해주세요.");
        return;
      }
      try {
        const {data: isLikedData} = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId.playlistId}/isLiked`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLiked(isLikedData);

      } catch (error){
        console.error("찜 정보 가져오기 실패:",error);
      } finally {

      }
    };
    const fetchLikeCount = async(playlistId)=>{
      try{
        const { data: likeCountData } = await axios.get(
          `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId}/likeCount`,
          { withCredentials: true }
        );
        setLikeCount(likeCountData.likeCount);
      } catch(error){
        console.error("찜 수 정보 가져오기 실패:",error);
      } finally{

      }
    }
    if (selectedPlaylist && selectedPlaylist.playlistId) {
      fetchLikeData(selectedPlaylist.playlistId);
      fetchLikeCount(selectedPlaylist.playlistId);
    }
  }, [selectedPlaylist]);

  const handleLike = (playlistId) => {
    setIsLoading(true); // 찜하기 버튼 클릭 시 로딩 시작
    console.log("클릭한 요소:",playlistId);
    const token = getToken();
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      setIsLoading(false); 
      return;
    }
  
    // 요청 URL
    const likeUrl = `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId}/like`;
    const unlikeUrl = `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId}/unlike`;
  
    // 요청 헤더에 Authorization 추가
    const headers = {
      'Authorization': `Bearer ${token}`,  // 토큰을 Authorization 헤더에 포함
    };
  
    if (!isLiked) {
      // 찜하기
      axios
        .post(likeUrl, {}, {
          headers: headers,
          withCredentials: true,
        })
        .then(() => {
          setIsLiked(true);
          setLikeCount((prevCount) => prevCount + 1); //likeCount값 증가
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("찜하기 실패:", error);
          alert("플레이리스트 찜 에러",error);
        })
        .finally(() => {
          setIsLoading(false);
          alert(`플레이리스트가 찜이 되었습니다!`);
        });
    } else {
      // 찜 취소
      axios
        .delete(unlikeUrl, {
          headers: headers,
          withCredentials: true,
        })
        .then(() => {
          setIsLiked(false);
          setLikeCount((prevCount) => prevCount - 1); //likeCount값 감소
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("찜 취소 실패:", error);
          alert("플레이리스트 찜 에러",error);
        })
        .finally(() => {
          setIsLoading(false);
          alert("플레이리스트가 찜취소가 되었습니다!");
        });
    }
  };

  const handleItemClick = async (playlistId) => {
    setModalLoading(true);
    setIsModalOpen(true);
    const data = await fetchPlaylistDetails(playlistId);
    console.log("클릭한 플레이리스트:", playlistId);
    setModalLoading(false);

    if (data) {
      setSelectedPlaylist(data);
    } else {
      setSelectedPlaylist(null);
      alert("플레이리스트 데이터를 불러오는데 실패했습니다.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlaylist(null);
  };

  const sortedPlaylists = [...playlists];
  switch(sortOrder){
    case "latest":
      sortedPlaylists.sort((a,b)=>b.playlistId-a.playlistId);
      break;
    case "date":
      sortedPlaylists.sort((a,b)=>a.playlistId-b.playlistId);
      break;
    case "best":
      sortedPlaylists.sort((a,b)=>b.likeCount-a.likeCount);
      break;
    default:
      break;
  }

  const currentItems = sortedPlaylists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedPlaylists.length / itemsPerPage);

  return (
    <div>
      <Filter onSortChange={(order) => setSortOrder(order)} />
      {loading ? (
        <div className="playlists-loading"></div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="grid-container">
            {currentItems.map((playlist) => (
              <div key={playlist.playlistId}>
                <div
                  className="grid-bookplaylist-item"
                >
                  <img
                    src={`data:image/jpeg;base64,${playlist.base64Image || ""}`}
                    alt={playlist.title}                    
                    className="grid-bookplaylist-img"
                    onClick={() => handleItemClick(playlist.playlistId)}
                  />
                  <h3 
                    className="grid-bookplaylist-title"
                  >
                      {playlist.title || "제목 없음"}
                  </h3>
                  <p className="gird-bookplaylist-username">만든이 : {playlist.username}</p>
                  <p 
                    className="gird-bookplaylist-likeCount"
                    onClick={()=>handleLike(playlist.playlistId)}
                  > 
                    ❤️ {playlist.likeCount}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pagesPerGroup={5} // 예시로 5페이지 그룹
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </>
      )}
      <Suspense fallback={<div>Loading Modal...</div>}>
        <Modals
          show={isModalOpen}
          onClose={handleCloseModal}
          data={selectedPlaylist}
          loading={modalLoading}
        />
      </Suspense>
    </div>
  );
};

export default EntireItems;