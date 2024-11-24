package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.dto.NaverBookResponse;
import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.domain.entity.BookLike;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.exception.BookAlreadyLikedException;
import WEB_5.BOOKPLAYLIST.exception.BookNotFoundException;
import WEB_5.BOOKPLAYLIST.exception.UserNotFoundException;
import WEB_5.BOOKPLAYLIST.repository.BookLikeRepository;
import WEB_5.BOOKPLAYLIST.repository.BookRepository;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional // 클래스 레벨에서 트랜잭션 적용
public class BookLikeService {
    private final BookLikeRepository bookLikeRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookSearchService bookSearchService;

    // 사용자 ID를 인자로 받도록 수정
    public BookLike likeBook(Long bookId, Long userId) {
        if (userId == null) {
            throw new UserNotFoundException("User not authenticated");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with ID: " + bookId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        if (bookLikeRepository.existsByUser_IdAndBook_Id(userId, bookId)) {
            throw new BookAlreadyLikedException("Book already liked");
        }

        BookLike bookLike = new BookLike();
        bookLike.setBook(book);
        bookLike.setUser(user);
        return bookLikeRepository.save(bookLike);
    }

    // 사용자 ID를 인자로 받도록 수정
    public void unlikeBook(Long bookId, Long userId) {
        if (userId == null) {
            throw new UserNotFoundException("User not authenticated");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with ID: " + bookId));

        boolean exists = bookLikeRepository.existsByUser_IdAndBook_Id(userId, bookId);
        if (!exists) {
            throw new BookAlreadyLikedException("Book is not liked by the user");
        }

        bookLikeRepository.deleteByUser_IdAndBook_Id(userId, bookId);
    }

    // 사용자 ID를 인자로 받도록 수정
    public boolean isBookLiked(Long bookId, Long userId) {
        if (userId == null) {
            return false;
        }
        return bookLikeRepository.existsByUser_IdAndBook_Id(userId, bookId);
    }

    public Long getBookIdByIsbn(String isbn) {
        Optional<Book> bookOpt = bookRepository.findByIsbn(isbn);
        return bookOpt.map(Book::getId).orElse(null);
    }

    // 사용자가 특정 책을 "좋아요" 표시하는 메소드
    public boolean likeBookByIsbn(String isbn, Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User not authenticated");
        }

        // ISBN으로 책을 찾기
        Optional<Book> bookOpt = bookRepository.findByIsbn(isbn);
        Book book;

        if (bookOpt.isPresent()) {
            // 책이 데이터베이스에 있는 경우
            book = bookOpt.get();
        } else {
            // 책이 데이터베이스에 없는 경우 네이버 API에서 정보 가져오기
            ResponseEntity<NaverBookResponse> response = bookSearchService.getBookDetailByISBN(isbn);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<NaverBookResponse.NaverBookItem> items = response.getBody().getItems();
                if (items.isEmpty()) {
                    throw new IllegalArgumentException("Book not found with ISBN " + isbn);
                }
                book = bookSearchService.mapToBook(items.get(0));
                bookRepository.save(book);
            } else {
                throw new IllegalArgumentException("Could not find book with ISBN " + isbn);
            }
        }

        // 유저 정보 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 책을 이미 찜했는지 확인
        if (bookLikeRepository.existsByUser_IdAndBook_Id(userId, book.getId())) {
            return false; // 이미 찜한 상태인 경우
        }

        // BookLike 엔티티 생성 후 저장
        BookLike bookLike = new BookLike();
        bookLike.setBook(book);
        bookLike.setUser(user);
        bookLikeRepository.save(bookLike);

        return true; // 새로운 찜이 성공한 경우
    }
}
