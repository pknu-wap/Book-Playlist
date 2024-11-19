package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.entity.Comment;
import WEB_5.BOOKPLAYLIST.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final CommentRepository commentRepository;

    // 댓글 추가
    public Comment addComment(Long bookId, Long userId, String content, int rating) {
        Comment comment = new Comment();
        comment.setBookId(bookId);
        comment.setUserId(userId);
        comment.setContent(content);
        comment.setRating(rating);
        return commentRepository.save(comment);
    }

    // 특정 책의 댓글 조회
    public List<Comment> getCommentsByBook(Long bookId) {
        return commentRepository.findByBookId(bookId);
    }

    // 댓글 삭제
    public boolean deleteComment(Long commentId, Long userId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isPresent() && comment.get().getUserId().equals(userId)) {
            commentRepository.deleteById(commentId);
            return true;
        }
        return false; // 삭제 실패 (존재하지 않거나 권한 없음)
    }


    // 별점 추가/수정
    public boolean addOrUpdateRating(Long bookId, Long userId, int rating) {
        Optional<Comment> existingComment = commentRepository.findByBookIdAndUserId(bookId, userId);
        if (existingComment.isPresent()) {
            Comment comment = existingComment.get();
            comment.setRating(rating);
            commentRepository.save(comment);
        } else {
            Comment comment = new Comment();
            comment.setBookId(bookId);
            comment.setUserId(userId);
            comment.setRating(rating);
            commentRepository.save(comment);
        }
        return true;
    }

    // 평균 별점 계산
    public double getAverageRating(Long bookId) {
        List<Comment> comments = commentRepository.findByBookId(bookId);
        return comments.stream()
                .mapToInt(Comment::getRating)
                .average()
                .orElse(0.0);
    }
}
