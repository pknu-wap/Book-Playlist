package WEB_5.BOOKPLAYLIST.service;

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
        return savedPlaylist.getId(); // 생성된 playlistId만 반환
    }

    // 책 리스트를 포함하여 플레이리스트 저장
    public ResponseEntity<String> savePlaylist(Long playlistId, String title, String description, List<String> isbns) {
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistId);
        if (!playlistOpt.isPresent()) {
            return ResponseEntity.badRequest().body("플레이리스트를 찾을 수 없습니다.");
        }

        Playlist playlist = playlistOpt.get();
        playlist.setTitle(title);
        playlist.setDescription(description);

        // 중복되지 않는 책들만 추가
        List<Book> booksToAdd = isbns.stream()
                .distinct()
                .map(isbn -> {
                    Optional<Book> bookOpt = bookRepository.findByIsbn(isbn);
                    if (bookOpt.isPresent()) {
                        return bookOpt.get();
                    } else {
                        return fetchAndSaveBook(isbn);
                    }
                })
                .filter(book -> book != null && !playlist.getBooks().contains(book))
                .collect(Collectors.toList());

        playlist.getBooks().addAll(booksToAdd);
        playlistRepository.save(playlist);
        return ResponseEntity.ok("플레이리스트가 성공적으로 저장되었습니다.");
    }

    // 책을 외부 API에서 검색하여 저장
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

                return bookRepository.save(book);
            }
        }
        return null;
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
}
