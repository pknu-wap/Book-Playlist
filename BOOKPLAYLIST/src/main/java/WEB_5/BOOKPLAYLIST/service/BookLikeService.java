package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.auth.SecurityUtil;
import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.domain.entity.BookLike;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.repository.BookLikeRepository;
import WEB_5.BOOKPLAYLIST.repository.BookRepository;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class BookLikeService {

    private final BookLikeRepository bookLikeRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    // 책 좋아요 추가
    public BookLike likeBook(Long bookId) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession(); // 현재 로그인된 유저 ID 가져오기

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 이미 좋아요한 책인지 확인
        BookLike existingLike = bookLikeRepository.findByUser_IdAndBook_Id(userId, bookId);
        if (existingLike != null) {
            throw new RuntimeException("Book already liked");
        }

        // 좋아요 추가
        BookLike bookLike = new BookLike();
        bookLike.setBook(book);
        bookLike.setUser(user);
        return bookLikeRepository.save(bookLike);
    }

    // 책 좋아요 취소
    public void unlikeBook(Long bookId) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession(); // 현재 로그인된 유저 ID 가져오기

        BookLike bookLike = bookLikeRepository.findByUser_IdAndBook_Id(userId, bookId);
        if (bookLike == null) {
            throw new RuntimeException("Book not liked by user");
        }

        bookLikeRepository.delete(bookLike);
    }

    // 유저의 좋아요한 책 목록 조회
    public List<Book> getLikedBooks() {
        Long userId = SecurityUtil.getCurrentUserIdFromSession(); // 현재 로그인된 유저 ID 가져오기

        List<BookLike> bookLikes = bookLikeRepository.findByUser_Id(userId);
        return bookLikes.stream()
                .map(BookLike::getBook)
                .toList(); // 좋아요한 책 목록 반환
    }

    public boolean isBookLiked(Long bookId) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession(); // 현재 로그인된 유저 ID 가져오기

        // 찜 여부 확인
        return bookLikeRepository.findByUser_IdAndBook_Id(userId, bookId) != null;
    }

}
