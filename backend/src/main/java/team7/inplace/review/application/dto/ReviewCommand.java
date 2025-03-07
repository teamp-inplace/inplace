package team7.inplace.review.application.dto;

import team7.inplace.review.domain.Review;

public class ReviewCommand {

    public record create(
        String uuid,
        boolean likes,
        String comments
    ) {

        public Review toEntityFrom(Long userId, Long placeId) {
            return new Review(
                userId,
                placeId,
                likes,
                comments
            );
        }
    }

}
