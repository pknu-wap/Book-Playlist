package WEB_5.BOOKPLAYLIST.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PlaylistDetailsDTO {
    private Long playlistId;          // 플레이리스트 ID
    private String title;             // 플레이리스트 제목
    private String description;       // 플레이리스트 설명
    private String username;          // 생성자 이름
    private String base64Image;       // Base64 인코딩된 이미지 데이터
    private List<BookDTO> books;      // 책 정보 리스트

    @Data
    @AllArgsConstructor
    public static class BookDTO {
        private String title;         // 책 제목
        private String author;        // 저자
        private String isbn;          // ISBN
        private String image;         // 책 이미지
        private String publisher;     // 책 출판사

    }
}