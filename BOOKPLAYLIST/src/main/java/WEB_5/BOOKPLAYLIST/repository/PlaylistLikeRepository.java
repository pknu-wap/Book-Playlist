package WEB_5.BOOKPLAYLIST.repository;

import WEB_5.BOOKPLAYLIST.domain.entity.PlaylistLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PlaylistLikeRepository extends JpaRepository<PlaylistLike, Long> {
    boolean existsByUser_IdAndPlaylist_Id(Long userId, Long playlistId);

    void deleteByUser_IdAndPlaylist_Id(Long userId, Long playlistId);
    @Modifying
    @Query("UPDATE Playlist p SET p.likeCount = p.likeCount + 1 WHERE p.id = :playlistId")
    void incrementLikeCount(@Param("playlistId") Long playlistId);

    @Modifying
    @Query("UPDATE Playlist p SET p.likeCount = p.likeCount - 1 WHERE p.id = :playlistId")
    void decrementLikeCount(@Param("playlistId") Long playlistId);
}
