import React, { useState, useEffect } from "react";
import './EntireItem.css';
import Filter from "./Filter";
import Pagination from "./Pagination";

const EntireItems = () => {
  const [playlists, setPlaylists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const itemsPerPage = 25;
  const pagesPerGroup = 5;
  
  useEffect(() => {
    const dummyData = [];
    for (let i = 1; i <= 63; i++) {
      dummyData.push({
        id: i,
        title: `playlist${i}`,
        author: `${i}번째사람`,
        image: `https://via.placeholder.com/100?text=${i}`
      });
    }

    setPlaylists(dummyData);
  }, []);

  const sortedPlaylists = [...playlists].sort((a, b) =>
    sortOrder === "latest" ? a.id - b.id : b.id - a.id
  );

  const totalPages = Math.ceil(sortedPlaylists.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const currentItems = sortedPlaylists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const imageStyle = {
    width: "100px",
    height: "150px",
    borderRadius: "4px",
  };

  return (
    <div>
      <Filter onSortChange={handleSortOrderChange} />
      <div className="grid-container">
        {currentItems.map((playlist) => (
          <div key={playlist.id} className="grid-item">
            <img src={playlist.image} alt={playlist.title} style={imageStyle} />
            <p>{playlist.title}</p>
            <p style={{marginBottom:'10px'}}>{playlist.author}</p>
          </div>
        ))}
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        pagesPerGroup={pagesPerGroup}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default EntireItems;