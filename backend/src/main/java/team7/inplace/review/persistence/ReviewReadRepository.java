package team7.inplace.review.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import team7.inplace.review.persistence.dto.ReviewQueryResult;

public interface ReviewReadRepository {
    Page<ReviewQueryResult.Detail> findDetailedReviewByUserId(Long userId, Pageable pageable);

    Page<ReviewQueryResult.Simple> findSimpleReviewByUserIdAndPlaceId(Long placeId, Long userId, Pageable pageable);

    ReviewQueryResult.LikeRate countRateByPlaceId(Long placeId);
}