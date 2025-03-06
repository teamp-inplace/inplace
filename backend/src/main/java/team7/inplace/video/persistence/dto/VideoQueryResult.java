package team7.inplace.video.persistence.dto;

import com.querydsl.core.annotations.QueryProjection;
import team7.inplace.place.domain.Category;
import team7.inplace.video.domain.CoolVideo;

public class VideoQueryResult {
    public record SimpleVideo(
            Long videoId,
            String videoUUID,
            String influencerName,
            Long placeId,
            String placeName,
            Category placeCategory
    ) {
        @QueryProjection
        public SimpleVideo {
        }

        public String videoUrl() {
            return "https://www.youtube.com/watch?v=" + videoUUID;
        }

        public CoolVideo toCoolVideo() {
            return CoolVideo.from(videoId, videoUUID, influencerName, placeId, placeName, placeCategory);
        }
    }
}
