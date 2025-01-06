package team7.inplace.placeMessage.application;

import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.placeMessage.domain.UserReviewUuid;
import team7.inplace.placeMessage.persistence.UserReviewUuidRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserReviewUuidService {

    private final UserReviewUuidRepository userReviewUuidRepository;

    @Transactional
    public String generateReviewUuid(Long userId, Long placeId) {
        Optional<UserReviewUuid> existingUuid = userReviewUuidRepository.findByUserIdAndPlaceId(
            userId, placeId);

        log.info("Searching for userId: {}, placeId: {}", userId, placeId);
        log.info("Existing UUID found: {}", existingUuid.isPresent());

        if (existingUuid.isPresent()) {
            log.info("found from repo userId: {}, placeId: {}", existingUuid.get().getUserId(),
                existingUuid.get().getPlaceId());
            return existingUuid.get().getUuid();
        }

        // uuid 새로 생성
        String uuid = UUID.randomUUID().toString();

        UserReviewUuid reviewUuid = new UserReviewUuid(uuid, userId, placeId);
        userReviewUuidRepository.save(reviewUuid);

        return uuid;

    }
}
