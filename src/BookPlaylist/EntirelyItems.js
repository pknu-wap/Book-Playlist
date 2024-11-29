import React, { useState, useEffect } from "react";
import "./EntireItem.css";
import Filter from "./Filter.js";
import Pagination from "../components/Pagination";
import axios from "axios";
import Mainpageplaylist from '../components/Mainpageplaylist.js'

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


const EntireItems = () => {
  
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const [loadingStates, setLoadingStates] = useState({}); 
  const [likeCount, setLikeCount] = useState(0);
  const itemsPerPage = 15;
  

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

//찜하기 함수
  const handleLike = (playlistId) => {
    setLoadingStates((prevState) => ({ ...prevState, [playlistId]: true }));
    console.log("클릭한 요소:",playlistId);
    const token = getToken();
    if (!token) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      setLoadingStates((prevState) => ({ ...prevState, [playlistId]: false }));
      return;
    }
  
    // 요청 URL
    const likeUrl = `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId}/like`;
    const unlikeUrl = `https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlistlikes/${playlistId}/unlike`;
  
    // 요청 헤더에 Authorization 추가
    const headers = {
      Authorization: `Bearer ${token}`,  // 토큰을 Authorization 헤더에 포함
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
          setPlaylists((prevPlaylists) => 
            prevPlaylists.map((playlist)=>
              playlist.playlistId === playlistId ? {...playlist, likeCount: playlist.likeCount + 1} : playlist
            )
          );
          alert(`플레이리스트가 찜이 되었습니다!`);
        })
        .catch((error) => {
          console.error("찜하기 실패:", error);
          alert("이미 찜이 된 플레이리스트입니다.",error);
        })
        .finally(() => {
          setLoadingStates((prevState) => ({ ...prevState, [playlistId]: false }));

          // window.location.reload()
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
          setPlaylists((prevPlaylists)=>
            prevPlaylists.map((playlist)=>
              playlist.playlistId === playlistId ? {...playlist, likeCount: playlist.likeCount - 1} : playlist
            )
          );
          alert("플레이리스트가 찜취소가 되었습니다!");
        })
        .catch((error) => {
          console.error("찜 취소 실패:", error);
          alert("이미 취소된 플레이리스트입니다.",error);
        })
        .finally(() => {
          setLoadingStates((prevState) => ({ ...prevState, [playlistId]: false }));

          // window.location.reload()
        });
    }
  };

  const openModal = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setSelectedPlaylistId(null);
    setIsModalOpen(false);
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
                  className="grid-item"
                  onClick={() => openModal(playlist.playlistId)}
                >
                  <img
                    src={`data:image/jpeg;base64,${playlist.base64Image}` || ""}
                    alt={playlist.title}                    
                    className="grid-bookplaylist-img"
                    
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
                    {loadingStates[playlist.playlistId] && (
                      <span className="like-loading">...</span>
                    )}
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
      {isModalOpen && (
        <Mainpageplaylist playlistId={selectedPlaylistId} onClose={closeModal} />
      )}
    </div>
  );
};

export default EntireItems;