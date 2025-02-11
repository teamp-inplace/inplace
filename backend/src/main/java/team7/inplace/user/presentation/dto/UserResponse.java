package team7.inplace.user.presentation.dto;

import java.time.LocalDate;
import team7.inplace.influencer.application.dto.InfluencerInfo;
import team7.inplace.place.application.dto.LikedPlaceInfo;
import team7.inplace.review.persistence.dto.ReviewQueryResult;
import team7.inplace.user.application.dto.UserInfo;

public class UserResponse {

    public record Info(
        String nickname
    ) {

        public static Info from(UserInfo userInfo) {
            return new Info(userInfo.nickname());
        }
    }

    public record Review(
        Long reviewId,
        boolean likes,
        String comment,
        LocalDate createdDate,
        ReviewPlace place
    ) {

        public static Review from(
            ReviewQueryResult.Detail review
        ) {
            var reviewPlaceAddress = new ReviewPlaceAddress(
                review.placeAddress1(),
                review.placeAddress2(),
                review.placeAddress3()
            );
            var reviewPlace = new ReviewPlace(
                review.placeId(),
                review.placeName(),
                review.placeImgUrl(),
                reviewPlaceAddress
            );
            return new Review(
                review.reviewId(),
                review.likes(),
                review.comment(),
                review.createdAt(),
                reviewPlace
            );
        }
    }

    public record ReviewPlace(
        Long placeId,
        String name,
        String imgUrl,
        ReviewPlaceAddress address
    ) {

    }

    public record ReviewPlaceAddress(
        String address1,
        String address2,
        String address3
    ) {

    }

    public record LikedPlace(
        Long placeId,
        String placeName,
        String imageUrl,
        String influencerName,
        boolean likes
    ) {

        public static LikedPlace from(LikedPlaceInfo likedPlaceInfo) {
            return new LikedPlace(
                likedPlaceInfo.placeId(),
                likedPlaceInfo.placeName(),
                likedPlaceInfo.imageUrl(),
                likedPlaceInfo.influencerName(),
                likedPlaceInfo.likes()
            );
        }
    }

    public record LikedInfluencer(
        Long influencerId,
        String influencerName,
        String influencerImgUrl,
        String influencerJob,
        boolean likes
    ) {

        public static LikedInfluencer from(InfluencerInfo influencerInfo) {
            return new LikedInfluencer(
                influencerInfo.influencerId(),
                influencerInfo.influencerName(),
                influencerInfo.influencerImgUrl(),
                influencerInfo.influencerJob(),
                influencerInfo.likes()
            );
        }
    }
}
