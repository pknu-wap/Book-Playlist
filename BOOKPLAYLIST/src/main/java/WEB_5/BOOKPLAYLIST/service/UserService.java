package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.auth.SecurityUtil;
import WEB_5.BOOKPLAYLIST.domain.dto.MyPagePlaylistDTO;
import WEB_5.BOOKPLAYLIST.domain.dto.UserProfileDTO;
import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;
import WEB_5.BOOKPLAYLIST.repository.PlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User create(String username, String email, String password) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        this.userRepository.save(user);
        return user;
    }

    public UserProfileDTO getUserProfile(Long userId) {
        // UserRepository를 사용하여 userId로 User를 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 닉네임을 포함한 UserProfileDTO 반환
        return new UserProfileDTO(user.getUsername());
    }

    public boolean authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.map(user -> passwordEncoder.matches(password, user.getPassword())).orElse(false);
    }

    public boolean isEmailDuplicate(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            System.out.println("이메일 중복: " + email); // 중복된 이메일 로그 출력
            return true;
        }
        System.out.println("이메일 사용 가능: " + email); // 사용 가능한 이메일 로그 출력
        return false;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean isUsernameDuplicate(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.isPresent();
    }


}