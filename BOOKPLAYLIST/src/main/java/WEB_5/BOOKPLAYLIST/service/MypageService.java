package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.dto.MyPagePlaylistDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.UserBookLikeDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.UserProfileDTO;
import WEB_5.BOOKPLAYLIST.domain.entity.BookLike;
import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.repository.BookLikeRepository;
import WEB_5.BOOKPLAYLIST.repository.PlaylistRepository;
import WEB_5.BOOKPLAYLIST.auth.SecurityUtil;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MypageService {
    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookLikeRepository bookLikeRepository;


    public List<MyPagePlaylistDTO> getUserPlaylists() {

        // 현재 로그인한 유저의 ID 가져오기
        Long userId = SecurityUtil.getCurrentUserIdFromSession();
        System.out.println("로그인된 사용자 ID: " + userId); // 디버깅용 로그

        // 유저 ID로 플레이리스트 조회
        List<Playlist> playlists = playlistRepository.findByUser_Id(userId);
        System.out.println("조회된 플레이리스트: " + playlists); // 디버깅용 로그

        // 필요한 정보만 포함한 DTO로 변환, 이미지 데이터는 Base64로 인코딩
        return playlists.stream()
                .map(playlist -> {
                    String base64Image = playlist.getImageData() != null ?
                            Base64.getEncoder().encodeToString(playlist.getImageData()) : null;
                    return new MyPagePlaylistDTO(
                            playlist.getId(),
                            playlist.getTitle(),
                            base64Image
                    );
                })
                .collect(Collectors.toList());
    }

    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new UserProfileDTO(user.getUsername());
    }

    public List<MyPagePlaylistDTO> getLikedPlaylists() {
        // 현재 로그인한 유저의 ID 가져오기
        Long userId = SecurityUtil.getCurrentUserIdFromSession();
        System.out.println("로그인된 사용자 ID: " + userId); // 디버깅용 로그

        // 유저 ID로 사용자가 좋아요한 플레이리스트 조회
        List<Playlist> likedPlaylists = playlistRepository.findLikedPlaylistsByUserId(userId);
        System.out.println("사용자가 좋아요한 플레이리스트: " + likedPlaylists); // 디버깅용 로그

        // 필요한 정보만 포함한 DTO로 변환, 이미지 데이터는 Base64로 인코딩
        return likedPlaylists.stream()
                .map(playlist -> {
                    String base64Image = playlist.getImageData() != null ?
                            Base64.getEncoder().encodeToString(playlist.getImageData()) : null;
                    return new MyPagePlaylistDTO(
                            playlist.getId(),
                            playlist.getTitle(),
                            base64Image
                    );
                })
                .collect(Collectors.toList());
    }

    // 특정 사용자가 좋아요한 책 조회
    public List<UserBookLikeDTO> getLikedBooksByUserId(Long userId) {
        List<BookLike> bookLikes = bookLikeRepository.findByUser_Id(userId);

        // 필요한 정보만 포함한 DTO로 변환
        return bookLikes.stream()
                .map(bookLike -> new UserBookLikeDTO(
                        bookLike.getBook().getIsbn(),
                        bookLike.getBook().getTitle(),
                        bookLike.getBook().getAuthor(),
                        bookLike.getBook().getPublisher(),
                        bookLike.getBook().getImage()  // 책 이미지
                ))
                .collect(Collectors.toList());
    }

}
