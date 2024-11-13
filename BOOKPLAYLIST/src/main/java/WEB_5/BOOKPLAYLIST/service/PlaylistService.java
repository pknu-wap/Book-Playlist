package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.dto.MyPagePlaylistDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.PlaylistSummaryDTO;
import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.repository.BookRepository;
import WEB_5.BOOKPLAYLIST.repository.PlaylistRepository;
import WEB_5.BOOKPLAYLIST.domain.dto.NaverBookResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;
import WEB_5.BOOKPLAYLIST.auth.SecurityUtil;

import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlaylistService {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookSearchService bookSearchService;

    // 이미지를 포함한 플레이리스트 저장 메서드
    public ResponseEntity<String> savePlaylist(Long playlistId, String title, String description, List<String> isbns, byte[] imageData) {
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistId);
        if (!playlistOpt.isPresent()) {
            return ResponseEntity.badRequest().body("플레이리스트를 찾을 수 없습니다.");
        }

        Playlist playlist = playlistOpt.get();
        playlist.setTitle(title);
        playlist.setDescription(description);
        playlist.setImageData(imageData); // 이미지 데이터 저장

        List<Book> booksToAdd = isbns.stream()
                .distinct()
                .map(isbn -> {
                    Optional<Book> bookOpt = bookRepository.findTopByIsbn(isbn);
                    if (bookOpt.isPresent()) {
                        return bookOpt.get();
                    } else {
                        return fetchAndSaveBook(isbn); // fetchAndSaveBook 메서드 호출
                    }
                })
                .filter(book -> book != null && !playlist.getBooks().contains(book))
                .collect(Collectors.toList());

        playlist.getBooks().addAll(booksToAdd);
        playlistRepository.save(playlist);
        return ResponseEntity.ok("플레이리스트가 성공적으로 저장되었습니다.");
    }

    // 기존 fetchAndSaveBook 메서드 활용
    private Book fetchAndSaveBook(String isbn) {
        ResponseEntity<NaverBookResponse> response = bookSearchService.searchBooks(isbn);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            List<NaverBookResponse.NaverBookItem> items = response.getBody().getItems();
            Optional<NaverBookResponse.NaverBookItem> matchedItem = items.stream()
                    .filter(item -> item.getIsbn().replaceAll("-", "").equals(isbn.replaceAll("-", "")))
                    .findFirst();

            if (matchedItem.isPresent()) {
                NaverBookResponse.NaverBookItem item = matchedItem.get();
                Book book = new Book();
                book.setTitle(item.getTitle());
                book.setAuthor(item.getAuthor());
                book.setPublisher(item.getPublisher());
                book.setLink(item.getLink());
                book.setImage(item.getImage());
                book.setIsbn(item.getIsbn());
                book.setDescription(item.getDescription());

                return bookRepository.save(book); // DB에 저장 후 저장된 객체 반환
            }
        }
        return null;
    }

    // 빈 플레이리스트 생성
    public Long createEmptyPlaylist() {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();
        Optional<User> userOpt = userRepository.findById(userId);

        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        User user = userOpt.get();
        Playlist playlist = new Playlist();
        playlist.setUser(user);
        playlist.setBooks(List.of());

        Playlist savedPlaylist = playlistRepository.save(playlist);
        return savedPlaylist.getId();
    }

    // 특정 플레이리스트 조회
    public ResponseEntity<Playlist> getPlaylist(Long playlistId) {
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistId);
        return playlistOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // 모든 플레이리스트 조회
    public ResponseEntity<List<Playlist>> getAllPlaylists() {
        List<Playlist> playlists = playlistRepository.findAll();
        return ResponseEntity.ok(playlists);
    }

    public List<PlaylistSummaryDTO> getTopPlaylists(int limit) {
        List<Playlist> playlists = playlistRepository.findTop10ByOrderByIdAsc();

        return playlists.stream()
                .map(playlist -> {
                    String firstBookImage = playlist.getBooks().isEmpty() ? null : playlist.getBooks().get(0).getImage();
                    return new PlaylistSummaryDTO(
                            playlist.getId(),
                            playlist.getTitle(),
                            playlist.getUser().getUsername(),
                            firstBookImage
                    );
                })
                .collect(Collectors.toList());
    }
    public List<MyPagePlaylistDTO> getUserPlaylists() {
        Long userId = SecurityUtil.getCurrentUserIdFromSession(); // 현재 로그인한 유저 ID 가져오기
        List<Playlist> playlists = playlistRepository.findByUserId(userId); // 유저 ID로 플레이리스트 조회

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
}