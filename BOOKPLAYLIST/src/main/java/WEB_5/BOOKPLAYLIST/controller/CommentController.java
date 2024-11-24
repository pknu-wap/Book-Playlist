package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.dto.CommentResponse;
import WEB_5.BOOKPLAYLIST.domain.entity.Comment;
import WEB_5.BOOKPLAYLIST.domain.entity.CustomUserDetails;
import WEB_5.BOOKPLAYLIST.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/books")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{isbn}/comments")
    @PreAuthorize("isAuthenticated()") // 인증된 사용자만 접근 가능
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable String isbn,
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) { // CustomUserDetails 주입
        String content = (String) request.get("content");
        int rating = (int) request.get("rating");

        // 현재 로그인된 사용자 ID 가져오기
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // 댓글 추가
        Comment comment = commentService.addCommentByIsbn(isbn, userId, content, rating);

        // CommentResponse 생성
        CommentResponse response = new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getRating(),
                comment.getUser().getUsername(),
                comment.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()") // 인증된 사용자만 접근 가능
    public ResponseEntity<Map<String, Object>> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails userDetails) { // CustomUserDetails 주입
        // 현재 로그인된 사용자 ID 가져오기
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        boolean deleted = commentService.deleteComment(commentId, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", deleted);
        response.put("message", deleted ? "댓글이 성공적으로 삭제되었습니다." : "댓글 삭제 실패");
        return ResponseEntity.ok(response);
    }

    // 댓글 조회
    @GetMapping("/{isbn}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable String isbn) {
        List<CommentResponse> responses = commentService.getCommentsByBookIsbn(isbn).stream()
                .map(comment -> new CommentResponse(
                        comment.getId(),
                        comment.getContent(),
                        comment.getRating(),
                        comment.getUser().getUsername(),
                        comment.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(responses);
    }

    // 별점 추가/수정
    @PostMapping("/{bookisbn}/rating")
    @PreAuthorize("isAuthenticated()") // 인증된 사용자만 접근 가능
    public ResponseEntity<Map<String, Object>> addOrUpdateRating(
            @PathVariable("bookisbn") String bookIsbn,
            @RequestBody Map<String, Object> request,
            @AuthenticationPrincipal CustomUserDetails userDetails) { // CustomUserDetails 주입
        int rating = (int) request.get("rating");

        // 현재 로그인된 사용자 ID 가져오기
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        boolean success = commentService.addOrUpdateRatingByIsbn(bookIsbn, userId, rating); // 서비스 메서드도 수정 필요

        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", success ? "별점이 성공적으로 저장되었습니다." : "별점 저장 실패");
        return ResponseEntity.ok(response);
    }

    // 평균 별점 조회
    @GetMapping("/{bookisbn}/rating/average")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable("bookisbn") String bookIsbn) {
        double averageRating = commentService.getAverageRatingByIsbn(bookIsbn); // 서비스 메서드도 수정 필요

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", Map.of("averageRating", averageRating));
        return ResponseEntity.ok(response);
    }
}
