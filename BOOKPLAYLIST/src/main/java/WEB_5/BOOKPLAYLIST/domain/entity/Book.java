package WEB_5.BOOKPLAYLIST.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String publisher;
    private String link;
    private String image;

    @Column(unique = true) // ISBN의 고유 제약 조건 설정
    private String isbn;

    @Column(columnDefinition = "TEXT")
    private String description;
}
