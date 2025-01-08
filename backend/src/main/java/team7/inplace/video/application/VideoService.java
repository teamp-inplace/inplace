package team7.inplace.video.application;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.AuthorizationErrorCode;
import team7.inplace.global.exception.code.VideoErrorCode;
import team7.inplace.influencer.persistence.InfluencerRepository;
import team7.inplace.security.util.AuthorizationUtil;
import team7.inplace.video.application.command.VideoCommand;
import team7.inplace.video.application.command.VideoCommand.Create;
import team7.inplace.video.application.dto.VideoInfo;
import team7.inplace.video.domain.Video;
import team7.inplace.video.persistence.VideoReadRepository;
import team7.inplace.video.persistence.VideoRepository;
import team7.inplace.video.presentation.dto.VideoSearchParams;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoReadRepository videoReadRepository;
    private final VideoRepository videoRepository;
    //    private final PlaceRepository placeRepository;
    private final InfluencerRepository influencerRepository;
    private final Pageable pageable = PageRequest.of(0, 10);

    @Transactional(readOnly = true)
    public List<VideoInfo> getVideosBySurround(VideoSearchParams videoSearchParams) {
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

        return surroundVideos.map(VideoInfo::from).toList();
    }

    @Transactional(readOnly = true)
    public List<VideoInfo> getAllVideosDesc() {
        var top10Videos = videoReadRepository.findTop10ByLatestUploadDate();

        return top10Videos.stream().map(VideoInfo::from).toList();
    }

    @Transactional(readOnly = true)
    public List<VideoInfo> getCoolVideo() {
        var top10Videos = videoReadRepository.findTop10ByViewCountIncrement();

        return top10Videos.stream().map(VideoInfo::from).toList();
    }

    @Transactional(readOnly = true)
    public List<VideoInfo> getMyInfluencerVideos(Long userId) {
        var top10Videos = videoReadRepository.findTop10ByLikedInfluencer(userId);

        return top10Videos.stream().map(VideoInfo::from).toList();
    }

    @Transactional
    public void createVideos(List<Create> videoCommands, Long influencerId) {
        var videos = videoCommands.stream()
                .map(Create::toEntity)
                .toList();

        videoRepository.saveAll(videos);
    }

    private boolean hasNoPlace(Long placeId) {
        return placeId == null;
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
