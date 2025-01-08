package team7.inplace.video.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.admin.crawling.application.YoutubeCrawlingService;
import team7.inplace.global.annotation.Facade;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.AuthorizationErrorCode;
import team7.inplace.place.application.PlaceService;
import team7.inplace.place.application.command.PlacesCommand;
import team7.inplace.security.util.AuthorizationUtil;
import team7.inplace.user.application.UserService;
import team7.inplace.video.application.command.VideoCommand;
import team7.inplace.video.application.dto.VideoInfo;

@Facade
@Slf4j
@RequiredArgsConstructor
public class VideoFacade {
    private final VideoService videoService;
    private final PlaceService placeService;
    private final YoutubeCrawlingService youtubeCrawlingService;
    private final UserService userService;

    @Transactional
    public void createVideos(
            List<VideoCommand.Create> videoCommands,
            Long influencerId
    ) {
        videoService.createVideos(videoCommands, influencerId);
    }

    @Transactional
    public void updateVideoViews(List<VideoCommand.UpdateViewCount> videoCommands) {
        videoService.updateVideoViews(videoCommands);
    }

    @Transactional
    public void addPlaceInfo(Long videoId, PlacesCommand.Create placeCommand) {
        var placeId = placeService.createPlace(placeCommand);
        videoService.addPlaceInfo(videoId, placeId);
    }

    @Transactional(readOnly = true)
    public List<VideoInfo> getMyInfluencerVideos() {
        // 토큰 정보에 대한 검증
        if (AuthorizationUtil.isNotLoginUser()) {
            throw InplaceException.of(AuthorizationErrorCode.TOKEN_IS_EMPTY);
        }
        // User 정보를 쿠키에서 추출
        Long userId = AuthorizationUtil.getUserId();
        // 인플루언서 id를 사용하여 영상을 조회
        return videoService.getMyInfluencerVideos(userId);
    }
}
