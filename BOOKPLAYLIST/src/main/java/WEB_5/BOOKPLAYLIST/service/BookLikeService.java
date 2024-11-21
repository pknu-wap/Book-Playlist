package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.auth.SecurityUtil;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional // 클래스 레벨에서 트랜잭션 적용
public class BookLikeService {
    private final BookLikeRepository bookLikeRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookLike likeBook(Long bookId) { // ISBN 대신 bookId 사용
        Long userId = SecurityUtil.getCurrentUserIdFromSession();

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

    public void unlikeBook(Long bookId) { // ISBN 대신 bookId 사용
        Long userId = SecurityUtil.getCurrentUserIdFromSession();

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

    public boolean isBookLiked(Long bookId) { // ISBN 대신 bookId 사용
        Long userId = SecurityUtil.getCurrentUserIdFromSession();
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
    public BookLike likeBookByIsbn(String isbn) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();

        if (userId == null) {
            throw new UserNotFoundException("유저가 인증되지 않음.");
        }

        // ISBN을 사용해 책을 조회
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new BookNotFoundException("책의 ISBN값이 검색되지 않음: " + isbn));

        // 현재 로그인한 사용자 정보 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("유저를 찾을 수 없음: " + userId));

        // 이미 좋아요한 경우 아무 작업도 하지 않음
        if (bookLikeRepository.existsByUser_IdAndBook_Id(userId, book.getId())) {
            return null;
        }

        // 좋아요 정보 생성 및 저장
        BookLike bookLike = new BookLike();
        bookLike.setBook(book);
        bookLike.setUser(user);
        return bookLikeRepository.save(bookLike);
    }
}
