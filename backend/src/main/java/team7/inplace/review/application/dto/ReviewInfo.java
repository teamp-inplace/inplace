package team7.inplace.review.application.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import team7.inplace.place.persistence.dto.PlaceQueryResult;
import team7.inplace.review.domain.Review;
import team7.inplace.user.domain.User;
import team7.inplace.video.persistence.dto.VideoQueryResult.SimpleVideo;

public class ReviewInfo {

    public record Detail(
        Long id,
        boolean likes,
        String comment,
        Long userId,
        LocalDate createdDate,
        boolean mine
    ) {

        public static ReviewInfo.Detail from(Review review, boolean isMine) {
            return new ReviewInfo.Detail(
                review.getId(),
                review.getIsLiked(),
                review.getComment(),
                review.getUserId(),
                review.getCreatedDate(),
                isMine
            );
        }
    }

    public record Invitation(
        String placeName,
        String placeAddress,
        String influencerName,
        String userNickname
    ) {

        public static ReviewInfo.Invitation from(
            PlaceQueryResult.DetailedPlace place,
            List<SimpleVideo> video,
            User user
        ) {
            return new ReviewInfo.Invitation(
                place.placeName(),
                place.address1() + " " + place.address2() + " " + place.address3(),
                video.stream().map(SimpleVideo::influencerName).distinct()
                    .collect(Collectors.joining(", ")),
                user.getNickname()
            );
        }
    }
}