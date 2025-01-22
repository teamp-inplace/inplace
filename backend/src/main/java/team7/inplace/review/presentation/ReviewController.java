package team7.inplace.review.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import team7.inplace.review.application.ReviewInvitationService;
import team7.inplace.review.application.ReviewService;
import team7.inplace.review.presentation.dto.ReviewRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reviews")
public class ReviewController implements ReviewControllerApiSpec {

    private final ReviewService reviewService;
    private final ReviewInvitationService reviewInvitationService;

    //    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    @PostMapping("/{uuid}")
    public ResponseEntity<Void> saveReview(
        @PathVariable String uuid,
        @RequestBody ReviewRequest.Save request
    ) {
        reviewInvitationService.saveReview(request.toCommandFrom(uuid));

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
