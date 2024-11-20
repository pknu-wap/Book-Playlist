package WEB_5.BOOKPLAYLIST.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "comment")

public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User와 다대일 관계 설정 (하나의 User가 여러 댓글 작성 가능)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Book과 다대일 관계 설정 (하나의 Book에 여러 댓글 작성 가능)
    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false) // 책과 연결
    private Book book;

    @Column(nullable = false, length = 500)
    private String content;

    @Column(nullable = false)
    private int rating; // 별점

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
