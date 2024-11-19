package WEB_5.BOOKPLAYLIST.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NaverBookResponse {

    @JsonProperty("items")
    private List<NaverBookItem> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NaverBookItem {
        private String title;
        private String link;
        private String image;
        private String author;
        private String discount;
        private String publisher;
        private String pubdate;
        private String isbn;
        private String description;
    }
}
