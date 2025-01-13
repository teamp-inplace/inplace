package team7.inplace.video.presentation.dto;

import team7.inplace.video.application.AliasUtil;
import team7.inplace.video.persistence.dto.VideoQueryResult;

// Video 엔티티의 Controller Response 정보 전달을 담당하는 클래스
public class VideoResponse {
    public record Simple(
            Long videoId,
            String videoAlias,
            String videoUrl,
            VideoResponse.Place place
    ) {
        public static VideoResponse.Simple from(VideoQueryResult.SimpleVideo videoInfo) {
            var place = new VideoResponse.Place(
                    videoInfo.placeId(),
                    videoInfo.placeName()
            );
            return new VideoResponse.Simple(
                    videoInfo.videoId(),
                    AliasUtil.makeAlias(videoInfo.influencerName(), videoInfo.placeCategory()),
                    videoInfo.videoUrl(),
                    place
            );
        }
    }

    public record Place(
            Long placeId,
            String placeName
    ) {
    }
}