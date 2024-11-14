package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.dto.MyPagePlaylistDTO;
import WEB_5.BOOKPLAYLIST.service.MypageService;
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

    // 유저가 생성한 모든 플레이리스트 조회 (GET /api/mypage/mine/playlists)
    @GetMapping("/mine/playlists")
    public ResponseEntity<List<MyPagePlaylistDTO>> getUserPlaylists() {
        List<MyPagePlaylistDTO> userPlaylists = myPageService.getUserPlaylists();
        return ResponseEntity.ok(userPlaylists);
    }

}
