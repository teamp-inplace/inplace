package team7.inplace.video.presentation;

import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import team7.inplace.video.presentation.dto.VideoResponse;

public interface VideoControllerApiSpec {
    @Operation(
            summary = "내 주변 그곳 ",
            description = "Parameter로 입력받은 위치의 주변 장소 Video를 조회합니다."
    )
    ResponseEntity<List<VideoResponse>> readVideos(
            @RequestParam String longitude,
            @RequestParam String latitude
    );

    @Operation(
            summary = "새로 등록된 그 곳",
            description = "id를 기준으로 내림차순 정렬한 Video 정보를 조회합니다."
    )
    ResponseEntity<List<VideoResponse>> readByNew();

    @Operation(
            summary = "쿨한 그 곳",
            description = "조회수 증가량을 기준으로 내림차순 정렬한 Video 정보를 조회합니다."
    )
    ResponseEntity<List<VideoResponse>> readByCool();

    @Operation(
            summary = "내 인플루언서의 비디오 반환",
            description = "내가 좋아요를 누른 인플루언서의 Video 정보를 조회합니다."
    )
    ResponseEntity<List<VideoResponse>> readByInfluencer();

    @Operation(
            summary = "비디오 삭제",
            description = "비디오를 삭제합니다."
    )
    ResponseEntity<Void> deleteVideo(
            @PathVariable Long videoId
    );
}
