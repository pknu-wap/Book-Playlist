package WEB_5.BOOKPLAYLIST.service;

import WEB_5.BOOKPLAYLIST.domain.dto.MyPagePlaylistDTO;
import WEB_5.BOOKPLAYLIST.domain.entity.Playlist;
import WEB_5.BOOKPLAYLIST.repository.PlaylistRepository;
import WEB_5.BOOKPLAYLIST.auth.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MypageService {
    @Autowired
    private PlaylistRepository playlistRepository;

    public List<MyPagePlaylistDTO> getUserPlaylists() {

        // 현재 로그인한 유저의 ID 가져오기
        Long userId = SecurityUtil.getCurrentUserIdFromSession();
        System.out.println("로그인된 사용자 ID: " + userId); // 디버깅용 로그

        // 유저 ID로 플레이리스트 조회
        List<Playlist> playlists = playlistRepository.findByUser_Id(userId);
        System.out.println("조회된 플레이리스트: " + playlists); // 디버깅용 로그

        // 필요한 정보만 포함한 DTO로 변환, 이미지 데이터는 Base64로 인코딩
        return playlists.stream()
                .map(playlist -> {
                    String base64Image = playlist.getImageData() != null ?
                            Base64.getEncoder().encodeToString(playlist.getImageData()) : null;
                    return new MyPagePlaylistDTO(
                            playlist.getId(),
                            playlist.getTitle(),
                            base64Image
                    );
                })
                .collect(Collectors.toList());
    }
}
