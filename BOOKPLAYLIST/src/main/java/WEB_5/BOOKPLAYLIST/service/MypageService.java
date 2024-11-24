package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.dto.MyPagePlaylistDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.UserBookLikeDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.UserProfileDTO;
import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.repository.BookLikeRepository;
import WEB_5.BOOKPLAYLIST.repository.BookRepository;
import WEB_5.BOOKPLAYLIST.repository.PlaylistRepository;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MypageService {
    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;
    private final BookLikeRepository bookLikeRepository;
    private final BookRepository bookRepository;  // BookRepository 추가

    /**
     * 사용자 ID를 통해 유저가 생성한 플레이리스트를 조회합니다.
     *
     * @param userId 사용자 ID
     * @return MyPagePlaylistDTO 리스트
     */
    public List<MyPagePlaylistDTO> getUserPlaylists(Long userId) {
        List<Playlist> playlists = playlistRepository.findByUser_Id(userId);

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

    /**
     * 사용자 ID를 통해 사용자 프로필을 조회합니다.
     *
     * @param userId 사용자 ID
     * @return UserProfileDTO
     */
    public UserProfileDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없음"));
        return new UserProfileDTO(user.getUsername());
    }

    /**
     * 사용자 ID를 통해 사용자가 좋아요한 플레이리스트를 조회합니다.
     *
     * @param userId 사용자 ID
     * @return MyPagePlaylistDTO 리스트
     */
    public List<MyPagePlaylistDTO> getLikedPlaylists(Long userId) {
        List<Playlist> likedPlaylists = playlistRepository.findLikedPlaylistsByUserId(userId);

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

    /**
     * 특정 사용자가 좋아요한 책을 조회합니다.
     *
     * @param userId 사용자 ID
     * @return UserBookLikeDTO 리스트
     */
    public List<UserBookLikeDTO> getLikedBooksByUserId(Long userId) {
        List<Book> likedBooks = bookRepository.findLikedBooksByUserId(userId);

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

    /**
     * 사용자 ID와 새로운 닉네임을 통해 닉네임을 변경합니다.
     *
     * @param userId      사용자 ID
     * @param newUsername 새로운 닉네임
     */
    public void updateUsername(Long userId, String newUsername) {
        // 유저 정보 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없음"));

        // 새로운 닉네임 중복 확인
        if (userRepository.existsByUsername(newUsername)) {
            throw new IllegalArgumentException("닉네임이 이미 있음");
        }

        // 닉네임 변경
        user.setUsername(newUsername);
        userRepository.save(user);
    }
}