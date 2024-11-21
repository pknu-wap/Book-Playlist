package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.auth.SecurityUtil;
import WEB_5.BOOKPLAYLIST.domain.dto.*;
import WEB_5.BOOKPLAYLIST.service.CommentService;
import lombok.RequiredArgsConstructor;
import WEB_5.BOOKPLAYLIST.service.MypageService;
import WEB_5.BOOKPLAYLIST.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/mypage")
public class Mypagecontroller {

    @Autowired
    private MypageService myPageService;

    @Autowired
    private UserService userService;

    private final CommentService commentService;

    // 유저가 생성한 모든 플레이리스트 조회 (GET /api/mypage/mine/playlists)
    @GetMapping("/mine/playlists")
    public ResponseEntity<List<MyPagePlaylistDTO>> getUserPlaylists() {
        List<MyPagePlaylistDTO> userPlaylists = myPageService.getUserPlaylists();
        return ResponseEntity.ok(userPlaylists);
    }

    // 현재 로그인한 사용자의 프로필(닉네임) 조회
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile() {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();
        UserProfileDTO userProfile = userService.getUserProfile(userId);
        return ResponseEntity.ok(userProfile);
    }

    // 사용자가 찜한 모든 플레이리스트 조회 (GET /api/mypage/favorite/playlists)
    @GetMapping("/favorite/playlists")
    public ResponseEntity<List<MyPagePlaylistDTO>> getFavoritePlaylists() {
        List<MyPagePlaylistDTO> favoritePlaylists = myPageService.getLikedPlaylists();
        return ResponseEntity.ok(favoritePlaylists);
    }

    // 로그인한 사용자가 찜한 책 조회 (GET /api/mypage/favorite/books)
    @GetMapping("/favorite/books")
    public ResponseEntity<List<UserBookLikeDTO>> getUserLikedBooks() {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();

        if (userId == null) {
            return ResponseEntity.status(401).build(); // 인증 실패
        }

        List<UserBookLikeDTO> likedBooks = myPageService.getLikedBooksByUserId(userId);
        return ResponseEntity.ok(likedBooks);
    }

    // 로그인한 사용자가 작성한 댓글 조회 (GET /api/mypage/mine/comments)
    @GetMapping("/mine/comments")
    public ResponseEntity<List<UserCommentDTO>> getUserComments() {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();

        if (userId == null) {
            return ResponseEntity.status(401).build(); // 인증 실패
        }

        List<UserCommentDTO> userComments = commentService.getCommentsByUserId(userId);
        return ResponseEntity.ok(userComments);
    }

    // 로그인한 사용자가 자신의 닉네임 변경 (PUT /api/mypage/profile/username)
    @PutMapping("/profile/username")
    public ResponseEntity<String> updateUsername(@RequestBody UpdateUsernameRequest updateUsernameRequest) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();

        if (userId == null) {
            return ResponseEntity.status(401).build(); // 인증 실패
        }

        try {
            String newUsername = updateUsernameRequest.getNewUsername(); // DTO에서 새로운 닉네임 가져오기
            myPageService.updateUsername(userId, newUsername);
            return ResponseEntity.ok("Username updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage()); // 닉네임 변경 실패 사유 반환
        }
    }
}
