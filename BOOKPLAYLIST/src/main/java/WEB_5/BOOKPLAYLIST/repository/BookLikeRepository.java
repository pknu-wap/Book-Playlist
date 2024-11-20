package WEB_5.BOOKPLAYLIST.repository;

import WEB_5.BOOKPLAYLIST.domain.entity.BookLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookLikeRepository extends JpaRepository<BookLike, Long> {
    List<BookLike> findByUser_Id(Long userId); // 특정 유저의 좋아요 리스트 조회
    BookLike findByUser_IdAndBook_Id(Long userId, Long bookId); // 특정 유저가 좋아요한 특정 책 조회
    void deleteByUser_IdAndBook_Id(Long userId, Long bookId); // 특정 유저의 좋아요 목록에서 책 삭제
}
