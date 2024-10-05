package service;
import domain.entity.Playlist;
import domain.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
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

    public ResponseEntity<Playlist> createPlaylist(String title, String description, Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            Playlist playlist = new Playlist(title, description, user.get());
            playlistRepository.save(playlist);
            return ResponseEntity.ok(playlist);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    public ResponseEntity<String> addBookToPlaylist(Long playlistId, Long bookId) {
        Optional<Playlist> playlist = playlistRepository.findById(playlistId);
        Optional<Book> book = bookRepository.findById(bookId);

        if (playlist.isPresent() && book.isPresent()) {
            playlist.get().getBooks().add(book.get());
            playlistRepository.save(playlist.get());
            return ResponseEntity.ok("Book added to the playlist");
        } else {
            return ResponseEntity.badRequest().body("Playlist or Book not found");
        }
    }

    public ResponseEntity<String> updateBookOrder(Long playlistId, List<Long> bookOrder) {
        Optional<Playlist> playlist = playlistRepository.findById(playlistId);
        if (playlist.isPresent()) {
            Playlist existingPlaylist = playlist.get();
            List<Book> books = existingPlaylist.getBooks();
            // 책의 순서를 재배열합니다 (단순한 로직을 위한 예시)
            books.clear();
            bookOrder.forEach(bookId -> bookRepository.findById(bookId).ifPresent(books::add));
            playlistRepository.save(existingPlaylist);
            return ResponseEntity.ok("Book order updated");
        } else {
            return ResponseEntity.badRequest().body("Playlist not found");
        }
    }

    public ResponseEntity<Playlist> getPlaylist(Long playlistId) {
        Optional<Playlist> playlist = playlistRepository.findById(playlistId);
        return playlist.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public ResponseEntity<List<Playlist>> getAllPlaylists() {
        List<Playlist> playlists = playlistRepository.findAll();
        return ResponseEntity.ok(playlists);
    }
}
