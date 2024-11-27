package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.dto.PlaylistDetailsDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.PlaylistSummaryDTO;
import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.exception.PlaylistNotFoundException;
import WEB_5.BOOKPLAYLIST.repository.BookRepository;
import WEB_5.BOOKPLAYLIST.repository.PlaylistRepository;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;
import WEB_5.BOOKPLAYLIST.domain.dto.NaverBookResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
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

    public ResponseEntity<String> savePlaylist(Long playlistId, String title, String description, List<String> isbns, byte[] imageData, Long userId) {
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistId);
        if (!playlistOpt.isPresent()) {
            return ResponseEntity.badRequest().body("플레이리스트를 찾을 수 없습니다.");
        }

        Playlist playlist = playlistOpt.get();

        if (!playlist.getUser().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("플레이리스트를 수정할 권한이 없습니다.");
        }

        if (title == null || title.isBlank()) {
            Optional<User> userOpt = userRepository.findById(userId);
            title = userOpt.map(User::getUsername).orElse("기본 플레이리스트 제목") + "님의 북플레이리스트";
        }

        if (description == null || description.isBlank()) {
            description = "기본 플레이리스트 설명";
        }

        if (imageData == null || imageData.length == 0) {
            try {
                ClassPathResource defaultImageResource = new ClassPathResource("static/default_playlist_image.jpg");
                imageData = Files.readAllBytes(defaultImageResource.getFile().toPath());
            } catch (IOException e) {
                imageData = new byte[0];
            }
        }

        playlist.setTitle(title);
        playlist.setDescription(description);
        playlist.setImageData(imageData);

        List<Book> currentBooks = playlist.getBooks();
        List<String> currentIsbns = currentBooks.stream()
                .map(Book::getIsbn)
                .collect(Collectors.toList());

        List<Book> booksToRemove = currentBooks.stream()
                .filter(book -> !isbns.contains(book.getIsbn()))
                .collect(Collectors.toList());

        playlist.getBooks().removeAll(booksToRemove);

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
                .filter(book -> book != null && !currentIsbns.contains(book.getIsbn()))
                .collect(Collectors.toList());

        playlist.getBooks().addAll(booksToAdd);

        playlistRepository.save(playlist);

        return ResponseEntity.ok("플레이리스트가 성공적으로 저장되었습니다.");
    }

    public boolean deletePlaylistById(Long playlistId, Long userId) {
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistId);
        if (playlistOpt.isPresent()) {
            Playlist playlist = playlistOpt.get();

            if (!playlist.getUser().getId().equals(userId)) {
                return false;
            }

            playlist.getBooks().clear();
            playlistRepository.save(playlist);

            playlistRepository.deleteById(playlistId);
            return true;
        } else {
            return false;
        }
    }

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

    public Long createEmptyPlaylist(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (!userOpt.isPresent()) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        User user = userOpt.get();
        Playlist playlist = new Playlist();
        playlist.setUser(user);
        playlist.setBooks(new ArrayList<>());

        Playlist savedPlaylist = playlistRepository.save(playlist);
        return savedPlaylist.getId();
    }

    public ResponseEntity<PlaylistDetailsDTO> getPlaylistDetails(Long playlistId) {
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistId);

        return playlistOpt.map(playlist -> {
            var bookDTOs = playlist.getBooks().stream()
                    .map(book -> new PlaylistDetailsDTO.BookDTO(
                            book.getTitle(),
                            book.getAuthor(),
                            book.getIsbn(),
                            book.getImage(),
                            book.getPublisher()
                    ))
                    .collect(Collectors.toList());

            String base64Image = playlist.getImageData() != null ?
                    Base64.getEncoder().encodeToString(playlist.getImageData()) : null;

            PlaylistDetailsDTO detailsDTO = new PlaylistDetailsDTO(
                    playlist.getId(),
                    playlist.getTitle(),
                    playlist.getDescription(),
                    playlist.getUser().getUsername(),
                    base64Image,
                    bookDTOs
            );

            return ResponseEntity.ok(detailsDTO);
        }).orElseGet(() -> ResponseEntity.status(404).body(null));
    }

    public List<PlaylistSummaryDTO> getAllPlaylists() {
        List<Playlist> playlists = playlistRepository.findAll();

        return playlists.stream()
                .map(playlist -> {
                    String base64Image = playlist.getImageData() != null
                            ? Base64.getEncoder().encodeToString(playlist.getImageData())
                            : null;
                    return new PlaylistSummaryDTO(
                            playlist.getId(),
                            playlist.getTitle(),
                            playlist.getUser().getUsername(),
                            base64Image,
                            playlist.getLikeCount()
                    );
                })
                .collect(Collectors.toList());
    }

    public List<PlaylistSummaryDTO> getTopPlaylists(int limit) {
        List<Playlist> playlists = playlistRepository.findTop10ByOrderByIdAsc();

        return playlists.stream()
                .map(playlist -> {
                    String base64Image = playlist.getImageData() != null
                            ? Base64.getEncoder().encodeToString(playlist.getImageData())
                            : null;

                    return new PlaylistSummaryDTO(
                            playlist.getId(),
                            playlist.getTitle(),
                            playlist.getUser().getUsername(),
                            base64Image,
                            playlist.getLikeCount()
                    );
                })
                .collect(Collectors.toList());
    }

    public boolean addBookToPlaylist(Long playlistId, String isbn, Long userId) {
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistId);
        if (!playlistOpt.isPresent()) {
            return false;
        }

        Playlist playlist = playlistOpt.get();

        if (!playlist.getUser().getId().equals(userId)) {
            return false;
        }

        boolean bookAlreadyExists = playlist.getBooks().stream()
                .anyMatch(book -> book.getIsbn().equals(isbn));
        if (bookAlreadyExists) {
            return true;
        }

        Optional<Book> bookOpt = bookRepository.findByIsbn(isbn);
        Book book;
        if (bookOpt.isPresent()) {
            book = bookOpt.get();
        } else {
            book = fetchAndSaveBook(isbn);
            if (book == null) {
                throw new IllegalArgumentException("네이버 API에서 책 정보를 찾을 수 없습니다.");
            }
        }

        playlist.getBooks().add(book);
        playlistRepository.save(playlist);

        return true;
    }

    public List<PlaylistSummaryDTO> getPlaylistsOrderByLikes() {
        List<Playlist> playlists = playlistRepository.findTopPlaylistsWithUser();

        return playlists.stream()
                .map(playlist -> {
                    String base64Image = playlist.getImageData() != null
                            ? Base64.getEncoder().encodeToString(playlist.getImageData())
                            : null; // Base64 인코딩된 이미지 데이터
                    return new PlaylistSummaryDTO(
                            playlist.getId(),
                            playlist.getTitle(),
                            playlist.getUser().getUsername(),
                            base64Image, // 이미지 데이터 포함
                            playlist.getLikeCount()
                    );
                })
                .collect(Collectors.toList());
    }

    public int getLikeCount(Long playlistId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + playlistId));
        return playlist.getLikeCount();
    }
}