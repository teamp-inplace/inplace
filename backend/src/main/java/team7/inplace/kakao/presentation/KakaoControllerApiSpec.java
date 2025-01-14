package team7.inplace.kakao.presentation;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Kakao", description = "카카오톡으로 메시지를 보내는 기능을 제공합니다.")
public interface KakaoControllerApiSpec {
    ResponseEntity<Void> sendPlaceMessage(
            @Parameter(description = "메시지를 보낼 장소의 ID", required = true)
            @PathVariable
            Long placeId
    );
}
