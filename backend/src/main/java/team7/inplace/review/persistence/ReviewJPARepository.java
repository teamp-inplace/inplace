package team7.inplace.review.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import team7.inplace.review.domain.Review;
import team7.inplace.review.persistence.dto.ReviewQueryResult.LikeRate;

public interface ReviewJPARepository extends JpaRepository<Review, Long> {

    boolean existsByUserIdAndPlaceId(Long userId, Long placeId);

    Page<Review> findByPlaceId(Long placeId, Pageable pageable);

    Page<Review> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT new team7.inplace.review.persistence.dto.ReviewQueryResult.LikeRate( " +  // $ 사용
            "count(CASE WHEN r.isLiked = true THEN 1 END), " +
            "count(CASE WHEN r.isLiked = false THEN 1 END)) " +
            "FROM Review r " +
            "WHERE r.placeId = :placeId")
    LikeRate countRateByPlaceId(@Param("placeId") Long placeId);
}
