package WEB_5.BOOKPLAYLIST.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SavePlaylistRequest {
    private Long playlistId;
    private String title;
    private String description;
    private List<String> isbns;

    // Getters and Setters
}