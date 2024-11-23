import React, { useEffect, useState, useCallback, useRef } from 'react';
import './playlist.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';

function PlaylistModal({ onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const placeholderImage = 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg';
  const [imageSrc, setImageSrc] = useState(placeholderImage);
  const [isSaving, setIsSaving] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [playlistImage, setPlaylistImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState({
    title: '책 제목',
    cover: null,
    publisher: '출판사',
    author: '지은이',
  });
  const [bookList, setBookList] = useState([]);
  const [likedBooks, setLikedBooks] = useState([]);
  const navigate = useNavigate();

  const studyContainerRef = useRef(null);

  // 왼쪽으로 스크롤하는 함수
  const scrollLeft = () => {
    if (studyContainerRef.current) {
      studyContainerRef.current.scrollBy({
        left: -1200, // 원하는 스크롤 거리 조정
        behavior: 'smooth',
      });
    }
  };

  // 오른쪽으로 스크롤하는 함수
  const scrollRight = () => {
    if (studyContainerRef.current) {
      studyContainerRef.current.scrollBy({
        left: 1200, // 원하는 스크롤 거리 조정
        behavior: 'smooth',
      });
    }
  };

  const MAX_EMPTY_ITEMS = 5;

  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // 모달 닫기 함수
  const closeModal = () => {
    if (onClose) onClose();
  };

  // 두 번째 모달 열기/닫기 함수
  const openSecondModal = () => {
    setIsSecondModalOpen(true);
  };

  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
  };

  // 이미지 모달 열기/닫기 함수
  const openImageModal = () => {
    setImageSrc(placeholderImage);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  // 파일 선택 시 호출되는 함수
  const onSelectFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
  };

  // 파일을 읽어 데이터 URL로 변환하는 함수
  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result));
      reader.readAsDataURL(file);
    });
  };

  // 크롭 완료 시 호출되는 함수
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 크롭된 이미지를 생성하는 함수
  const showCroppedImage = useCallback(async () => {
    if (imageSrc === placeholderImage) {
      alert('이미지를 선택해주세요.');
      return;
    }
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
      setPlaylistImage(dataURLtoFile(croppedImage, 'cropped-image.jpeg'));
      setPreviewUrl(croppedImage);
      setIsImageModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  // 크롭된 이미지를 캔버스에 그려 데이터 URL로 반환하는 함수
  const getCroppedImg = (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    return new Promise((resolve) => {
      image.onload = () => {
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  };

  // 데이터 URL을 File 객체로 변환하는 함수
  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };

  // 책 검색 함수
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/search/books',
        {
          params: { query: searchQuery },
        }
      );

      setSearchResults(response.data.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 책 클릭 시 상세 페이지로 이동
  const goToBookDetail = (book) => {
    navigate(`/book/${book.isbn}`, { state: { book } });
  };

  // 책 추가 함수
  const handleAddBook = (book) => {
    const isbn = book.isbn || book.isbn13 || book.isbn10 || '';
    setBookList((prevBookList) => [
      ...prevBookList,
      {
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        cover: book.image,
        isbn: isbn,
      },
    ]);
  };

  // 책 삭제 함수
  const handleRemoveBook = (index) => {
    setBookList((prevBookList) =>
      prevBookList.filter((_, i) => i !== index)
    );
  };

  // 책 클릭 시 상세 정보 표시 함수
  const handleBookClick = (book) => {
    setSelectedBook({
      title: book.title,
      cover: book.cover,
      author: book.author,
      publisher: book.publisher,
    });
  };

  // 제목 편집 함수
  const handleEditTitle = () => {
    setIsEditingTitle(true);
  };

  // 제목 저장 함수
  const handleSaveTitle = () => {
    setIsEditingTitle(false);
  };

  // 플레이리스트 저장 함수
  const handleSavePlaylist = async () => {
    setIsSaving(true);
    try {
      // 플레이리스트 생성 후 ID 가져오기
      const createResponse = await axios.post(
        'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/create',
        null,
        { withCredentials: true }
      );
      const playlistId = Number(createResponse.data.playlistId);

      // FormData 객체 생성 및 데이터 추가
      const formData = new FormData();
      formData.append("playlistId", playlistId); // playlist ID
      formData.append("title", playlistTitle); // 제목
      formData.append("description", playlistDescription); // 설명
      bookList.forEach((book) => formData.append("isbns", book.isbn)); // ISBN 목록
      if (playlistImage) formData.append("image", playlistImage); // 이미지 파일

      // 서버로 전송
      await axios.post(
        'https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/playlist/save',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('플레이리스트가 저장되었습니다.');
    } catch (error) {
      console.error(
        'Error saving playlist:',
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsSaving(false); // 로딩 종료
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const booksResponse = await axios.get('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/mypage/favorite/books', { withCredentials: true }) 

        if (booksResponse.data) setLikedBooks(booksResponse.data);
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {/* 첫 번째 모달 */}
      <div className="playlist-modal-overlay" onClick={closeModal}>
        <div className="playlist-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="playlist-close-btn" onClick={closeModal}>
            닫기
          </button>
          <div className='playlist-playlist-header'>
            <div className="playlist-plimage">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="플레이리스트 이미지"
                  className="playlist-playlist-image"
                />
              ) : (
                <p></p>
              )}
              <button
                className="playlist-change-image-btn"
                onClick={openImageModal}
              >
                사진변경
              </button>
            </div>

            <div className="playlist-plname">
              {isEditingTitle ? (
                <div className='playlist-pledit2'>
                  <div className='playlist-edittitle2'>
                    <input
                      type="text"
                      value={playlistTitle}
                      onChange={(e) => setPlaylistTitle(e.target.value)}
                      placeholder="플레이리스트 제목"
                    />
                    <input
                      type="text"
                      value={playlistDescription}
                      onChange={(e) => setPlaylistDescription(e.target.value)}
                      placeholder="플레이리스트 설명"
                    />
                  </div>
                  <button onClick={handleSaveTitle} className='playlist-pltitlesave'>
                    <span className="material-symbols-outlined">check_circle</span>
                  </button>
                </div>
              ) : (
                <div className='playlist-pledit1'>
                  <div className='playlist-edittitle1'>
                    <h2>{playlistTitle || '플레이리스트 제목'}</h2>
                    <p>{playlistDescription || '플레이리스트 설명'}</p>
                  </div>
                  <button onClick={handleEditTitle}>
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
              )}
            </div>
            <button className="playlist-plsave" onClick={handleSavePlaylist} disabled={isSaving}>
              {isSaving ? (
                <div className="playlist-loader"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined">check</span>
                  <p>저장</p>
                </>
              )}
            </button>
          </div> 
          <button className="playlist-pladd" onClick={openSecondModal}>
            <span className='material-symbols-outlined'>add</span>
          </button>
          <div className="playlist-book-cover-box">
            {selectedBook.cover ? (
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                className="playlist-selected-book-cover"
              />
            ) : (
              <p>책을 추가해보세요!</p>
            )}
          </div>

          <div className="playlist-book-choosetitle">
            <h2>{selectedBook.title}</h2>
            <p>
              {selectedBook.author}/{selectedBook.publisher}
            </p>
          </div>

          <div className="playlist-book-list">
            {bookList.length === 0 ? (
              // 책이 없을 때 빈 아이템 박스 5개 표시
              Array.from({ length: MAX_EMPTY_ITEMS }).map((_, index) => (
                <div key={index} className="playlist-book-item empty">
                  <div className="playlist-booktitle">
                    <h3>책이름 | 저자</h3>
                  </div>
                </div>
              ))
            ) : (
              // 책이 추가되면 추가된 책들만 표시
              bookList.map((book, index) => (
                <div
                  key={index}
                  className="playlist-book-item"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="playlist-book-info">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="playlist-book-mcover"
                    />
                    <div className="playlist-booktitle">
                      <h3>{book.title}</h3>
                      <p>
                        {book.author}/{book.publisher}
                      </p>
                    </div>
                    <button
                      className="playlist-remove-book-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBook(index);
                      }}
                    >
                      <span className='material-symbols-outlined'>delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 두 번째 모달 */}
      {isSecondModalOpen && (
        <div className="playlist-modal-overlay" onClick={closeSecondModal}>
          <div
            className="playlist-second-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="playlist-close-btn" onClick={closeSecondModal}>
              닫기
            </button>

            <div className="playlist-search-box">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="책 이름/저자를 검색해주세요!"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <button onClick={handleSearch}>
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>

            <div className="playlist-search-results">
              {searchResults.length === 0 ? (
                <p>책을 검색해주세요!</p>
              ) : (
                searchResults.map((book, index) => (
                  <div key={index}>
                    <div
                      className="book-result"
                      onClick={() => goToBookDetail(book)}
                    >
                      <div className="playlist-book-result">
                        <img
                          src={book.image}
                          className="playlist-result-book-cover"
                          alt={book.title}
                        />
                        <div className="playlist-result-title">
                          <h3>{book.title}</h3>
                          <p>
                            {book.author}/{book.publisher}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddBook(book);
                          }}
                          className="playlist-add-book-btn"
                        >
                          <span className="material-symbols-outlined">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="playlist-mystudy">
              <p>내 서재</p>
              <div className="playlist-mystudy-wrapper">
              {isLoading ? (
                <div className='playlist-mystudy-loadingbox'>
                  <div className="playlist-loader"></div>
                  <p>불러오는중...</p>
                </div>
            ) : (
              <div className="playlist-mystudy-container" ref={studyContainerRef}>
                <button className="playlist-arrow playlist-arrow-left" onClick={scrollLeft}>
                  <span className="material-symbols-outlined">Arrow_Back</span>
                </button> 
                {likedBooks.length > 0 ? (
                    likedBooks.map((book) => {
                      let imageUrl = '';
                      try {
                        imageUrl = atob(book.image);
                      } catch (e) {
                        console.error('이미지 URL 디코딩 오류:', e);
                      }
                      return (
                        <div key={book.isbn} className="playlist-mystudy-box">
                          <div className="mypage-playlist-hover-container">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={book.title}
                                className="mypage-playlist-image"
                              />
                            ) : (
                              <div className="mypage-placeholder-image">
                                이미지 없음
                              </div>
                            )}
                          </div>
                          <div className="mypage-playlist-title">
                            <p>{book.title}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>찜한 책이 없습니다.</p>
                  )}
                  <button className="playlist-arrow playlist-arrow-right" onClick={scrollRight}>
                   <span className="material-symbols-outlined">Arrow_forward</span>
                  </button>
                </div>
                )}
            </div>
           </div>
          </div>
        </div>
      )}

      {/* 이미지 변경 모달 */}
      {isImageModalOpen && (
        <div className="playlist-modal-overlay" onClick={closeImageModal}>
          <div className="playlist-image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="playlist-close-btn" onClick={closeImageModal}>닫기</button>
            <div>
              <div className="playlist-custom-file-upload">
                <input id="playlist-file-input" type="file" accept="image/*" onChange={onSelectFile}/>
                <label htmlFor="playlist-file-input">이미지 선택</label>
              </div>
              <div className="playlist-crop-container">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={150 / 200}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="playlist-controls">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className="playlist-zoom-range"
                />
              </div>
              <button className='playlist-plimage-save' onClick={showCroppedImage}>저장</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PlaylistModal;
