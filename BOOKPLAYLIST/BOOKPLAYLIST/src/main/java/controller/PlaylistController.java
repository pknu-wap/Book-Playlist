// controller/PlaylistController.java
package controller;

import domain.entity.Playlist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.PlaylistService;

import java.util.List;

@RestController
@RequestMapping("/api/playlist")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    // 플레이리스트 생성 (POST /api/playlist/create)
    @PostMapping("/create")
    public ResponseEntity<Playlist> createPlaylist(@RequestParam String title,
                                                   @RequestParam String description,
                                                   @RequestParam Long userId) {
        return playlistService.createPlaylist(title, description, userId);
    }

    // 책을 플레이리스트에 추가 (POST /api/playlist/addBook)
    @PostMapping("/addBook")
    public ResponseEntity<String> addBookToPlaylist(@RequestParam Long playlistId,
                                                    @RequestParam String isbn) {
        return playlistService.addBookToPlaylist(playlistId, isbn);
    }

    // 플레이리스트 내 순서 조정 (PATCH /api/playlist/updateOrder)
    @PatchMapping("/updateOrder")
    public ResponseEntity<String> updateBookOrder(@RequestParam Long playlistId,
                                                  @RequestBody List<Long> bookOrder) {
        return playlistService.updateBookOrder(playlistId, bookOrder);
    }

    // 특정 플레이리스트 조회 (GET /api/playlist/{playlistId})
    @GetMapping("/{playlistId}")
    public ResponseEntity<Playlist> getPlaylist(@PathVariable Long playlistId) {
        return playlistService.getPlaylist(playlistId);
    }

    // 공개된 모든 플레이리스트 조회 (GET /api/playlist/playlists)
    @GetMapping("/playlists")
    public ResponseEntity<List<Playlist>> getAllPlaylists() {
        return playlistService.getAllPlaylists();
    }
}
