// repository/BookRepository.java
package WEB_5.BOOKPLAYLIST.repository;

import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findTopByIsbn(String isbn); // 중복이 있는 경우 가장 먼저 발견된 책 하나만 반환
    Optional<Book> findByIsbn(String isbn);
    @Query("SELECT b FROM Book b JOIN BookLike bl ON b.id = bl.book.id WHERE bl.user.id = :userId")
    List<Book> findLikedBooksByUserId(@Param("userId") Long userId);

}
