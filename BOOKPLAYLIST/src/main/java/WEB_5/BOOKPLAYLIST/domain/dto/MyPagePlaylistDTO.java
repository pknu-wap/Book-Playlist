package WEB_5.BOOKPLAYLIST.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MyPagePlaylistDTO {
    private Long playlistId;
    private String title;
    private String imageData; // Base64로 인코딩된 이미지 데이터
}