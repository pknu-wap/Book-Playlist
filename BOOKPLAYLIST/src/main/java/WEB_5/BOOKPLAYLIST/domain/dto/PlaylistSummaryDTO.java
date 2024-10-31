package WEB_5.BOOKPLAYLIST.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlaylistSummaryDTO {
    private Long playlistId;
    private String title;
    private String username;
    private String bookImage;
}