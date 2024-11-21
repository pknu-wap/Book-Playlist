package WEB_5.BOOKPLAYLIST.exception;

/**
 * 플레이리스트를 찾을 수 없을 때 발생하는 예외
 */
public class PlaylistNotFoundException extends RuntimeException {
    public PlaylistNotFoundException(String message) {
        super(message);
    }
}
