import React, { useState, useEffect, useRef } from 'react';

// const Modal = ({ targetId, isOpen, onClose }) => {
//   const modalRef = useRef(null);
//   const targetRef = useRef(null);

//   useEffect(() => {
//     const handleWheel = (event) => {
//       if (modalRef.current && targetRef.current) {
//         const targetRect = targetRef.current.getBoundingClientRect();
//         modalRef.current.style.top = `${targetRect.top + window.scrollY}px`;
//       }
//     };

//     if (isOpen) {
//       window.addEventListener('wheel', handleWheel);
//     } else {
//       window.removeEventListener('wheel', handleWheel);
//     }

//     return () => {
//       window.removeEventListener('wheel', handleWheel);
//     };
//   }, [isOpen]);

//   const modalStyle = {
//     position: 'absolute',
//     top: '0px', // 기본 위치는 targetId 요소의 위치로 설정됨
//     left:'500px',
//     transform: 'translateX(-50%)',
//     backgroundColor: 'white',
//     padding: '20px',
//     zIndex: 1000,
//     display: isOpen ? 'block' : 'none',
//   };

//   return (
//     <>
//       {isOpen && (
//         <div style={modalStyle} ref={modalRef}>
//           <div>모달 내용</div>
//           <button onClick={onClose}>닫기</button>
//         </div>
//       )}
//       <div ref={targetRef} id={targetId} style={{ height: '200px', backgroundColor: 'lightblue' }}>
//         대상 요소
//       </div>
//     </>
//   );
// };

const CaterGory = () => {

  return (
    <div>
      <a>Book Catergory Page</a>
    </div>
  );
};

export default CaterGory;
