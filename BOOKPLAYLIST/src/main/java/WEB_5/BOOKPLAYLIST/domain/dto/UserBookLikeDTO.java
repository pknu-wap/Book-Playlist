package WEB_5.BOOKPLAYLIST.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserBookLikeDTO {
    private String isbn;         // 책 ISBN
    private String title;        // 책 제목
    private String author;       // 책 저자
    private String image;        // Base64로 인코딩된 책 이미지 데이터
    private String publisher;    // 출판사 정보
}
