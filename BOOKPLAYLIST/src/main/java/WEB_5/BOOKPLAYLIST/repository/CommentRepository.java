package WEB_5.BOOKPLAYLIST.repository;

import WEB_5.BOOKPLAYLIST.domain.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByBookId(Long bookId); // 특정 책의 모든 댓글 조회

    Optional<Comment> findByBookIdAndUserId(Long bookId, Long userId); // 특정 책에 대한 사용자의 댓글 조회

    void deleteByIdAndUserId(Long commentId, Long userId); // 사용자 본인의 댓글만 삭제 가능
}
