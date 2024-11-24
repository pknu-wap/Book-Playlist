package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.dto.*;
import WEB_5.BOOKPLAYLIST.domain.entity.CustomUserDetails; // 추가
import WEB_5.BOOKPLAYLIST.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/mypage")
public class Mypagecontroller {

    private final MypageService myPageService;
    private final UserService userService;
    private final CommentService commentService;

    /**
     * 유저가 생성한 모든 플레이리스트 조회 (GET /api/mypage/mine/playlists)
     */
    @GetMapping("/mine/playlists")
    @PreAuthorize("isAuthenticated()") // 인증된 사용자만 접근 가능
    public ResponseEntity<List<MyPagePlaylistDTO>> getUserPlaylists(
            @AuthenticationPrincipal CustomUserDetails userDetails) { // 사용자 정보 주입
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<MyPagePlaylistDTO> userPlaylists = myPageService.getUserPlaylists(userId);
        return ResponseEntity.ok(userPlaylists);
    }

    /**
     * 현재 로그인한 사용자의 프로필(닉네임) 조회
     */
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()") // 인증된 사용자만 접근 가능
    public ResponseEntity<UserProfileDTO> getUserProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserProfileDTO userProfile = userService.getUserProfile(userId);
        return ResponseEntity.ok(userProfile);
    }

    /**
     * 사용자가 찜한 모든 플레이리스트 조회 (GET /api/mypage/favorite/playlists)
     */
    @GetMapping("/favorite/playlists")
    @PreAuthorize("isAuthenticated()") // 인증된 사용자만 접근 가능
    public ResponseEntity<List<MyPagePlaylistDTO>> getFavoritePlaylists(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<MyPagePlaylistDTO> favoritePlaylists = myPageService.getLikedPlaylists(userId);
        return ResponseEntity.ok(favoritePlaylists);
    }

    /**
     * 로그인한 사용자가 찜한 책 조회 (GET /api/mypage/favorite/books)
     */
    @GetMapping("/favorite/books")
    @PreAuthorize("isAuthenticated()") // 인증된 사용자만 접근 가능
    public ResponseEntity<List<UserBookLikeDTO>> getUserLikedBooks(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<UserBookLikeDTO> likedBooks = myPageService.getLikedBooksByUserId(userId);
        return ResponseEntity.ok(likedBooks);
    }

    /**
     * 로그인한 사용자가 작성한 댓글 조회 (GET /api/mypage/mine/comments)
     */
    @GetMapping("/mine/comments")
    @PreAuthorize("isAuthenticated()") // 인증된 사용자만 접근 가능
    public ResponseEntity<List<UserCommentDTO>> getUserComments(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<UserCommentDTO> userComments = commentService.getCommentsByUserId(userId);
        return ResponseEntity.ok(userComments);
    }

    /**
     * 로그인한 사용자가 자신의 닉네임 변경 (PUT /api/mypage/profile/username)
     */
    @PutMapping("/profile/username")
    @PreAuthorize("isAuthenticated()") // 인증된 사용자만 접근 가능
    public ResponseEntity<String> updateUsername(
            @RequestBody UpdateUsernameRequest updateUsernameRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String newUsername = updateUsernameRequest.getNewUsername(); // DTO에서 새로운 닉네임 가져오기
            myPageService.updateUsername(userId, newUsername);
            return ResponseEntity.ok("업데이트 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); // 닉네임 변경 실패 사유 반환
        }
    }
}
