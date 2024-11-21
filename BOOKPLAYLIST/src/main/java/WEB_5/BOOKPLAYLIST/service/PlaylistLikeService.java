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

        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + playlistId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        if (playlistLikeRepository.existsByUser_IdAndPlaylist_Id(userId, playlistId)) {
            throw new PlaylistAlreadyLikedException("Playlist already liked");
        }

        PlaylistLike playlistLike = new PlaylistLike();
        playlistLike.setPlaylist(playlist);
        playlistLike.setUser(user);
        playlistLikeRepository.save(playlistLike);
        return true;
    }

    public boolean unlikePlaylist(Long playlistId) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();

        if (userId == null) {
            throw new UserNotFoundException("User not authenticated");
        }

        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + playlistId));

        boolean exists = playlistLikeRepository.existsByUser_IdAndPlaylist_Id(userId, playlistId);
        if (!exists) {
            throw new PlaylistAlreadyLikedException("Playlist is not liked by the user");
        }

        playlistLikeRepository.deleteByUser_IdAndPlaylist_Id(userId, playlistId);
        return true;
    }

    public boolean isPlaylistLiked(Long playlistId) {
        Long userId = SecurityUtil.getCurrentUserIdFromSession();
        if (userId == null) {
            return false;
        }
        return playlistLikeRepository.existsByUser_IdAndPlaylist_Id(userId, playlistId);
    }
}
