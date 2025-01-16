package team7.inplace.search.persistence.dto;

import com.querydsl.core.annotations.QueryProjection;

public class SearchQueryResult {
    public record AutoComplete(
            String keyword,
            String type,
            Double score
    ) {
        @QueryProjection
        public AutoComplete {
        }
    }

    public record Place(
            Long id,
            String name,
            String imgUrl,
            boolean likes
    ) {
        @QueryProjection
        public Place {
        }
    }
}
