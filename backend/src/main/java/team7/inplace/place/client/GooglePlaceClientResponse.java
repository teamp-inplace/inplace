package team7.inplace.place.client;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;
import java.time.LocalDateTime;
import java.util.List;

public class GooglePlaceClientResponse {

    public record Place(
        String id,
        double rating,
        RegularOpeningHours regularOpeningHours,
        List<Review> reviews,
        AccessibilityOptions accessibilityOptions,
        ParkingOptions parkingOptions
    ) {

    }

    public record RegularOpeningHours(
        List<String> weekdayDescriptions
    ) {

    }

    public record Review(
        Integer rating,
        TextContent text,
        AuthorAttribution authorAttribution,
        LocalDateTime publishTime
    ) {

    }

    public record TextContent(
        String text
    ) {

    }

    public record AuthorAttribution(
        String displayName
    ) {

    }

    public record AccessibilityOptions(
        @JsonSetter(nulls = Nulls.AS_EMPTY)
        Boolean wheelchairAccessibleParking,

        @JsonSetter(nulls = Nulls.AS_EMPTY)
        Boolean wheelchairAccessibleEntrance,

        @JsonSetter(nulls = Nulls.AS_EMPTY)
        Boolean wheelchairAccessibleRestroom,

        @JsonSetter(nulls = Nulls.AS_EMPTY)
        Boolean wheelchairAccessibleSeating
    ) {

        @Override
        public Boolean wheelchairAccessibleParking() {
            return wheelchairAccessibleParking == null ? false : wheelchairAccessibleParking;
        }

        @Override
        public Boolean wheelchairAccessibleEntrance() {
            return wheelchairAccessibleEntrance == null ? false : wheelchairAccessibleEntrance;
        }

        @Override
        public Boolean wheelchairAccessibleRestroom() {
            return wheelchairAccessibleRestroom == null ? false : wheelchairAccessibleRestroom;
        }

        @Override
        public Boolean wheelchairAccessibleSeating() {
            return wheelchairAccessibleSeating == null ? false : wheelchairAccessibleSeating;
        }
    }

    public record ParkingOptions(

        @JsonSetter(nulls = Nulls.AS_EMPTY)
        Boolean freeParkingLot,

        @JsonSetter(nulls = Nulls.AS_EMPTY)
        Boolean paidParkingLot,

        @JsonSetter(nulls = Nulls.AS_EMPTY)
        Boolean freeStreetParking,

        @JsonSetter(nulls = Nulls.AS_EMPTY)
        Boolean paidStreetParking,

        @JsonSetter(nulls = Nulls.AS_EMPTY)
        Boolean valetParking,

        @JsonSetter(nulls = Nulls.AS_EMPTY)
        Boolean freeGarageParking,

        @JsonSetter(nulls = Nulls.AS_EMPTY)
        Boolean paidGarageParking
    ) {

        @Override
        public Boolean freeParkingLot() {
            return freeParkingLot == null ? false : freeParkingLot;
        }

        @Override
        public Boolean paidParkingLot() {
            return paidParkingLot == null ? false : paidParkingLot;
        }

        @Override
        public Boolean freeStreetParking() {
            return freeStreetParking == null ? false : freeStreetParking;
        }

        @Override
        public Boolean paidStreetParking() {
            return paidStreetParking == null ? false : paidStreetParking;
        }

        @Override
        public Boolean valetParking() {
            return valetParking == null ? false : valetParking;
        }

        @Override
        public Boolean freeGarageParking() {
            return freeGarageParking == null ? false : freeGarageParking;
        }

        @Override
        public Boolean paidGarageParking() {
            return paidGarageParking == null ? false : paidGarageParking;
        }
    }
}
