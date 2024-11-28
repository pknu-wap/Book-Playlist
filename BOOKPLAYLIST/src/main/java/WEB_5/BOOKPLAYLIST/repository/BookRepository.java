// repository/BookRepository.java
package WEB_5.BOOKPLAYLIST.repository;

import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {
    @Query("SELECT b FROM Book b WHERE b.isbn IN :isbns")
    List<Book> findAllByIsbnIn(@Param("isbns") List<String> isbns);
    Optional<Book> findByIsbn(String isbn);
    @Query("SELECT b FROM Book b JOIN BookLike bl ON b.id = bl.book.id WHERE bl.user.id = :userId")
    List<Book> findLikedBooksByUserId(@Param("userId") Long userId);

    @Query("SELECT b, COUNT(bl) AS likeCount " +
            "FROM Book b LEFT JOIN b.bookLikes bl " +
            "GROUP BY b.id " +
            "ORDER BY likeCount DESC")
    List<Object[]> findBooksOrderByLikeCountDesc();

}
