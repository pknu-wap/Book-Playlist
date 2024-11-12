import React from 'react';
import './Mypage.css'

const MyPage = () => {
  return (
    <div>
      <div className='userimage'>
      </div>
      <div className='Mycollection'>
        <p>내서재</p>
      </div>
      <div className='Mycomment'>
        <p>내가 쓴 댓글</p>
      </div>
      <div className='username'>
        <p>username</p>
      </div>
    </div>
  );
};

export default MyPage;
