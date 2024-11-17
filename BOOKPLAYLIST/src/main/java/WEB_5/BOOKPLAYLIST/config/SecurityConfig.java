package WEB_5.BOOKPLAYLIST.config;

import WEB_5.BOOKPLAYLIST.auth.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/playlist/**", "/api/mypage/**").authenticated()
                        .anyRequest().permitAll()
                )
                .formLogin().disable() // REST API에서는 일반적으로 폼 로그인을 사용하지 않습니다.
                .httpBasic(); // HTTP Basic 인증 유지

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 클라이언트 도메인만 허용
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://book-playlist.netlify.app"));
        // 필요한 HTTP 메서드 모두 허용
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // 클라이언트가 보내는 헤더 허용
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        // 쿠키 포함 허용
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 모든 경로에 대해 CORS 설정 적용
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // AuthenticationManager 빈 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
