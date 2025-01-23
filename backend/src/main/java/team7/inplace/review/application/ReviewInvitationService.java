package team7.inplace.review.application;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.ReviewErrorCode;
import team7.inplace.review.application.dto.ReviewCommand;
import team7.inplace.review.domain.ReviewInvitation;
import team7.inplace.review.persistence.ReviewInvitationRepository;
import team7.inplace.review.persistence.ReviewJPARepository;

@Service
@RequiredArgsConstructor
public class ReviewInvitationService {

    private final ReviewInvitationRepository reviewInvitationRepository;
    private final ReviewJPARepository reviewJPARepository;

    @Transactional
    public String generateReviewUuid(Long userId, Long placeId) {
        var existInvitationId = reviewInvitationRepository.findUUIDByUserIdAndPlaceId(userId,
            placeId);
        if (existInvitationId.isPresent()) {
            return existInvitationId.get();
        }

        // uuid 새로 생성
        String newInvitationId = UUID.randomUUID().toString();
        ReviewInvitation newInvitation = new ReviewInvitation(newInvitationId, userId, placeId);
        reviewInvitationRepository.save(newInvitationId, newInvitation);

        return newInvitationId;
    }

    @Transactional
    public void saveReview(ReviewCommand.create command) {
        var reviewInvitation = reviewInvitationRepository.get(command.uuid())
            .orElseThrow(() -> InplaceException.of(ReviewErrorCode.INVALID_UUID));

        var review = command.toEntityFrom(reviewInvitation.getUserId(),
            reviewInvitation.getPlaceId());
        reviewJPARepository.save(review);
        reviewInvitationRepository.delete(command.uuid());
    }
}
