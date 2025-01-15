package team7.inplace.admin.crawling.client;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
public class YoutubeClient {
    private static final String VIDEO_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
    private static final String VIDEO_SEARCH_PARAMS = "?part=snippet&channelId=%s&maxResults=50&key=%s&order=date&type=video";
    private static final String VIDEO_DETAIL_URL = "https://www.googleapis.com/youtube/v3/videos";
    private static final String VIDEO_DETAIL_PARAMS = "?part=statistics&id=%s&key=%s";
    private final RestTemplate restTemplate;
    private final String apiKey;

    public YoutubeClient(@Value("${youtube.api.key}") String apiKey, RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }

    public JsonNode getVideoDetail(String videoId) {
        String url = VIDEO_DETAIL_URL + String.format(VIDEO_DETAIL_PARAMS, videoId, apiKey);

        JsonNode response = null;
        try {
            response = restTemplate.getForObject(url, JsonNode.class);
        } catch (Exception e) {
            log.error("Youtube API 호출이 실패했습니다. Video Id {}", videoId);
        }

        log.info(response.toPrettyString());

        return response;
    }

    public List<JsonNode> getVideos(String chanelId, String finalVideoUUID) {
        List<JsonNode> videoItems = new ArrayList<>();
        String nextPageToken = null;
        while (true) {
            String url = VIDEO_SEARCH_URL + String.format(VIDEO_SEARCH_PARAMS, chanelId, apiKey);

            JsonNode response = null;
            if (Objects.nonNull(nextPageToken)) {
                url += "&pageToken=" + nextPageToken;
            }
            try {
                response = restTemplate.getForObject(url, JsonNode.class);
            } catch (Exception e) {
                log.error("Youtube API 호출이 실패했습니다. Youtuber Id {}", chanelId);
                break;
            }
            if (Objects.isNull(response)) {
                log.error("Youtube API Response가 NULL입니다 {}.", chanelId);
                break;
            }

            var containsLastVideo = extractSnippets(videoItems, response.path("items"), finalVideoUUID);
            if (containsLastVideo) {
                break;
            }
            nextPageToken = response.path("nextPageToken").asText();
            if (isLastPage(nextPageToken)) {
                break;
            }
        }
        return videoItems;
    }

    private boolean isLastPage(String nextPageToken) {
        return Objects.isNull(nextPageToken) || nextPageToken.isEmpty();
    }

    private boolean extractSnippets(List<JsonNode> videoItems, JsonNode items, String finalVideoUUID) {

        for (JsonNode item : items) {
            if (!item.get("id").has("videoId")) {
                continue;
            }
            var videoId = item.get("id").get("videoId").asText();

            if (videoId.equals(finalVideoUUID)) {
                return true;
            }
            videoItems.add(item);
        }
        return false;
    }
}
