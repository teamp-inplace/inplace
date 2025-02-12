package team7.inplace.review.presentation.dto;

import team7.inplace.review.application.dto.ReviewInfo;

public class ReviewResponse {

    public record Invitation(
        String placeName,
        String placeAddress,
        String placeImgUrl,
        String influencerName,
        String userNickname
    ) {

        public static Invitation from(ReviewInfo.Invitation reviewInfo) {
            return new Invitation(
                reviewInfo.placeName(),
                reviewInfo.placeAddress(),
                "",
                reviewInfo.influencerName(),
                reviewInfo.userNickname()
            );
        }
    }
}
