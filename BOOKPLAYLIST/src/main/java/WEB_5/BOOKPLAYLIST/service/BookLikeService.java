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
}
