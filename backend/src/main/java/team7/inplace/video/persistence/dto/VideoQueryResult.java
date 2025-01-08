package team7.inplace.video.persistence.dto;

import com.querydsl.core.annotations.QueryProjection;
import team7.inplace.place.domain.Category;

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
    }
}
