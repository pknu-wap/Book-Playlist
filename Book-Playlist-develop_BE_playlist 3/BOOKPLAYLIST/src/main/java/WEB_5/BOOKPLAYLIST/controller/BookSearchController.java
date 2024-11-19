// controller/BookSearchController.java
package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.service.BookSearchService;
import WEB_5.BOOKPLAYLIST.domain.dto.NaverBookResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class BookSearchController {

    @Autowired
    private BookSearchService bookSearchService;

    // 책 검색 (GET /api/search/books)
    @GetMapping("/books")
    public ResponseEntity<NaverBookResponse> searchBooks(@RequestParam String query) {
        return bookSearchService.searchBooks(query);
    }

    // 책 상세 정보 조회 API (ISBN으로 상세 정보 조회)
    @GetMapping("/books/detail")
    public ResponseEntity<NaverBookResponse> getBookDetail(@RequestParam String isbn) {
        return bookSearchService.getBookDetailByISBN(isbn);
    }
}

