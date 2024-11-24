package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.entity.CustomUserDetails;
import WEB_5.BOOKPLAYLIST.exception.PlaylistAlreadyLikedException;
import WEB_5.BOOKPLAYLIST.service.PlaylistLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/playlistlikes")
@RequiredArgsConstructor
public class PlaylistLikeController {
    private final PlaylistLikeService playlistLikeService;

    @PostMapping("/{playlistId}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> likePlaylist(
            @PathVariable Long playlistId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
        }

        try {
            boolean success = playlistLikeService.likePlaylist(playlistId, userId);
            return success ? ResponseEntity.ok("Playlist liked successfully")
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Playlist not found");
        } catch (PlaylistAlreadyLikedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{playlistId}/unlike")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> unlikePlaylist(
            @PathVariable Long playlistId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 사용자입니다.");
        }

        try {
            boolean success = playlistLikeService.unlikePlaylist(playlistId, userId);
            return success ? ResponseEntity.ok("Playlist unliked successfully")
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Playlist not found");
        } catch (PlaylistAlreadyLikedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{playlistId}/isLiked")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isPlaylistLiked(
            @PathVariable Long playlistId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }
        boolean isLiked = playlistLikeService.isPlaylistLiked(playlistId, userId);
        return ResponseEntity.ok(isLiked);
    }

    @GetMapping("/{playlistId}/likeCount")
    public ResponseEntity<Map<String, Integer>> getPlaylistLikeCount(@PathVariable Long playlistId) {
        int likeCount = playlistLikeService.getLikeCount(playlistId);
        return ResponseEntity.ok(Map.of("likeCount", likeCount));
    }
}
