package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.dto.MyPagePlaylistDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.PlaylistDetailsDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.PlaylistSummaryDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.SavePlaylistRequest;
import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.springframework.http.HttpStatus;

import java.io.InputStream;
import java.nio.file.Files;
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

    @PostMapping("/save")
    public ResponseEntity<String> savePlaylist(
            @RequestParam Long playlistId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam List<String> isbns,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        try {
            // 이미지 파일이 없으면 기본 이미지 설정
            byte[] imageData;
            if (imageFile == null || imageFile.isEmpty()) {
                imageData = getDefaultImageData();
            } else {
                imageData = imageFile.getBytes(); // 이미지 파일을 바이트 배열로 변환
            }

            // 서비스 메서드 호출
            return playlistService.savePlaylist(playlistId, title, description, isbns, imageData);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 파일 처리 실패");
        }
    }

    // 기본 이미지를 읽는 유틸리티 메서드
    private byte[] getDefaultImageData() throws IOException {
        ClassPathResource defaultImageResource = new ClassPathResource("static/default_playlist_image.jpg");
        try (InputStream inputStream = defaultImageResource.getInputStream()) {
            return inputStream.readAllBytes();
        }
    }

    //메인화면 플레이리스트 띄우기 (GET /api/playlist/top)
    @GetMapping("/top")
    public ResponseEntity<List<PlaylistSummaryDTO>> getTopPlaylists() {
        List<PlaylistSummaryDTO> topPlaylists = playlistService.getTopPlaylists(10);
        return ResponseEntity.ok(topPlaylists);
    }

    // 특정 플레이리스트 조회 (GET /api/playlist/{playlistId})
    @GetMapping("/{playlistId}")
    public ResponseEntity<PlaylistDetailsDTO> getPlaylistDetails(@PathVariable Long playlistId) {
        return playlistService.getPlaylistDetails(playlistId);
    }

    // 모든 플레이리스트 조회 (GET /api/playlist/playlists)
    @GetMapping("/playlists")
    public ResponseEntity<List<PlaylistSummaryDTO>> getAllPlaylists() {
        List<PlaylistSummaryDTO> allPlaylists = playlistService.getAllPlaylists();
        return ResponseEntity.ok(allPlaylists);
    }

    // 해당 플레이리스트 삭제 (DELETE /api/playlist/{playlistId})
    @DeleteMapping("/{playlistId}")
    public ResponseEntity<String> deletePlaylist(@PathVariable Long playlistId) {
        boolean isDeleted = playlistService.deletePlaylistById(playlistId);
        if (isDeleted) {
            return ResponseEntity.ok("플레이리스트가 성공적으로 삭제되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("플레이리스트를 찾을 수 없습니다.");
        }
    }

    // 특정 플레이리스트에 책 추가 (POST /api/playlist/{playlistId}/addBook)
    @PostMapping("/{playlistId}/addBook")
    public ResponseEntity<String> addBookToPlaylist(@PathVariable Long playlistId, @RequestParam String isbn) {
        try {
            boolean success = playlistService.addBookToPlaylist(playlistId, isbn);
            if (success) {
                return ResponseEntity.ok("책이 플레이리스트에 성공적으로 추가되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("플레이리스트를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("책 추가 중 오류가 발생했습니다.");
        }
    }

    // 플레이리스트를 찜 순서대로 반환
    @GetMapping("/top-by-likes")
    public ResponseEntity<List<PlaylistSummaryDTO>> getPlaylistsByLikes() {
        List<PlaylistSummaryDTO> playlists = playlistService.getPlaylistsOrderByLikes();
        return ResponseEntity.ok(playlists);
    }
}
