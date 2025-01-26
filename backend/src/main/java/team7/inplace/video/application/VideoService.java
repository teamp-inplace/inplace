package team7.inplace.video.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.AuthorizationErrorCode;
import team7.inplace.global.exception.code.VideoErrorCode;
import team7.inplace.security.util.AuthorizationUtil;
import team7.inplace.video.application.command.VideoCommand;
import team7.inplace.video.application.command.VideoCommand.Create;
import team7.inplace.video.domain.Video;
import team7.inplace.video.persistence.VideoReadRepository;
import team7.inplace.video.persistence.VideoRepository;
import team7.inplace.video.persistence.dto.VideoQueryResult;
import team7.inplace.video.presentation.dto.VideoSearchParams;

@Service
@Slf4j
@RequiredArgsConstructor
public class VideoService {

    private final VideoReadRepository videoReadRepository;
    private final VideoRepository videoRepository;

    //TODO: Facade에서 호출로 변경해야함.
    @Transactional(readOnly = true)
    public List<VideoQueryResult.SimpleVideo> getVideosBySurround(
        VideoSearchParams videoSearchParams,
        Pageable pageable
    ) {
        // 토큰 정보에 대한 검증
        if (AuthorizationUtil.isNotLoginUser()) {
            throw InplaceException.of(AuthorizationErrorCode.TOKEN_IS_EMPTY);
        }

        var surroundVideos = videoReadRepository.findSimpleVideosInSurround(
            Double.valueOf(videoSearchParams.topLeftLongitude()),
            Double.valueOf(videoSearchParams.topLeftLatitude()),
            Double.valueOf(videoSearchParams.bottomRightLongitude()),
            Double.valueOf(videoSearchParams.bottomRightLatitude()),
            Double.valueOf(videoSearchParams.longitude()),
            Double.valueOf(videoSearchParams.latitude()),
            pageable
        );

        return surroundVideos.getContent();
    }

    @Transactional(readOnly = true)
    public List<VideoQueryResult.SimpleVideo> getAllVideosDesc() {
        var top10Videos = videoReadRepository.findTop10ByLatestUploadDate();

        return top10Videos.stream().toList();
    }

    @Transactional(readOnly = true)
    public List<VideoQueryResult.SimpleVideo> getCoolVideo() {
        var top10Videos = videoReadRepository.findTop10ByViewCountIncrement();

        return top10Videos.stream().toList();
    }

    @Transactional(readOnly = true)
    public List<VideoQueryResult.SimpleVideo> getMyInfluencerVideos(Long userId) {
        var top10Videos = videoReadRepository.findTop10ByLikedInfluencer(userId);

        return top10Videos.stream().toList();
    }

    @Transactional(readOnly = true)
    public Page<VideoQueryResult.SimpleVideo> getOneInfluencerVideos(
        Long influencerId, Pageable pageable) {
        var videos = videoReadRepository.findSimpleVideosWithOneInfluencerId(influencerId,
            pageable);
        return videos;
    }

    @Transactional
    public void createVideos(List<Create> videoCommands, Long influencerId) {
        var videos = videoCommands.stream()
            .map(Create::toEntity)
            .toList();
        for (int i = 0; i < videoCommands.size(); i++) {
            if (videos.get(i).getVideoUrl() == null) {
                log.info(videoCommands.get(i).toString());
            }
        }
        videoRepository.saveAll(videos);
    }

    @Transactional(readOnly = true)
    public Page<VideoQueryResult.SimpleVideo> getVideoWithNoPlace(Pageable pageable) {
        return videoReadRepository.findVideoWithNoPlace(pageable);
    }

    @Transactional
    public void updateVideoViews(List<VideoCommand.UpdateViewCount> videoCommands) {
        for (VideoCommand.UpdateViewCount videoCommand : videoCommands) {
            Video video = videoRepository.findById(videoCommand.videoId())
                .orElseThrow(() -> InplaceException.of(VideoErrorCode.NOT_FOUND));
            video.updateViewCount(videoCommand.viewCount());
        }
    }

    @Transactional
    public void addPlaceInfo(Long videoId, Long placeId) {
        var video = videoRepository.findById(videoId)
            .orElseThrow(() -> InplaceException.of(VideoErrorCode.NOT_FOUND));

        video.addPlace(placeId);
    }

    @Transactional
    public void deleteVideo(Long videoId) {
        videoRepository.deleteById(videoId);
    }
}
