package team7.inplace.video.application;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.AuthorizationErrorCode;
import team7.inplace.global.exception.code.PlaceErrorCode;
import team7.inplace.global.exception.code.VideoErrorCode;
import team7.inplace.influencer.persistence.InfluencerRepository;
import team7.inplace.place.application.dto.PlaceForVideo;
import team7.inplace.place.domain.Place;
import team7.inplace.place.domain.PlaceBulk;
import team7.inplace.place.persistence.PlaceRepository;
import team7.inplace.security.util.AuthorizationUtil;
import team7.inplace.video.application.command.VideoCommand;
import team7.inplace.video.application.command.VideoCommand.Create;
import team7.inplace.video.application.dto.VideoInfo;
import team7.inplace.video.domain.Video;
import team7.inplace.video.persistence.VideoRepository;
import team7.inplace.video.presentation.dto.VideoSearchParams;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final PlaceRepository placeRepository;
    private final InfluencerRepository influencerRepository;
    private final Pageable pageable = PageRequest.of(0, 10);

    @Transactional(readOnly = true)
    public List<VideoInfo> getVideosBySurround(VideoSearchParams videoSearchParams) {
        // 토큰 정보에 대한 검증
        if (AuthorizationUtil.isNotLoginUser()) {
            throw InplaceException.of(AuthorizationErrorCode.TOKEN_IS_EMPTY);
        }
        // Place 엔티티 조회
        Page<PlaceBulk> places = placeRepository.findPlacesByDistanceAndFilters(
                videoSearchParams.topLeftLongitude(),
                videoSearchParams.topLeftLatitude(),
                videoSearchParams.bottomRightLongitude(),
                videoSearchParams.bottomRightLatitude(),
                videoSearchParams.longitude(),
                videoSearchParams.latitude(),
                null,
                null,
                PageRequest.of(0, 10)
        );
        // 조회된 엔티티가 비어있는지 아닌지 확인
        if (places.isEmpty()) {
            throw InplaceException.of(PlaceErrorCode.NOT_FOUND);
        }
        // 장소를 기준으로 비디오 엔티티 조회 ( 장소 별로 가장 최근 비디오 하나 씩 )
        List<Video> videos = new ArrayList<>();
        for (PlaceBulk place : places.getContent()) {
            videos.add(videoRepository.findTopByPlaceOrderByIdDesc(place.getPlace())
                    .orElseThrow(() -> InplaceException.of(VideoErrorCode.NOT_FOUND)));
        }
        return videos.stream().map(this::videoToInfo).toList();
    }

    @Transactional(readOnly = true)
    public List<VideoInfo> getAllVideosDesc() {
        // id를 기준으로 내림차순 정렬하여 비디오 정보 불러오기
        List<Video> videos = videoRepository.findTop10ByOrderByIdDesc(pageable);

        // DTO 형식에 맞게 대입
        return videos.stream().map(this::videoToInfo).toList();
    }

    @Transactional(readOnly = true)
    public List<VideoInfo> getCoolVideo() {
        // 조회수 증가량을 기준으로 오름차순 정렬하여 비디오 정보 불러오기
        List<Video> videos = videoRepository.findTop10ByOrderByViewCountIncreaseDesc(pageable);

        // DTO 형식에 맞게 대입
        return videos.stream().map(this::videoToInfo).toList();
    }

    @Transactional(readOnly = true)
    public List<VideoInfo> getVideosByMyInfluencer(List<Long> influencerIds) {
        List<Video> videos = videoRepository.findTop10ByInfluencerIdIn(influencerIds, pageable);
        return videos.stream().map(this::videoToInfo).toList();
    }

    @Transactional(readOnly = true)
    public Page<VideoInfo> getPlaceNullVideo(Pageable pageable) {
        Page<Video> videos = videoRepository.findAllByPlaceIsNull(pageable);
        return videos.map(this::videoToInfo);
    }

    @Transactional
    public void createVideos(List<Create> videoCommands, List<Long> placeIds) {
        var videos = new ArrayList<Video>();
        for (int videoCommandIndex = 0; videoCommandIndex < videoCommands.size();
             videoCommandIndex++) {
            Create videoCommand = videoCommands.get(videoCommandIndex);
            Long placeId = placeIds.get(videoCommandIndex);
            var influencer = influencerRepository.getReferenceById(videoCommand.influencerId());

            if (hasNoPlace(placeId)) {
                videos.add(videoCommand.toEntityFrom(influencer, null));
                continue;
            }
            Place place = placeRepository.getReferenceById(placeId);
            videos.add(videoCommand.toEntityFrom(influencer, place));
        }

        videoRepository.saveAll(videos);
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
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> InplaceException.of(VideoErrorCode.NOT_FOUND));
        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> InplaceException.of(PlaceErrorCode.NOT_FOUND));
        video.addPlace(place);
    }

    @Transactional
    public void deleteVideo(Long videoId) {
        videoRepository.deleteById(videoId);
    }

    private VideoInfo videoToInfo(Video savedVideo) {
        Place place = savedVideo.getPlace();
        if (Objects.isNull(place)) {
            return new VideoInfo(
                    savedVideo.getId(),
                    "장소 정보 없음",
                    savedVideo.getVideoUrl(),
                    PlaceForVideo.of(-1L, "장소 정보 없음")
            );
        }
        String alias = AliasUtil.makeAlias(
                savedVideo.getInfluencer().getName(),
                place.getCategory()
        );
        return new VideoInfo(
                savedVideo.getId(),
                alias,
                savedVideo.getVideoUrl(),
                PlaceForVideo.of(place.getId(), place.getName())
        );
    }

    private boolean hasNoPlace(Long placeId) {
        return placeId == -1;
    }
}
