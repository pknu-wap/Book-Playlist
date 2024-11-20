package WEB_5.BOOKPLAYLIST.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private int rating;
    private String username;
    private LocalDateTime createdAt;
}