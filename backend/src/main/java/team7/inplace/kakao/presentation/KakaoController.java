package team7.inplace.kakao.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import team7.inplace.kakao.application.PlaceMessageFacade;

@RestController
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class KakaoController implements KakaoControllerApiSpec {

    private final PlaceMessageFacade placeMessageFacade;

    @GetMapping("/place-message/{placeId}")
    @Override
    public ResponseEntity<Void> sendPlaceMessage(@PathVariable Long placeId) {
        placeMessageFacade.sendPlaceMessage(placeId);

        return ResponseEntity.ok().build();
    }
}
