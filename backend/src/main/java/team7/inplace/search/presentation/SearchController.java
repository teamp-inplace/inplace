package team7.inplace.search.presentation;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import team7.inplace.influencer.presentation.dto.InfluencerResponse.Info;
import team7.inplace.place.presentation.dto.PlacesResponse;
import team7.inplace.search.application.SearchService;
import team7.inplace.search.application.dto.AutoCompletionInfo;
import team7.inplace.video.presentation.dto.VideoResponse.Simple;


//TODO: 곧 업데이트 예정입니다.
@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController implements SearchControllerApiSpec {
    private final SearchService searchService;

    @Override
    public ResponseEntity<List<AutoCompletionInfo>> searchKeywords(String value) {
        return null;
    }

    @Override
    public ResponseEntity<List<Simple>> searchVideo(String value) {
        return null;
    }

    @Override
    public ResponseEntity<List<Info>> searchInfluencer(String value) {
        return null;
    }

    @Override
    public ResponseEntity<List<PlacesResponse.Simple>> searchPlace(String value) {
        return null;
    }

    @Override
    public ResponseEntity<Page<Info>> searchInfluencer(String value, Pageable pageable) {
        return null;
    }

//    @Override
//    @GetMapping("/complete")
//    public ResponseEntity<List<AutoCompletionInfo>> searchKeywords(@RequestParam String value) {
//        var response = searchService.searchAutoCompletions(value);
//
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    @Override
//    @GetMapping("/video")
//    public ResponseEntity<List<VideoResponse.Simple>> searchVideo(@RequestParam String value) {
//        var videos = searchService.searchVideo(value);
//
//        var response = videos.stream()
//                .map(VideoResponse.Simple::from)
//                .toList();
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    @Override
//    @GetMapping("/influencer")
//    public ResponseEntity<List<InfluencerResponse>> searchInfluencer(@RequestParam String value) {
//        var influencers = searchService.searchInfluencer(value);
//
//        var response = influencers.stream()
//                .map(InfluencerResponse.Info::from)
//                .toList();
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    @Override
//    @GetMapping("/page/influencer")
//    public ResponseEntity<Page<InfluencerResponse>> searchInfluencer(
//            @RequestParam String value,
//            @PageableDefault(size = 10) Pageable pageable
//    ) {
//        Page<InfluencerInfo> influencers = searchService.searchInfluencer(value, pageable);
//
//        Page<InfluencerResponse> response = influencers.map(InfluencerResponse::from);
//
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    @Override
//    @GetMapping("/place")
//    public ResponseEntity<List<PlaceSearchInfo>> searchPlace(@RequestParam String value) {
//        var places = searchService.searchPlace(value);
//
//        return new ResponseEntity<>(places, HttpStatus.OK);
//    }
}
