package team7.inplace.place.presentation.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import team7.inplace.place.application.dto.PlaceInfo;
import team7.inplace.place.client.GooglePlaceClientResponse;
import team7.inplace.review.persistence.dto.ReviewQueryResult;
import team7.inplace.video.persistence.dto.VideoQueryResult;

public class PlaceNewResponse {

    public record Place(
        Long placeId,
        String placeName,
        Address address,
        String category,
        Facility facility,
        List<Video> videos,
        List<GoogleReview> googleReviews,
        List<Review> reviews,
        PlaceLike placeLike
    ) {

        public static Place from(PlaceInfo.Detail place) {
            return new Place(
                place.placeId(),
                place.placeName(),
                new Address(
                    place.address1(),
                    place.address2(),
                    place.address3()
                ),
                place.category(),
                PlaceNewResponse.Facility.of(
                    place.googlePlace().accessibilityOptions(),
                    place.googlePlace().parkingOptions()
                ),
                place.videos().stream()
                    .map(Video::from)
                    .toList(),
                place.googlePlace().reviews()
                    .stream()
                    .map(GoogleReview::from)
                    .toList(),
                new ArrayList<>(),
                PlaceNewResponse.PlaceLike.from(place.reviewLikeRate())
            );
        }
    }

    public record Address(
        String address1,
        String address2,
        String address3
    ) {

    }

    public record Facility(
        Boolean wheelchairAccessibleParking,
        Boolean wheelchairAccessibleEntrance,
        Boolean wheelchairAccessibleRestroom,
        Boolean wheelchairAccessibleSeating,
        Boolean freeParkingLot,
        Boolean paidParkingLot,
        Boolean freeStreetParking,
        Boolean paidStreetParking,
        Boolean valetParking,
        Boolean freeGarageParking,
        Boolean paidGarageParking
    ) {

        public static Facility of(
            GooglePlaceClientResponse.AccessibilityOptions accessibilityOptions,
            GooglePlaceClientResponse.ParkingOptions parkingOptions
        ) {
            if (accessibilityOptions == null && parkingOptions == null) {
                return new Facility(
                    false, false, false, false,
                    false, false, false, false, false, false, false
                );
            }

            if (accessibilityOptions == null) {
                return new Facility(
                    false, false, false, false,
                    parkingOptions.freeParkingLot(),
                    parkingOptions.paidParkingLot(),
                    parkingOptions.freeStreetParking(),
                    parkingOptions.paidStreetParking(),
                    parkingOptions.valetParking(),
                    parkingOptions.freeGarageParking(),
                    parkingOptions.paidGarageParking()
                );
            }

            if (parkingOptions == null) {
                return new Facility(
                    accessibilityOptions.wheelchairAccessibleParking(),
                    accessibilityOptions.wheelchairAccessibleEntrance(),
                    accessibilityOptions.wheelchairAccessibleRestroom(),
                    accessibilityOptions.wheelchairAccessibleSeating(),
                    false, false, false, false, false, false, false
                );
            }
            return new Facility(
                accessibilityOptions.wheelchairAccessibleParking(),
                accessibilityOptions.wheelchairAccessibleEntrance(),
                accessibilityOptions.wheelchairAccessibleRestroom(),
                accessibilityOptions.wheelchairAccessibleSeating(),
                parkingOptions.freeParkingLot(),
                parkingOptions.paidParkingLot(),
                parkingOptions.freeStreetParking(),
                parkingOptions.paidStreetParking(),
                parkingOptions.valetParking(),
                parkingOptions.freeGarageParking(),
                parkingOptions.paidGarageParking()
            );
        }
    }

    public record GoogleReview(
        Boolean like,
        String text,
        String name,
        String publishTime
    ) {

        public static GoogleReview from(GooglePlaceClientResponse.Review review) {
            return new GoogleReview(
                review.rating() >= 3,
                review.text().text(),
                review.authorAttribution().displayName(),
                review.publishTime().toString()
            );
        }
    }

    public record Review(
        Long reviewId,
        boolean likes,
        String comment,
        String userNickname,
        LocalDate createdDate,
        boolean mine
    ) {

    }

    public record PlaceLike(
        Long like,
        Long dislike
    ) {

        public static PlaceLike from(ReviewQueryResult.LikeRate placeLike) {
            return new PlaceLike(placeLike.likes(), placeLike.dislikes());
        }
    }

    public record Video(
        String videoUrl,
        String influencerName
    ) {

        public static Video from(VideoQueryResult.SimpleVideo video) {
            return new Video(video.videoUrl(), video.influencerName());
        }
    }
}
