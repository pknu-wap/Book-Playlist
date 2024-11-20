package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.service.BookLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// BookLikeController.java
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/booklikes")
public class BookLikeController {

    private final BookLikeService bookLikeService;

    // 책 찜하기
    @PostMapping("/{isbn}/like")
    public ResponseEntity<String> likeBook(@PathVariable String isbn) {
        bookLikeService.likeBook(isbn);
        return ResponseEntity.ok("Book liked successfully");
    }

    // 책 찜하기 취소
    @DeleteMapping("/{isbn}/unlike")
    public ResponseEntity<String> unlikeBook(@PathVariable String isbn) {
        bookLikeService.unlikeBook(isbn);
        return ResponseEntity.ok("Book unliked successfully");
    }

    // 책 찜 여부 확인
    @GetMapping("/{isbn}/isLiked")
    public ResponseEntity<Boolean> isBookLiked(@PathVariable String isbn) {
        boolean isLiked = bookLikeService.isBookLiked(isbn);
        return ResponseEntity.ok(isLiked);
    }
}
