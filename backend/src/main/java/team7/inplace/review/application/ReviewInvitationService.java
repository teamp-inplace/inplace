package team7.inplace.review.application;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.review.domain.ReviewInvitation;
import team7.inplace.review.persistence.ReviewInvitationRepository;

@Service
@RequiredArgsConstructor
public class ReviewInvitationService {
    private final ReviewInvitationRepository reviewInvitationRepository;

    @Transactional
    public String generateReviewUuid(Long userId, Long placeId) {
        var existInvitationId = reviewInvitationRepository.findUUIDByUserIdAndPlaceId(userId, placeId);
        if (existInvitationId.isPresent()) {
            return existInvitationId.get();
        }

        // uuid 새로 생성
        String newInvitationId = UUID.randomUUID().toString();
        ReviewInvitation newInvitation = new ReviewInvitation(newInvitationId, userId, placeId);
        reviewInvitationRepository.save(newInvitationId, newInvitation);

        return newInvitationId;
    }
}
