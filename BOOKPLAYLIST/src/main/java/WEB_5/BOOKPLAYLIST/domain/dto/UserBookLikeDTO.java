package WEB_5.BOOKPLAYLIST.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserBookLikeDTO {
    private String isbn;         // ISBN
    private String title;        // 책 제목
    private String author;       // 저자
    private String publisher;    // 출판사
    private String image;        // 책 이미지 (URL 등)
}
