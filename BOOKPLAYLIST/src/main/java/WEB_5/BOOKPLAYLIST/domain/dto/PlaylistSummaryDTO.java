package WEB_5.BOOKPLAYLIST.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlaylistSummaryDTO {
    private Long playlistId;    // 플레이리스트 ID
    private String title;       // 플레이리스트 제목
    private String username;    // 플레이리스트 생성자 이름
    private String base64Image; // Base64 인코딩된 이미지 데이터
    private int likeCount;      // 찜 수 추가
}
