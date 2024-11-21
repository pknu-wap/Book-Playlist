package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.entity.BookLike;
import WEB_5.BOOKPLAYLIST.service.BookLikeService;
import WEB_5.BOOKPLAYLIST.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/booklikes")
@RequiredArgsConstructor
public class BookLikeController {
    private final BookLikeService bookLikeService;
    private final BookService bookService; // ISBN으로 책을 조회할 수 있는 서비스 추가

    @PostMapping("/{isbn}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> likeBook(@PathVariable String isbn, @AuthenticationPrincipal UserDetails userDetails) {
        Long bookId = bookService.getBookIdByIsbn(isbn);
        if (bookId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
        }
        bookLikeService.likeBook(bookId);
        return ResponseEntity.ok("Book liked successfully");
    }

    @DeleteMapping("/{isbn}/unlike")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> unlikeBook(@PathVariable String isbn, @AuthenticationPrincipal UserDetails userDetails) {
        Long bookId = bookService.getBookIdByIsbn(isbn);
        if (bookId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
        }
        bookLikeService.unlikeBook(bookId);
        return ResponseEntity.ok("Book unliked successfully");
    }

    @GetMapping("/{isbn}/isLiked")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isBookLiked(@PathVariable String isbn, @AuthenticationPrincipal UserDetails userDetails) {
        Long bookId = bookService.getBookIdByIsbn(isbn);
        if (bookId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }
        boolean isLiked = bookLikeService.isBookLiked(bookId);
        return ResponseEntity.ok(isLiked);
    }

    @PostMapping("mainpage/like-by-isbn")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> likeBookByIsbn(@RequestParam String isbn, @AuthenticationPrincipal UserDetails userDetails) {
            BookLike bookLike = bookLikeService.likeBookByIsbn(isbn);
            if (bookLike == null) {
                return ResponseEntity.ok("책이 이미 찜 되었습니다.");
            }
            return ResponseEntity.ok("책이 성공적으로 찜 되었습니다.");
        }
    }


