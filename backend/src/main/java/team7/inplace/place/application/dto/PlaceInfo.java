package team7.inplace.place.application.dto;

import java.util.List;
import team7.inplace.place.client.GooglePlaceClientResponse;
import team7.inplace.place.persistence.dto.PlaceQueryResult;
import team7.inplace.review.persistence.dto.ReviewQueryResult;
import team7.inplace.video.persistence.dto.VideoQueryResult;
import team7.inplace.video.persistence.dto.VideoQueryResult.SimpleVideo;

public class PlaceInfo {

    public record Detail(
        PlaceQueryResult.DetailedPlace place,
        GooglePlaceClientResponse.Place googlePlace,
        List<VideoQueryResult.SimpleVideo> videos,
        ReviewQueryResult.LikeRate reviewLikeRate
    ) {

        public static Detail of(
            PlaceQueryResult.DetailedPlace place, GooglePlaceClientResponse.Place googlePlace,
            List<VideoQueryResult.SimpleVideo> videos, ReviewQueryResult.LikeRate reviewLikeRate
        ) {
            return new Detail(
                place,
                googlePlace,
                videos,
                reviewLikeRate
            );
        }
    }

    public record Simple(
        PlaceQueryResult.DetailedPlace place,
        List<SimpleVideo> video
    ) {

        public static PlaceInfo.Simple of(
            PlaceQueryResult.DetailedPlace place,
            List<VideoQueryResult.SimpleVideo> video
        ) {
            return new PlaceInfo.Simple(place, video);
        }
    }

    public record Marker(
        PlaceQueryResult.Marker place,
        String influencerNames
    ) {

        public static PlaceInfo.Marker from(
            PlaceQueryResult.Marker marker, List<String> influencerNames) {
            return new PlaceInfo.Marker(marker, String.join(",", influencerNames));
        }
    }
}
