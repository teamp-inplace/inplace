package team7.inplace.kakao.presentation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import team7.inplace.global.exception.code.KakaoMessageErrorCode;
import team7.inplace.kakao.application.PlaceMessageFacade;

@RestController
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
@Slf4j
public class KakaoController implements KakaoControllerApiSpec {

    private final PlaceMessageFacade placeMessageFacade;

    @GetMapping("/place-message/{placeId}")
    @Override
    public Mono<ResponseEntity<Void>> sendPlaceMessage(@PathVariable Long placeId) {
        return placeMessageFacade.sendPlaceMessage(placeId)
            .thenReturn(ResponseEntity.ok().<Void>build())
            .onErrorReturn(ResponseEntity.status(KakaoMessageErrorCode.MESSAGE_AUTHORIZATION_FALSE.httpStatus()).build());
    }

}
