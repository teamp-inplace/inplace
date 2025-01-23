package team7.inplace.review.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import team7.inplace.review.domain.Review;
import team7.inplace.review.persistence.dto.ReviewQueryResult.LikeRate;

public interface ReviewJPARepository extends JpaRepository<Review, Long> {

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END " +
        "FROM Review r WHERE r.userId = :userId AND r.placeId = :placeId AND r.deleteAt IS NULL")
    boolean existsByUserIdAndPlaceId(Long userId, Long placeId);

    @Query("SELECT r FROM Review r WHERE r.placeId = :placeId AND r.deleteAt IS NULL")
    Page<Review> findByPlaceId(Long placeId, Pageable pageable);

    @Query("SELECT r FROM Review r WHERE r.userId = :userId AND r.deleteAt IS NULL")
    Page<Review> findByUserId(Long userId, Pageable pageable);

    @Query("SELECT new team7.inplace.review.persistence.dto.ReviewQueryResult$LikeRate( " +  // $ 사용
        "count(CASE WHEN r.isLiked = true THEN 1 END), " +
        "count(CASE WHEN r.isLiked = false THEN 1 END)) " +
        "FROM Review r " +
        "WHERE r.placeId = :placeId AND r.deleteAt IS NULL")
    LikeRate countRateByPlaceId(@Param("placeId") Long placeId);
}
