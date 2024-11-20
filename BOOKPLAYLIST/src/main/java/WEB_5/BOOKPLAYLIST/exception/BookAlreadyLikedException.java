package WEB_5.BOOKPLAYLIST.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// 400 Bad Request 상태 코드를 반환하도록 설정
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BookAlreadyLikedException extends RuntimeException {
    public BookAlreadyLikedException(String message) {
        super(message);
    }
}
