package WEB_5.BOOKPLAYLIST.exception;

/**
 * 사용자가 이미 플레이리스트에 좋아요를 표시한 경우 발생하는 예외
 */
public class PlaylistAlreadyLikedException extends RuntimeException {
    public PlaylistAlreadyLikedException(String message) {
        super(message);
    }
}
