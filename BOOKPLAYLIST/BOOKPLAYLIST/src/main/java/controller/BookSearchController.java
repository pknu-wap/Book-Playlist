package controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import org.springframework.http.HttpHeaders;


//사용자가 /books 또는 /results로 요청을 보냄.
//검색어를 인코딩하여 네이버 도서 API로 요청.
//API 결과를 받아서 프론트엔드로 반환.

@RestController
@RequestMapping("/api/search")
public class BookSearchController {

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

    // 책 검색 (GET /api/search/books)
    @GetMapping("/books")
    public ResponseEntity<String> searchBooks(@RequestParam String query) {
        String apiUrl = null;
        try {
            apiUrl = "https://openapi.naver.com/v1/search/book.json?query=" + URLEncoder.encode(query, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("검색어 인코딩 실패", e);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);

        HttpEntity<String> entity = new HttpEntity<>(null, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);

        return ResponseEntity.ok(response.getBody());
    }


    // 검색 결과 표시 (GET /api/search/results)
    @GetMapping("/results")
    public ResponseEntity<String> showResults(@RequestParam String query) {
        return searchBooks(query);
    }
}
