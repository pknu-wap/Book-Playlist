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

    public boolean isEmailDuplicate(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent();  // 이메일이 이미 존재하면 true 반환
    }

    public boolean isUsernameDuplicate(String username){
        Optional<User> user = userRepository.findByUsername(username);
        return user.isPresent();
    }
}
