package team7.inplace.admin.crawling.application.command;

public record PlaceRegistrationCommand(
    Long videoId,
    Long placeUUID,
    String category
) {

}
