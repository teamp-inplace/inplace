package team7.inplace.review.presentation.dto;

import team7.inplace.review.application.dto.ReviewCommand;

public class ReviewRequest {

    public record Save(
        Boolean likes,
        String comments
    ) {

        public ReviewCommand.create toCommandFrom(String uuid) {
            return new ReviewCommand.create(uuid, likes, comments);
        }
    }
}
