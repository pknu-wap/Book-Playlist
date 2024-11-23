package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.auth.SecurityUtil;
import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.domain.entity.PlaylistLike;
import WEB_5.BOOKPLAYLIST.domain.entity.User;
import WEB_5.BOOKPLAYLIST.exception.PlaylistAlreadyLikedException;
import WEB_5.BOOKPLAYLIST.exception.PlaylistNotFoundException;
import WEB_5.BOOKPLAYLIST.exception.UserNotFoundException;
import WEB_5.BOOKPLAYLIST.repository.PlaylistLikeRepository;
import WEB_5.BOOKPLAYLIST.repository.PlaylistRepository;
import WEB_5.BOOKPLAYLIST.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Transactional
public class PlaylistLikeService {
    private final PlaylistLikeRepository playlistLikeRepository;
    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;

    public boolean likePlaylist(Long playlistId) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();

        if (userId == null) {
            throw new UserNotFoundException("User not authenticated");
        }

        // Playlist 조회
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + playlistId));

        if (playlistLikeRepository.existsByUser_IdAndPlaylist_Id(userId, playlistId)) {
            throw new PlaylistAlreadyLikedException("Playlist already liked");
        }

        // PlaylistLike 엔터티 생성
        PlaylistLike playlistLike = new PlaylistLike();
        playlistLike.setPlaylist(playlist);
        playlistLike.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId)));

        playlistLikeRepository.save(playlistLike);

        // 좋아요 수 증가
        playlist.setLikeCount(playlist.getLikeCount() + 1);

        // 변경 사항 저장
        playlistRepository.save(playlist);

        return true;
    }

    public boolean unlikePlaylist(Long playlistId) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();

        if (userId == null) {
            throw new UserNotFoundException("User not authenticated");
        }

        // Playlist 조회
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + playlistId));

        // 사용자와 플레이리스트 사이의 좋아요 관계 존재 여부 확인
        boolean exists = playlistLikeRepository.existsByUser_IdAndPlaylist_Id(userId, playlistId);
        if (!exists) {
            throw new PlaylistAlreadyLikedException("Playlist is not liked by the user");
        }

        // 좋아요 관계 삭제
        playlistLikeRepository.deleteByUser_IdAndPlaylist_Id(userId, playlistId);

        // 좋아요 수 감소
        playlist.setLikeCount(Math.max(0, playlist.getLikeCount() - 1)); // 0 이하로 내려가지 않도록 처리

        // 변경 사항 저장
        playlistRepository.save(playlist);

        return true;
    }

    public boolean isPlaylistLiked(Long playlistId) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();
        if (userId == null) {
            return false;
        }
        return playlistLikeRepository.existsByUser_IdAndPlaylist_Id(userId, playlistId);
    }
    public int getLikeCount(Long playlistId) {
        // 플레이리스트 조회 (없을 경우 예외 발생)
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + playlistId));
        // 찜 수 반환
        return playlist.getLikeCount();
    }
}
