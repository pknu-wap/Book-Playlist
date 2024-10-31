package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.dto.PlaylistSummaryDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.SavePlaylistRequest;
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
    public ResponseEntity<String> savePlaylist(@RequestBody SavePlaylistRequest request) {
        return playlistService.savePlaylist(
                request.getPlaylistId(),
                request.getTitle(),
                request.getDescription(),
                request.getIsbns()
        );
    }
    //메인화면 플레이리스트 띄우기 (GET /api/playlist/top)
    @GetMapping("/top")
    public ResponseEntity<List<PlaylistSummaryDTO>> getTopPlaylists() {
        List<PlaylistSummaryDTO> topPlaylists = playlistService.getTopPlaylists(10);
        return ResponseEntity.ok(topPlaylists);
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
