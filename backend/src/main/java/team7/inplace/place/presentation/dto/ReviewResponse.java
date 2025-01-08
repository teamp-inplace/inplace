package team7.inplace.place.presentation.dto;

import java.time.LocalDate;
import team7.inplace.review.persistence.dto.ReviewQueryResult;

public class ReviewResponse {
    public record Simple(
            Long reviewId,
            boolean likes,
            String comment,
            String userNickname,
            LocalDate createdDate,
            boolean mine
    ) {
        public static Simple from(ReviewQueryResult.Simple reviewInfo) {
            return new Simple(
                    reviewInfo.reviewId(),
                    reviewInfo.likes(),
                    reviewInfo.comment(),
                    reviewInfo.userNickname(),
                    reviewInfo.createdAt(),
                    reviewInfo.mine()
            );
        }
    }
}
