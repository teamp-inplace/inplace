package team7.inplace.admin.crawling.presentation.dto;

import team7.inplace.admin.crawling.application.command.PlaceRegistrationCommand;

public record PlaceRegistrationRequest(
    Long videoId,
    Long placeUUID,
    String category
) {

    public PlaceRegistrationCommand toCommand() {
        return new PlaceRegistrationCommand(videoId, placeUUID, category);
    }
}
