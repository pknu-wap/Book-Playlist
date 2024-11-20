package WEB_5.BOOKPLAYLIST.auth;

import WEB_5.BOOKPLAYLIST.domain.entity.CustomUserDetails;
import WEB_5.BOOKPLAYLIST.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {
    public static Long getCurrentUserIdFromSession() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            return userDetails.getId();
        }
        throw new UnauthorizedException("로그인된 유저가 없습니다.");
    }
}
