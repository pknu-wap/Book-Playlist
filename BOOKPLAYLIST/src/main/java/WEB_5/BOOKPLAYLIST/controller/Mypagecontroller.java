package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.auth.SecurityUtil;
import WEB_5.BOOKPLAYLIST.domain.dto.MyPagePlaylistDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.UserProfileDTO;
import WEB_5.BOOKPLAYLIST.service.MypageService;
import WEB_5.BOOKPLAYLIST.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/mypage")
public class Mypagecontroller {

    @Autowired
    private MypageService myPageService;

    @Autowired
    private UserService userService;

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

}