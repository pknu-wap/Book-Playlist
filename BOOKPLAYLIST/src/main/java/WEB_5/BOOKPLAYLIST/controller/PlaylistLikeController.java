package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.service.PlaylistLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/playlistlikes")
@RequiredArgsConstructor
public class PlaylistLikeController {
    private final PlaylistLikeService playlistLikeService;

    // 사용자가 특정 플리를 찜하는 메소드
    @PostMapping("/{playlistId}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> likePlaylist(@PathVariable Long playlistId, @AuthenticationPrincipal UserDetails userDetails) {
        boolean success = playlistLikeService.likePlaylist(playlistId);
        if (success) {
            return ResponseEntity.ok("Playlist liked successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Playlist not found");
        }
    }

    // 사용자가 특정 플리를 찜취소 하는 메소드
    @DeleteMapping("/{playlistId}/unlike")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> unlikePlaylist(@PathVariable Long playlistId, @AuthenticationPrincipal UserDetails userDetails) {
        boolean success = playlistLikeService.unlikePlaylist(playlistId);
        if (success) {
            return ResponseEntity.ok("Playlist unliked successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Playlist not found");
        }
    }

    // 사용자가 특정 플레이리스트를 좋아요했는지 여부를 확인하는 메소드
    @GetMapping("/{playlistId}/isLiked")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isPlaylistLiked(@PathVariable Long playlistId, @AuthenticationPrincipal UserDetails userDetails) {
        boolean isLiked = playlistLikeService.isPlaylistLiked(playlistId);
        return ResponseEntity.ok(isLiked);
    }
}
