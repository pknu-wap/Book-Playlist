package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.service.BookLikeService;
import WEB_5.BOOKPLAYLIST.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import WEB_5.BOOKPLAYLIST.domain.entity.CustomUserDetails;

import java.util.Map;

@RestController
@RequestMapping("/api/booklikes")
@RequiredArgsConstructor
public class BookLikeController {
    private final BookLikeService bookLikeService;
    private final BookService bookService; // ISBN으로 책을 조회할 수 있는 서비스 추가

    @PostMapping("/{isbn}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> likeBook(
            @PathVariable String isbn,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long bookId = bookService.getBookIdByIsbn(isbn);
        if (bookId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
        }
        Long userId = userDetails.getId(); // 사용자 ID 추출
        bookLikeService.likeBook(bookId, userId); // 사용자 ID 전달
        return ResponseEntity.ok("Book liked successfully");
    }

    @DeleteMapping("/{isbn}/unlike")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> unlikeBook(
            @PathVariable String isbn,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long bookId = bookService.getBookIdByIsbn(isbn);
        if (bookId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
        }
        Long userId = userDetails.getId();
        bookLikeService.unlikeBook(bookId, userId);
        return ResponseEntity.ok("Book unliked successfully");
    }

    @GetMapping("/{isbn}/isLiked")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isBookLiked(
            @PathVariable String isbn,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long bookId = bookService.getBookIdByIsbn(isbn);
        if (bookId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }
        Long userId = userDetails.getId();
        boolean isLiked = bookLikeService.isBookLiked(bookId, userId);
        return ResponseEntity.ok(isLiked);
    }

    @PostMapping("/mainpage/like-by-isbn")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> likeBookByIsbn(
            @RequestBody Map<String, String> payload, // JSON 본문으로 매핑
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            String isbn = payload.get("isbn"); // JSON에서 isbn 추출
            if (isbn == null || isbn.isEmpty()) {
                return ResponseEntity.badRequest().body("ISBN 값이 없습니다.");
            }

            Long userId = userDetails.getId();
            boolean isLiked = bookLikeService.likeBookByIsbn(isbn, userId);

            if (isLiked) {
                return ResponseEntity.ok("책이 성공적으로 찜 되었습니다.");
            } else {
                return ResponseEntity.ok("책이 이미 찜 되었습니다.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("찜 도중 오류가 발생했습니다.");
        }
    }
}
