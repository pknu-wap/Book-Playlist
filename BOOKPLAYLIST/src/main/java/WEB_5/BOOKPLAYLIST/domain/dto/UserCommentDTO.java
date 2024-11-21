package WEB_5.BOOKPLAYLIST.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserCommentDTO {
    private String isbn;
    private String title;
    private String content;
    private int rating;
    private  String image;

}
