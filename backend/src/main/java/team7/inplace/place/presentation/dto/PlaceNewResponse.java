package team7.inplace.place.presentation.dto;

import static com.fasterxml.jackson.annotation.JsonInclude.Include;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import team7.inplace.place.application.dto.PlaceInfo;
import team7.inplace.place.client.GooglePlaceClientResponse;
import team7.inplace.place.client.GooglePlaceClientResponse.AccessibilityOptions;
import team7.inplace.place.client.GooglePlaceClientResponse.ParkingOptions;
import team7.inplace.place.client.GooglePlaceClientResponse.PaymentOptions;
import team7.inplace.place.client.GooglePlaceClientResponse.RegularOpeningHours;
import team7.inplace.review.persistence.dto.ReviewQueryResult;
import team7.inplace.video.persistence.dto.VideoQueryResult;

public class PlaceNewResponse {

    public record Place(
        Long placeId,
        String placeName,
        Address address,
        String category,
        Double longitude,
        Double latitude,
        Facility facility,
        List<Video> videos,
        List<GoogleReview> googleReviews,
        String googlePlaceUrl,
        List<String> openingHours,
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
                place.longitude(),
                place.latitude(),
                PlaceNewResponse.Facility.of(
                    place.googlePlace().accessibilityOptions().orElse(null),
                    place.googlePlace().parkingOptions().orElse(null),
                    place.googlePlace().paymentOptions().orElse(null)
                ),
                place.videos().stream()
                    .map(Video::from)
                    .toList(),
                place.googlePlace().reviews()
                    .stream()
                    .map(GoogleReview::from)
                    .toList(),
                place.googlePlace().googleMapsUri(),
                place.googlePlace().regularOpeningHours()
                    .map(RegularOpeningHours::weekdayDescriptions)
                    .orElse(List.of()),
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

    @JsonInclude(Include.NON_NULL)
    public record Facility(
        Boolean wheelchairAccessibleSeating,
        Boolean freeParkingLot,
        Boolean paidParkingLot,
        Boolean acceptsCreditCards,
        Boolean acceptsCashOnly
    ) {

        public static Facility of(
            GooglePlaceClientResponse.AccessibilityOptions accessibilityOptions,
            GooglePlaceClientResponse.ParkingOptions parkingOptions,
            GooglePlaceClientResponse.PaymentOptions paymentOptions
        ) {
            return new Facility(
                Optional.ofNullable(accessibilityOptions)
                    .flatMap(AccessibilityOptions::wheelchairAccessibleSeating)
                    .orElse(null),
                Optional.ofNullable(parkingOptions)
                    .flatMap(ParkingOptions::freeParkingLot)
                    .orElse(null),
                Optional.ofNullable(parkingOptions)
                    .flatMap(ParkingOptions::paidParkingLot)
                    .orElse(null),
                Optional.ofNullable(paymentOptions)
                    .flatMap(PaymentOptions::acceptsCreditCards)
                    .orElse(null),
                Optional.ofNullable(paymentOptions)
                    .flatMap(PaymentOptions::acceptsCashOnly)
                    .orElse(null)
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
