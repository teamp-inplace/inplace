package team7.inplace.liked.likedPlace.persistence;

import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import team7.inplace.liked.likedPlace.domain.LikedPlace;

public interface LikedPlaceRepository extends JpaRepository<LikedPlace, Long> {

    @Query("SELECT lp FROM LikedPlace lp WHERE lp.userId = :userId AND lp.placeId = :placeId AND lp.deleteAt IS NULL")
    Optional<LikedPlace> findByUserIdAndPlaceId(Long userId, Long placeId);

    @Query("SELECT lp.placeId FROM LikedPlace lp WHERE lp.userId = :userId AND lp.isLiked = true AND lp.deleteAt IS NULL")
    Set<Long> findPlaceIdsByUserIdAndIsLikedTrue(@Param("userId") Long userId);

    @Query("SELECT lp FROM LikedPlace lp JOIN FETCH lp.placeId " +
        "WHERE lp.userId = :userId AND lp.isLiked = true AND lp.deleteAt IS NULL")
    Page<LikedPlace> findByUserIdAndIsLikedTrueWithPlace(
        @Param("userId") Long userId,
        Pageable pageable
    );

}
