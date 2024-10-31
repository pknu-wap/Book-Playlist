package WEB_5.BOOKPLAYLIST.repository;

import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findTop10ByOrderByIdAsc();
}