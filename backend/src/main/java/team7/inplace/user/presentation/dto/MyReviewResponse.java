package team7.inplace.user.presentation.dto;

import java.time.LocalDate;

public record MyReviewResponse(
        Long reviewId,
        boolean likes,
        String comment,
        LocalDate createdDate,
        ReviewPlaceInfo place
) {

    public static MyReviewResponse from(MyReviewInfo reviewInfo) {
        return new MyReviewResponse(
                reviewInfo.reviewId(),
                reviewInfo.likes(),
                reviewInfo.comment(),
                reviewInfo.createdDate(),
                reviewInfo.placeInfo()
        );
    }
}
