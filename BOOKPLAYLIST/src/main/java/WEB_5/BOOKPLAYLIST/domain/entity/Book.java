package WEB_5.BOOKPLAYLIST.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "book", indexes = {
        @Index(name = "idx_book_id", columnList = "id"),
        @Index(name = "idx_book_isbn", columnList = "isbn", unique = true)
})
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String isbn;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private String publisher;
    private String link;
    private String image;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookLike> bookLikes;

    @Transient // 데이터베이스에 저장하지 않음
    private long likeCount; // 좋아요 수 필드
}
