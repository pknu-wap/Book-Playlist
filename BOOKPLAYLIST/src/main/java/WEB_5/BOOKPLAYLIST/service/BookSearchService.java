package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.dto.NaverBookResponse;
import WEB_5.BOOKPLAYLIST.domain.entity.Book;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Service
public class BookSearchService {

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

    // 책 검색 메서드
    public ResponseEntity<NaverBookResponse> searchBooks(String query) {
        URI uri = UriComponentsBuilder
                .fromUriString("https://openapi.naver.com")
                .path("/v1/search/book.json")
                .queryParam("query", query)
                .encode()
                .build()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);

        HttpEntity<String> entity = new HttpEntity<>(null, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<NaverBookResponse> response;
        try {
            response = restTemplate.exchange(uri, HttpMethod.GET, entity, NaverBookResponse.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        }

        if (response.getStatusCode() == HttpStatus.OK) {
            return ResponseEntity.ok(response.getBody());
        } else {
            return ResponseEntity.status(response.getStatusCode()).build();
        }
    }

    // ISBN으로 책 상세 정보 조회 메서드
    public ResponseEntity<NaverBookResponse> getBookDetailByISBN(String isbn) {
        URI uri = UriComponentsBuilder
                .fromUriString("https://openapi.naver.com")
                .path("/v1/search/book.json")
                .queryParam("query", isbn)
                .queryParam("d_isbn", isbn)
                .encode()
                .build()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);

        HttpEntity<String> entity = new HttpEntity<>(null, headers);

        RestTemplate restTemplate = new RestTemplate();
        try {
            return restTemplate.exchange(uri, HttpMethod.GET, entity, NaverBookResponse.class);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        }
    }

    // NaverBookResponse.NaverBookItem을 Book 엔티티로 변환하는 메서드
    public Book mapToBook(NaverBookResponse.NaverBookItem item) {
        Book book = new Book();
        book.setTitle(item.getTitle());
        book.setAuthor(item.getAuthor());
        book.setPublisher(item.getPublisher());
        book.setLink(item.getLink());
        book.setImage(item.getImage());
        book.setIsbn(item.getIsbn());
        book.setDescription(item.getDescription());
        return book;
    }
}
