package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.dto.MyPagePlaylistDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.PlaylistDetailsDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.PlaylistSummaryDTO;
import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.repository.BookRepository;
import WEB_5.BOOKPLAYLIST.repository.PlaylistRepository;
import WEB_5.BOOKPLAYLIST.domain.dto.NaverBookResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;
import WEB_5.BOOKPLAYLIST.auth.SecurityUtil;

import java.io.IOException;
import java.nio.file.Files;
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

    // 플레이리스트를 저장하거나 수정하는 메서드 (이미지와 책 목록 포함)
    public ResponseEntity<String> savePlaylist(Long playlistId, String title, String description, List<String> isbns, byte[] imageData) {
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistId);
        if (!playlistOpt.isPresent()) {
            return ResponseEntity.badRequest().body("플레이리스트를 찾을 수 없습니다.");
        }

        Playlist playlist = playlistOpt.get();

        // 기본 값 적용 조건
        if (title == null || title.isBlank()) {
            Long userId = SecurityUtil.getCurrentUserIdFromSession();
            Optional<User> userOpt = userRepository.findById(userId);

            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("로그인된 사용자 정보를 찾을 수 없습니다.");
            }

            User user = userOpt.get();
            title = user.getUsername() + "님의 북플레이리스트";
        }

        if (description == null || description.isBlank()) {
            description = "이 플레이리스트는 사용자가 즐겨 읽는 책들을 모아둔 공간입니다.";
        }

        if (imageData == null || imageData.length == 0) {
            try {
                // 기본 이미지 로드 (resources/static/default_playlist_image.jpg)
                ClassPathResource defaultImageResource = new ClassPathResource("static/default_playlist_image.jpg");
                imageData = Files.readAllBytes(defaultImageResource.getFile().toPath()); // 바이트 배열로 변환
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("기본 이미지를 로드할 수 없습니다.");
            }
        }

        // 값 설정
        playlist.setTitle(title);
        playlist.setDescription(description);
        playlist.setImageData(imageData);

        // 책 추가 로직
        List<Book> booksToAdd = isbns.stream()
                .distinct()
                .map(isbn -> {
                    Optional<Book> bookOpt = bookRepository.findTopByIsbn(isbn);
                    if (bookOpt.isPresent()) {
                        return bookOpt.get();
                    } else {
                        return fetchAndSaveBook(isbn); // ISBN으로 책 정보 가져오기
                    }
                })
                .filter(book -> book != null && !playlist.getBooks().contains(book))
                .collect(Collectors.toList());

        playlist.getBooks().addAll(booksToAdd);
        playlistRepository.save(playlist);
        return ResponseEntity.ok("플레이리스트가 성공적으로 저장되었습니다.");
    }

    // 외부 API를 통해 책 정보를 가져와 저장하는 메서드
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

                return bookRepository.save(book); // DB에 저장 후 반환
            }
        }
        return null;
    }

    // 현재 사용자에 대한 빈 플레이리스트를 생성하는 메서드
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

    // 특정 플레이리스트를 조회하는 메서드
    public ResponseEntity<PlaylistDetailsDTO> getPlaylistDetails(Long playlistId) {
        Optional<Playlist> playlistOpt = playlistRepository.findById(playlistId);

        return playlistOpt.map(playlist -> {
            // 책 정보를 BookDTO로 변환
            var bookDTOs = playlist.getBooks().stream()
                    .map(book -> new PlaylistDetailsDTO.BookDTO(
                            book.getTitle(),
                            book.getAuthor(),
                            book.getIsbn(),
                            book.getImage(),
                            book.getPublisher() // 출판사 정보 추가
                    ))
                    .collect(Collectors.toList());

            // Base64 이미지 인코딩
            String base64Image = playlist.getImageData() != null ?
                    Base64.getEncoder().encodeToString(playlist.getImageData()) : null;

            // PlaylistDetailsDTO 생성
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

    // 모든 플레이리스트를 조회하여 요약 정보로 반환하는 메서드
    public List<PlaylistSummaryDTO> getAllPlaylists() {
        List<Playlist> playlists = playlistRepository.findAll();

        // Playlist 엔터티를 PlaylistSummaryDTO로 변환, 이미지 데이터는 Base64로 인코딩
        return playlists.stream()
                .map(playlist -> {
                    String base64Image = playlist.getImageData() != null ?
                            Base64.getEncoder().encodeToString(playlist.getImageData()) : null;
                    return new PlaylistSummaryDTO(
                            playlist.getId(),
                            playlist.getTitle(),
                            playlist.getUser().getUsername(),
                            base64Image
                    );
                })
                .collect(Collectors.toList());
    }

    // 상위 10개의 플레이리스트를 조회하여 요약 정보로 반환하는 메서드
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

}