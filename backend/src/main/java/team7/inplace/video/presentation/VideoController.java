package team7.inplace.video.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import team7.inplace.video.application.VideoFacade;
import team7.inplace.video.application.VideoService;
import team7.inplace.video.presentation.dto.VideoResponse;
import team7.inplace.video.presentation.dto.VideoSearchParams;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/videos")
public class VideoController implements VideoControllerApiSpec {
    private final VideoService videoService;
    private final VideoFacade videoFacade;

    @PreAuthorize("isAuthenticated()")
    @GetMapping()
    public ResponseEntity<List<VideoResponse>> readVideos(
            @RequestParam(value = "longitude", defaultValue = "128.6") String longitude,
            @RequestParam(value = "latitude", defaultValue = "35.9") String latitude
    ) {
        VideoSearchParams searchParams = VideoSearchParams.from(longitude, latitude);
        List<VideoResponse> videoResponses = videoService.getVideosBySurround(searchParams)
                .stream().map(VideoResponse::from).toList();
        return new ResponseEntity<>(videoResponses, HttpStatus.OK);
    }

    @GetMapping("/new")
    public ResponseEntity<List<VideoResponse>> readByNew() {
        List<VideoResponse> videoResponses = videoService.getAllVideosDesc()
                .stream().map(VideoResponse::from).toList();
        return new ResponseEntity<>(videoResponses, HttpStatus.OK);
    }

    @GetMapping("/cool")
    public ResponseEntity<List<VideoResponse>> readByCool() {
        List<VideoResponse> videoResponses = videoService.getCoolVideo()
                .stream().map(VideoResponse::from).toList();
        return new ResponseEntity<>(videoResponses, HttpStatus.OK);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/my")
    public ResponseEntity<List<VideoResponse>> readByInfluencer() {
        List<VideoResponse> videoResponses = videoFacade.getVideosByMyInfluencer()
                .stream().map(VideoResponse::from).toList();
        return new ResponseEntity<>(videoResponses, HttpStatus.OK);
    }

    @GetMapping("/null")
    public ResponseEntity<Page<VideoResponse>> readPlaceNullVideo(
            @PageableDefault(page = 0, size = 10) Pageable pageable
    ) {
        Page<VideoResponse> videoResponses = videoService.getPlaceNullVideo(pageable)
                .map(VideoResponse::from);
        return new ResponseEntity<>(videoResponses, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long videoId) {
        videoService.deleteVideo(videoId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
