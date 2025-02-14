package team7.inplace.kakao.application;

import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import team7.inplace.global.properties.KakaoApiProperties;
import team7.inplace.kakao.application.command.PlaceMessageCommand;
import team7.inplace.kakao.domain.MessageSendHistory;
import team7.inplace.kakao.persistence.MessageSendHistoryRepository;
import team7.inplace.place.util.KakaoMessageMaker;

@Service
@RequiredArgsConstructor
public class KakaoMessageService {

    private final MessageSendHistoryRepository messageSendHistoryRepository;
    private final KakaoApiProperties kakaoApiProperties;
    private final KakaoMessageMaker kakaoMessageMaker;
    private final WebClient webClient;

    public void sendLocationMessageToMe(
        Long userId,
        String oauthToken,
        PlaceMessageCommand placeMessageCommand
    ) {
        var messageSendHistory = messageSendHistoryRepository.get(userId.toString())
            .orElse(MessageSendHistory.of(userId));
        messageSendHistory.sendMessage();
        messageSendHistoryRepository.save(userId.toString(), messageSendHistory);

        webClient.post()
            .uri(URI.create(kakaoApiProperties.sendMessageToMeUrl()))
            .header("Content-Type", MediaType.APPLICATION_FORM_URLENCODED_VALUE)
            .header("Authorization", "Bearer " + oauthToken)
            .body(BodyInserters.fromFormData(
                kakaoMessageMaker.createLocationTemplate(placeMessageCommand)))
            .retrieve()
            .bodyToMono(String.class)
            .subscribe();
    }

    public void sendFeedMessageToMe(
        String oauthToken,
        PlaceMessageCommand placeMessageCommand,
        String uuid
    ) {
        webClient.post()
            .uri(URI.create(kakaoApiProperties.sendMessageToMeUrl()))
            .header("Content-Type", MediaType.APPLICATION_FORM_URLENCODED_VALUE)
            .header("Authorization", "Bearer " + oauthToken)
            .body(BodyInserters.fromFormData(
                kakaoMessageMaker.createFeedTemplate(placeMessageCommand, uuid)))
            .retrieve()
            .bodyToMono(String.class)
            .subscribe();
    }
}
