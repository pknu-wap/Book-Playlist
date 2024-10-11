package WEB_5.BOOKPLAYLIST.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests.anyRequest().permitAll()
                )
                .formLogin(form -> form
                        .loginPage("/api/auth/login")
                        .defaultSuccessUrl("/")
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessUrl("/")
                )
                .csrf(csrf -> csrf.disable())  // CSRF 비활성화
                .cors(cors -> {});  // CORS 설정

        return http.build();
    }

    // 비밀번호 암호화에 사용할 PasswordEncoder 빈을 정의합니다.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
