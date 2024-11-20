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

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class BookLikeService {
    private final BookLikeRepository bookLikeRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookLike likeBook(String isbn) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();

        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new BookNotFoundException("Book not found with ISBN: " + isbn));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        if (bookLikeRepository.existsByUser_IdAndBook_Isbn(userId, isbn)) {
            throw new BookAlreadyLikedException("Book already liked");
        }

        BookLike bookLike = new BookLike();
        bookLike.setBook(book);
        bookLike.setUser(user);
        return bookLikeRepository.save(bookLike);
    }

    public void unlikeBook(String isbn) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();

        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new BookNotFoundException("Book not found with ISBN: " + isbn));

        bookLikeRepository.deleteByUser_IdAndBook_Id(userId, book.getId());
    }

    public boolean isBookLiked(String isbn) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();
        return bookLikeRepository.existsByUser_IdAndBook_Isbn(userId, isbn);
    }
}
