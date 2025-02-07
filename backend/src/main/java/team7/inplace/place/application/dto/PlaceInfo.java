package team7.inplace.place.application.dto;

import java.util.List;
import team7.inplace.place.client.GooglePlaceClientResponse;
import team7.inplace.place.domain.Place;
import team7.inplace.review.persistence.dto.ReviewQueryResult;
import team7.inplace.video.persistence.dto.VideoQueryResult;

public class PlaceInfo {

    public record Detail(
        Long placeId,
        String placeName,
        String address1,
        String address2,
        String address3,
        String category,

        GooglePlaceClientResponse.Place googlePlace,
        List<VideoQueryResult.SimpleVideo> videos,
        ReviewQueryResult.LikeRate reviewLikeRate
    ) {

        public static Detail of(
            Place place, GooglePlaceClientResponse.Place googlePlace,
            List<VideoQueryResult.SimpleVideo> videos, ReviewQueryResult.LikeRate reviewLikeRate
        ) {
            return new Detail(
                place.getId(),
                place.getName(),
                place.getAddress().getAddress1(),
                place.getAddress().getAddress2(),
                place.getAddress().getAddress3(),
                place.getCategory().name(),
                googlePlace,
                videos,
                reviewLikeRate
            );
        }
    }
}
