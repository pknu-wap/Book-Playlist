package WEB_5.BOOKPLAYLIST.config;

import WEB_5.BOOKPLAYLIST.auth.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // CSRF 비활성화 (JWT 사용)
                .csrf(csrf -> csrf.disable())
                // 세션을 사용하지 않음
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // 인증이 필요 없는 요청
                        .requestMatchers("/api/playlist/playlists").permitAll() // 모든 플레이리스트 조회 허용
                        // 인증이 필요한 요청
                        .requestMatchers(
                                "/api/booklikes/{isbn}/like",
                                "/api/booklikes/{isbn}/unlike",
                                "/api/booklikes/{isbn}/isLiked",
                                "/api/booklikes/mainpage/like-by-isbn",
                                "/api/books/{isbn}/comments",
                                "/api/books/comments/{commentId}",
                                "/api/books/{bookisbn}/rating",
                                "/api/mypage/mine/playlists",
                                "/api/mypage/profile",
                                "/api/mypage/favorite/playlists",
                                "/api/mypage/favorite/books",
                                "/api/mypage/mine/comments",
                                "/api/mypage/profile/username",
                                "/api/playlist/create",
                                "/api/playlist/save",
                                "/api/playlist/{playlistId}",
                                "/api/playlist/{playlistId}/addBook",
                                "/api/playlistlikes/{playlistId}/like",
                                "/api/playlistlikes/{playlistId}/unlike",
                                "/api/playlistlikes/{playlistId}/isLiked"
                        ).authenticated()
                        // 그 외 모든 요청
                        .anyRequest().permitAll()
                )
                // JWT 인증 필터 추가
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://book-playlist.netlify.app")); // 허용 도메인
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")); // 허용 HTTP 메서드
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With")); // 허용 헤더
        configuration.setExposedHeaders(List.of("Authorization")); // 노출 헤더
        configuration.setAllowCredentials(true); // 인증 정보 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
