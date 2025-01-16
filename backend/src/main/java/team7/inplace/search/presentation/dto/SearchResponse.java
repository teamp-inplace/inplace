package team7.inplace.search.presentation.dto;

import team7.inplace.search.persistence.dto.SearchQueryResult;

public class SearchResponse {
    public record Place(
            Long placeId,
            String placeName,
            String placeImgUrl,
            boolean likes
    ) {
        public static Place from(SearchQueryResult.Place placeInfo) {
            return new Place(
                    placeInfo.id(),
                    placeInfo.name(),
                    placeInfo.imgUrl(),
                    placeInfo.likes()
            );
        }

    }
}
