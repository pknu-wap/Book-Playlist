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
    private Long id; // 기본 키

    @Column(nullable = false, unique = true)
    private String isbn; // 고유 ISBN

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
    private List<Comment> comments; // 책에 달린 댓글 리스트

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookLike> bookLikes; // 이 책을 좋아요한 유저 리스트

}
