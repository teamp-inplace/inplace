package team7.inplace.placeMessage.application;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.UserErrorCode;
import team7.inplace.placeMessage.domain.UserReviewLink;
import team7.inplace.placeMessage.persistence.UserReviewLinkRepository;
import team7.inplace.user.domain.User;
import team7.inplace.user.persistence.UserRepository;

@Service
@RequiredArgsConstructor
public class UserReviewLinkService {

    private final UserReviewLinkRepository userReviewLinkRepository;
    private final UserRepository userRepository;

    @Transactional
    public String generateReviewUUID(Long userId, Long placeId) {
        String uuid = UUID.randomUUID().toString();

        // 유효 기간 설정 (예: 10분)
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> InplaceException.of(UserErrorCode.NOT_FOUND));
        ;

        UserReviewLink reviewLink = new UserReviewLink(user, placeId, uuid, expiresAt);
        userReviewLinkRepository.save(reviewLink);

        return uuid;
    }

//    @Transactional(readOnly = true)
//    public UserReviewLink validateUuid(String uuid) {
//        return userReviewLinkRepository.findByUuid(uuid)
//            .filter(link -> link.getExpiresAt().isAfter(LocalDateTime.now())) // 만료 검증
//            .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 링크입니다."));
//    }
}
