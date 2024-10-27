package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

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

    public boolean authenticate(String username, String password){
        Optional<User> user0pt = userRepository.findByUsername(username);
        return user0pt.map(user -> passwordEncoder.matches(password, user.getPassword())).orElse(false);
    }

    public boolean isEmailDuplicate(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            System.out.println("이메일 중복: " + email); // 추가: 이메일이 이미 존재하는 경우 로그 출력
            return true;
        }
        System.out.println("이메일 사용 가능: " + email); // 추가: 이메일이 사용 가능한 경우 로그 출력
        return false;
    }
    public boolean isUsernameDuplicate(String username){
        Optional<User> user = userRepository.findByUsername(username);
        return user.isPresent();
    }
}


