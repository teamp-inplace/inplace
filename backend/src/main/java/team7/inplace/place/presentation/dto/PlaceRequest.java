package team7.inplace.place.presentation.dto;

public class PlaceRequest {
    public record Like(
            Long placeId,
            Long userId
    ) {
    }
}
