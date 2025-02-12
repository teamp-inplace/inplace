package team7.inplace.review.persistence.dto;

import com.querydsl.core.annotations.QueryProjection;
import java.time.LocalDate;

public class ReviewQueryResult {

    public record Simple(
        Long reviewId,
        Boolean likes,
        String comment,
        String userNickname,
        LocalDate createdAt,
        Boolean mine
    ) {

        @QueryProjection
        public Simple {
        }
    }

    public record Detail(
        Long reviewId,
        Boolean likes,
        String comment,
        LocalDate createdAt,
        Long placeId,
        String placeName,
        String placeAddress1,
        String placeAddress2,
        String placeAddress3
    ) {

        @QueryProjection
        public Detail {
        }
    }

    public record LikeRate(
        Long likes,
        Long dislikes
    ) {

        @QueryProjection
        public LikeRate {
        }
    }
}
