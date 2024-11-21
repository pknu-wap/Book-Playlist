package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.auth.SecurityUtil;
import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.domain.dto.UserCommentDTO;
import WEB_5.BOOKPLAYLIST.domain.entity.Comment;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.repository.BookRepository;
import WEB_5.BOOKPLAYLIST.repository.CommentRepository;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public Comment addCommentByIsbn(String isbn, Long userId, String content, int rating) {
        // Book과 User 객체 조회
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new RuntimeException("Book not found for ISBN: " + isbn));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for ID: " + userId));

        // Comment 생성 및 저장
        Comment comment = new Comment();
        comment.setBook(book);
        comment.setUser(user);
        comment.setContent(content);
        comment.setRating(rating);

        return commentRepository.save(comment);
    }

    // 특정 책의 댓글 조회
    public List<Comment> getCommentsByBook(Long bookId) {
        return commentRepository.findByBookId(bookId);
    }

    public List<Comment> getCommentsByBookIsbn(String isbn) {
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new RuntimeException("Book not found for ISBN: " + isbn));
        return commentRepository.findByBookId(book.getId());
    }

    // 댓글 삭제
    public boolean deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }

        commentRepository.deleteById(commentId);
        return true;
    }



    // 별점 추가/수정
    public boolean addOrUpdateRating(Long bookId, Long userId, int rating) {
        // Book과 User 객체 조회
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 기존 댓글 조회
        Optional<Comment> existingComment = commentRepository.findByBookAndUser(book, user);
        if (existingComment.isPresent()) {
            Comment comment = existingComment.get();
            comment.setRating(rating); // 별점 업데이트
            commentRepository.save(comment);
        } else {
            // 새 댓글 생성
            Comment comment = new Comment();
            comment.setBook(book);
            comment.setUser(user);
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

    public boolean addOrUpdateRatingByIsbn(String isbn, Long userId, int rating) {
        // ISBN을 통해 책 조회
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new RuntimeException("Book not found for ISBN: " + isbn));

        // User 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for ID: " + userId));

        // 기존 댓글 조회
        Optional<Comment> existingComment = commentRepository.findByBookAndUser(book, user);
        if (existingComment.isPresent()) {
            Comment comment = existingComment.get();
            comment.setRating(rating); // 별점 업데이트
            commentRepository.save(comment);
        } else {
            // 새 댓글 생성
            Comment comment = new Comment();
            comment.setBook(book);
            comment.setUser(user);
            comment.setRating(rating);
            commentRepository.save(comment);
        }
        return true;
    }

    public double getAverageRatingByIsbn(String isbn) {
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new RuntimeException("Book not found for ISBN: " + isbn));
        List<Comment> comments = commentRepository.findByBookId(book.getId());
        return comments.stream()
                .mapToInt(Comment::getRating)
                .average()
                .orElse(0.0);
    }
    // 사용자 ID를 기준으로 댓글 조회
    public List<UserCommentDTO> getCommentsByUserId(Long userId) {
        List<Comment> comments = commentRepository.findByUser_Id(userId);

        return comments.stream()
                .map(comment -> new UserCommentDTO(
                        comment.getBook().getIsbn(),
                        comment.getBook().getTitle(),
                        comment.getContent(),
                        comment.getRating(),
                        comment.getBook().getImage()
                ))
                .collect(Collectors.toList());
    }
}
