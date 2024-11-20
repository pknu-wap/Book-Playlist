package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.entity.BookLike;
import WEB_5.BOOKPLAYLIST.service.BookLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/booklikes")
@RequiredArgsConstructor
public class BookLikeController {
    private final BookLikeService bookLikeService;

    @PostMapping("/{bookId}/like")
    public ResponseEntity<String> likeBook(@PathVariable Long bookId) {
        bookLikeService.likeBook(bookId);
        return ResponseEntity.ok("Book liked successfully");
    }

    @DeleteMapping("/{bookId}/unlike")
    public ResponseEntity<String> unlikeBook(@PathVariable Long bookId) {
        bookLikeService.unlikeBook(bookId);
        return ResponseEntity.ok("Book unliked successfully");
    }

    @GetMapping("/{bookId}/isLiked")
    public ResponseEntity<Boolean> isBookLiked(@PathVariable Long bookId) {
        boolean isLiked = bookLikeService.isBookLiked(bookId);
        return ResponseEntity.ok(isLiked);
    }
}
