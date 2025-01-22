package team7.inplace.review.presentation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import team7.inplace.review.presentation.dto.ReviewRequest;

public interface ReviewControllerApiSpec {

    @Operation(summary = "리뷰 삭제", description = "본인이 작성한 리뷰를 삭제합니다.")
    ResponseEntity<Void> deleteReview(@PathVariable Long id);

    @Operation(summary = "리뷰 작성", description = "장소에 대한 리뷰를 작성합니다.")
    ResponseEntity<Void> saveReview(
        @PathVariable String uuid,
        @RequestBody ReviewRequest.Save request
    );
}
