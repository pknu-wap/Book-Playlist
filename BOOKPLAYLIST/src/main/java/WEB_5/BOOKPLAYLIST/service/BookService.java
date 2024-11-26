// package WEB_5.BOOKPLAYLIST.service;

package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.dto.BookSummaryDTO;
import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.repository.BookRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BookService {
    private final BookRepository bookRepository;

    /**
     * ISBN을 통해 bookId를 조회합니다.
     *
     * @param isbn ISBN 번호
     * @return bookId 또는 null (책을 찾을 수 없을 경우)
     */
    public Long getBookIdByIsbn(String isbn) {
        Optional<Book> bookOpt = bookRepository.findByIsbn(isbn);
        return bookOpt.map(Book::getId).orElse(null);
    }

    public List<BookSummaryDTO> getBooksOrderByLikes() {
        List<Book> books = bookRepository.findBooksOrderByLikeCountDesc();

        return books.stream()
                .map(book -> new BookSummaryDTO(
                        book.getId(),
                        book.getTitle(),
                        book.getAuthor(),
                        book.getPublisher(),
                        book.getImage(),
                        book.getBookLikes().size(), // 찜 개수 계산
                        book.getIsbn()
                ))
                .collect(Collectors.toList());
    }
}
