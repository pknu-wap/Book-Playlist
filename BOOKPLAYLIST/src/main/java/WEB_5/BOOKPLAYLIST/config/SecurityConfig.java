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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 비활성화 (JWT 방식)
                .authorizeHttpRequests(authorize -> authorize
                        // 인증이 필요한 엔드포인트
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
                        // 인증이 필요 없는 엔드포인트
                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // JWT 인증 필터 추가

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://book-playlist.netlify.app")); // 슬래시 제거
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
