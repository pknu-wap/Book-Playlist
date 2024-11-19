import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ onSortChange }) => {
  const [activeButton, setActiveButton] = useState(null);

  const handleClick = (order, index) => {
    setActiveButton(index);
    onSortChange(order);
  };

  return (
    <div className="filter">
      <h2 style={{ marginLeft: '40px' }}>전체 북 플레이리스트!</h2>
      <button 
        onClick={() => handleClick("latest", 0)} 
        style={{
          color: activeButton === 0 ? 'black' : 'lightgray',
          marginRight: '10px'
        }}>
        최신순
      </button>
      <button 
        onClick={() => handleClick("date", 1)} 
        style={{
          color: activeButton === 1 ? 'black' : 'lightgray'
        }}>
        날짜순
      </button>
      <button 
        onClick={() => handleClick("best", 1)} 
        style={{
          color: activeButton === 1 ? 'black' : 'lightgray'
        }}>
        인기순
      </button>
    </div>
  );
};

export default Filter;