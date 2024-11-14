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

    // 검색 결과 표시 (GET /api/search/results) - 필요 없다면 제거 가능
    @GetMapping("/results")
    public ResponseEntity<NaverBookResponse> showResults(@RequestParam String query) {
        return searchBooks(query);
    }
}