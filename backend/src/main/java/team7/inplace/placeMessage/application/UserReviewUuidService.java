package team7.inplace.placeMessage.application;

import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.placeMessage.domain.UserReviewUuid;
import team7.inplace.placeMessage.persistence.UserReviewUuidRepository;

@Service
@RequiredArgsConstructor
public class UserReviewUuidService {

    private final UserReviewUuidRepository userReviewUuidRepository;

    @Transactional
    public String generateReviewUuid(Long userId, Long placeId) {
        Optional<UserReviewUuid> existingUuid = userReviewUuidRepository.findByUserIdAndPlaceId(
            userId, placeId);

        if (existingUuid.isPresent()) {
            return existingUuid.get().getUuid();
        }

        // uuid 새로 생성
        String uuid = UUID.randomUUID().toString();

        UserReviewUuid reviewUuid = new UserReviewUuid(uuid, userId, placeId);
        userReviewUuidRepository.save(reviewUuid);

        return uuid;

    }
}
