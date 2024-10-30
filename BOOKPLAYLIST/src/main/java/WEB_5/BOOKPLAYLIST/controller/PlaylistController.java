package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/playlist")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    // 빈 플레이리스트 생성 (POST /api/playlist/create)
    @PostMapping("/create")
    public ResponseEntity<Map<String, Long>> createEmptyPlaylist() {
        Long playlistId = playlistService.createEmptyPlaylist();
        return ResponseEntity.ok(Map.of("playlistId", playlistId));
    }

    // 책 리스트를 포함하여 플레이리스트 저장 (POST /api/playlist/save)
    @PostMapping("/save")
    public ResponseEntity<String> savePlaylist(@RequestParam Long playlistId,
                                               @RequestParam String title,
                                               @RequestParam String description,
                                               @RequestBody List<String> isbns) {
        System.out.println("Received isbns: " + isbns); // 로그 추가
        return playlistService.savePlaylist(playlistId, title, description, isbns);
    }
    
    // 특정 플레이리스트 조회 (GET /api/playlist/{playlistId})
    @GetMapping("/{playlistId}")
    public ResponseEntity<Playlist> getPlaylist(@PathVariable Long playlistId) {
        return playlistService.getPlaylist(playlistId);
    }

    // 모든 플레이리스트 조회 (GET /api/playlist/playlists)
    @GetMapping("/playlists")
    public ResponseEntity<List<Playlist>> getAllPlaylists() {
        return playlistService.getAllPlaylists();
    }
}
