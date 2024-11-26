package WEB_5.BOOKPLAYLIST.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookSummaryDTO {
    private Long id;
    private String title;
    private String author;
    private String publisher;
    private String image;
    private int likeCount;
    private String isbn;
}