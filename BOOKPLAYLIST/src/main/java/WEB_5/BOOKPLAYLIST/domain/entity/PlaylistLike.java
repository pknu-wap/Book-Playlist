package WEB_5.BOOKPLAYLIST.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "playlist_like", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "playlist_id"})
})
public class PlaylistLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // 유저와 연결
    private User user;

    @ManyToOne
    @JoinColumn(name = "playlist_id", nullable = false) // 플레이리스트와 연결
    private Playlist playlist;
}
