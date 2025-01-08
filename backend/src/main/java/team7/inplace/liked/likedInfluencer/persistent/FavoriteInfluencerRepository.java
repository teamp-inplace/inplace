package team7.inplace.liked.likedInfluencer.persistent;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import team7.inplace.liked.likedInfluencer.domain.FavoriteInfluencer;

public interface FavoriteInfluencerRepository extends JpaRepository<FavoriteInfluencer, Long> {

    List<FavoriteInfluencer> findByUserId(Long userId);

    Page<FavoriteInfluencer> findByUserIdAndIsLikedTrue(Long userId, Pageable pageable);

    Optional<FavoriteInfluencer> findByUserIdAndInfluencerId(Long userId, Long influencerId);

    @Query("SELECT f.influencerId FROM FavoriteInfluencer f WHERE f.userId = :userId AND f.isLiked = true")
    Set<Long> findLikedInfluencerIdsByUserId(@Param("userId") Long userId);
}
