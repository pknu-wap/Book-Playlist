package WEB_5.BOOKPLAYLIST.repository;

import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
}
