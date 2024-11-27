package WEB_5.BOOKPLAYLIST.repository;

import WEB_5.BOOKPLAYLIST.domain.dto.PlaylistSummaryDTO;
import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findTop10ByOrderByIdAsc();

    // 특정 유저의 플레이리스트 조회
    List<Playlist> findByUser_Id(Long userId);

    @Query("SELECT p FROM Playlist p JOIN PlaylistLike pl ON p.id = pl.playlist.id WHERE pl.user.id = :userId")
    List<Playlist> findLikedPlaylistsByUserId(@Param("userId") Long userId);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT p FROM Playlist p ORDER BY p.likeCount DESC")
    List<Playlist> findTopPlaylistsWithUser();

    boolean existsById(Long id);

    void deleteById(Long id);

    @Query("SELECT new WEB_5.BOOKPLAYLIST.domain.dto.PlaylistSummaryDTO(p.id, p.title, u.username, " +
            "CASE WHEN p.imageData IS NOT NULL THEN FUNCTION('TO_BASE64', p.imageData) ELSE NULL END, p.likeCount) " +
            "FROM Playlist p JOIN p.user u ORDER BY p.likeCount DESC")
    List<PlaylistSummaryDTO> findTopPlaylistsSummary();
}