// service/PlaylistService.java
package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.repository.BookRepository;
import WEB_5.BOOKPLAYLIST.repository.PlaylistRepository;
import WEB_5.BOOKPLAYLIST.domain.dto.NaverBookResponse;
import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;

import java.util.List;
import java.util.Optional;

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

    // 플레이리스트 생성
    public ResponseEntity<Playlist> createPlaylist(String title, String description, Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(null);
        }

        User user = userOpt.get();
        Playlist playlist = new Playlist();
        playlist.setTitle(title);
        playlist.setDescription(description);
        playlist.setUser(user);
        playlist.setBooks(List.of());

        Playlist savedPlaylist = playlistRepository.save(playlist);
        return ResponseEntity.ok(savedPlaylist);
    }

    // 책을 플레이리스트에 추가
    public ResponseEntity<String> addBookToPlaylist(Long playlistId, String isbn) {
        // 플레이리스트 조회
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistId);
        if (!playlistOpt.isPresent()) {
            return ResponseEntity.badRequest().body("플레이리스트를 찾을 수 없습니다.");
        }

        Playlist playlist = playlistOpt.get();

        // ISBN으로 책 조회
        Optional<Book> bookOpt = bookRepository.findByIsbn(isbn);
        Book book;

        if (bookOpt.isPresent()) {
            book = bookOpt.get();
        } else {
            // 책 정보 검색 (ISBN을 검색어로 사용)
            ResponseEntity<NaverBookResponse> response = bookSearchService.searchBooks(isbn);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<NaverBookResponse.NaverBookItem> items = response.getBody().getItems();
                // ISBN으로 정확히 일치하는 책 찾기
                Optional<NaverBookResponse.NaverBookItem> matchedItem = items.stream()
                        .filter(item -> item.getIsbn().replaceAll("-", "").equals(isbn.replaceAll("-", "")))
                        .findFirst();

                if (matchedItem.isPresent()) {
                    NaverBookResponse.NaverBookItem item = matchedItem.get();
                    book = new Book();
                    book.setTitle(item.getTitle());
                    book.setAuthor(item.getAuthor());
                    book.setPublisher(item.getPublisher());
                    book.setLink(item.getLink());
                    book.setImage(item.getImage());
                    book.setIsbn(item.getIsbn());
                    book.setDescription(item.getDescription());

                    // 책 정보 저장
                    book = bookRepository.save(book);
                } else {
                    return ResponseEntity.badRequest().body("해당 ISBN에 맞는 책을 찾을 수 없습니다.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("외부 API로부터 책 정보를 가져오는 데 실패했습니다.");
            }
        }

        // 플레이리스트에 책 추가
        if (!playlist.getBooks().contains(book)) {
            playlist.getBooks().add(book);
            playlistRepository.save(playlist);
            return ResponseEntity.ok("플레이리스트에 책이 추가되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("이미 플레이리스트에 해당 책이 포함되어 있습니다.");
        }
    }

    // 플레이리스트 내 책 순서 조정
    public ResponseEntity<String> updateBookOrder(Long playlistId, List<Long> bookOrder) {
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistId);
        if (!playlistOpt.isPresent()) {
            return ResponseEntity.badRequest().body("플레이리스트를 찾을 수 없습니다.");
        }

        Playlist playlist = playlistOpt.get();
        List<Book> books = playlist.getBooks();

        // 책의 순서를 재배열 (간단한 예시)
        books.clear();
        for (Long bookId : bookOrder) {
            bookRepository.findById(bookId).ifPresent(books::add);
        }

        playlistRepository.save(playlist);
        return ResponseEntity.ok("플레이리스트 내 책의 순서가 업데이트되었습니다.");
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
