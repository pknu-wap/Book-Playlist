package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.service.BookLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/booklikes")
public class BookLikeController {

    private final BookLikeService bookLikeService;

    // 책 찜하기
    @PostMapping("/{bookId}/like")
    public ResponseEntity<String> likeBook(@PathVariable Long bookId) {
        bookLikeService.likeBook(bookId);
        return ResponseEntity.ok("Book liked successfully");
    }

    // 책 찜하기 취소
    @DeleteMapping("/{bookId}/unlike")
    public ResponseEntity<String> unlikeBook(@PathVariable Long bookId) {
        bookLikeService.unlikeBook(bookId);
        return ResponseEntity.ok("Book unliked successfully");
    }

    // 유저가 찜한 책 목록 조회
    @GetMapping
    public ResponseEntity<List<Book>> getLikedBooks() {
        List<Book> likedBooks = bookLikeService.getLikedBooks();
        return ResponseEntity.ok(likedBooks);
    }

    // 책 찜 여부 확인
    @GetMapping("/{bookId}/isLiked")
    public ResponseEntity<Boolean> isBookLiked(@PathVariable Long bookId) {
        boolean isLiked = bookLikeService.isBookLiked(bookId);
        return ResponseEntity.ok(isLiked);
    }
}
