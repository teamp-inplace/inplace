package team7.inplace.review.application.dto;

import java.time.LocalDate;
import team7.inplace.review.domain.Review;

public class ReviewInfo {
    public record Detail(
            Long id,
            boolean likes,
            String comment,
            Long userId,
            LocalDate createdDate,
            boolean mine
    ) {
        public static ReviewInfo.Detail from(Review review, boolean isMine) {
            return new ReviewInfo.Detail(
                    review.getId(),
                    review.getIsLiked(),
                    review.getComment(),
                    review.getUserId(),
                    review.getCreatedDate(),
                    isMine
            );
        }
    }
}