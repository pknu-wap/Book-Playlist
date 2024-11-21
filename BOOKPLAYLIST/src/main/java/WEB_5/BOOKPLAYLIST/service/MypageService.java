package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.dto.MyPagePlaylistDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.UserBookLikeDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.UserProfileDTO;
import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.domain.entity.BookLike;
import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.repository.BookLikeRepository;
import WEB_5.BOOKPLAYLIST.repository.BookRepository;
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

    @Autowired
    private BookRepository bookRepository;  // BookRepository 추가

    public List<MyPagePlaylistDTO> getUserPlaylists() {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();
        System.out.println("로그인된 사용자 ID: " + userId); // 디버깅용 로그

        List<Playlist> playlists = playlistRepository.findByUser_Id(userId);
        System.out.println("조회된 플레이리스트: " + playlists); // 디버깅용 로그

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
        Long userId = SecurityUtil.getCurrentUserIdFromSession();
        System.out.println("로그인된 사용자 ID: " + userId); // 디버깅용 로그

        List<Playlist> likedPlaylists = playlistRepository.findLikedPlaylistsByUserId(userId);
        System.out.println("사용자가 좋아요한 플레이리스트: " + likedPlaylists); // 디버깅용 로그

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
        List<Book> likedBooks = bookRepository.findLikedBooksByUserId(userId);
        System.out.println("사용자가 좋아요한 책 목록: " + likedBooks); // 디버깅용 로그

        return likedBooks.stream()
                .map(book -> {
                    String base64Image = book.getImage() != null ? Base64.getEncoder().encodeToString(book.getImage().getBytes()) : null;
                    return new UserBookLikeDTO(
                            book.getIsbn(),
                            book.getTitle(),
                            book.getAuthor(),
                            base64Image,
                            book.getPublisher()
                    );
                })
                .collect(Collectors.toList());
    }

    // 닉네임 변경 메서드
    public void updateUsername(Long userId, String newUsername) {
        // 유저 정보 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 새로운 닉네임 중복 확인
        if (userRepository.existsByUsername(newUsername)) {
            throw new IllegalArgumentException("Username already taken");
        }

        // 닉네임 변경
        user.setUsername(newUsername);
        userRepository.save(user);
    }
}
