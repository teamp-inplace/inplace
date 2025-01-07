package team7.inplace.placeMessage.persistence;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import team7.inplace.placeMessage.domain.UserReviewUuid;

public interface UserReviewUuidRepository extends CrudRepository<UserReviewUuid, String> {

    Optional<UserReviewUuid> findByUserIdAndPlaceId(Long userId, Long placeId);
}
