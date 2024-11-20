package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import WEB_5.BOOKPLAYLIST.service.BookSearchService;
import WEB_5.BOOKPLAYLIST.repository.BookRepository;  // BookRepository 임포트
import WEB_5.BOOKPLAYLIST.domain.dto.NaverBookResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")  // 기본 경로 수정
public class BookSearchController {

    @Autowired
    private BookSearchService bookSearchService;

    @Autowired
    private BookRepository bookRepository;  // BookRepository 주입

    // 책 검색 (GET /api/search/books)
    @GetMapping("/search/books")
    public ResponseEntity<NaverBookResponse> searchBooks(@RequestParam String query) {
        return bookSearchService.searchBooks(query);
    }

    // 검색 결과 표시 (GET /api/search/results) - 필요 없다면 제거 가능
    @GetMapping("/search/results")
    public ResponseEntity<NaverBookResponse> showResults(@RequestParam String query) {
        return searchBooks(query);
    }

    // 책 상세 정보 조회 API (ISBN으로 상세 정보 조회)
    @GetMapping("/search/books/detail")
    public ResponseEntity<NaverBookResponse> getBookDetail(@RequestParam String isbn) {
        return bookSearchService.getBookDetailByISBN(isbn);
    }

    // 프론트엔드 요청에 맞춘 경로 변경: /api/books/isbn
    @PostMapping("/books/isbn")
    public ResponseEntity<?> addOrFetchBookByISBN(@RequestBody Map<String, String> request) {
        String isbn = request.get("isbn");
        Optional<Book> existingBook = bookRepository.findByIsbn(isbn);

        if (existingBook.isPresent()) {
            return ResponseEntity.ok(existingBook.get()); // 이미 존재하면 반환
        }

        // 네이버 API로 데이터 조회 및 책 생성
        ResponseEntity<NaverBookResponse> naverResponse = bookSearchService.getBookDetailByISBN(isbn);
        if (naverResponse.getBody() == null || naverResponse.getBody().getItems().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found in Naver API");
        }

        Book newBook = bookSearchService.mapToBook(naverResponse.getBody().getItems().get(0));
        bookRepository.save(newBook);

        return ResponseEntity.ok(newBook); // 새로 추가된 책 반환
    }

}
