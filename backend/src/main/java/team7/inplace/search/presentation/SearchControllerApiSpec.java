package team7.inplace.search.presentation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import team7.inplace.influencer.presentation.dto.InfluencerResponse;
import team7.inplace.place.presentation.dto.PlacesResponse;
import team7.inplace.search.application.dto.AutoCompletionInfo;
import team7.inplace.video.presentation.dto.VideoResponse;

@Tag(name = "검색 API입니다.")
public interface SearchControllerApiSpec {

    @Operation(summary = "추천 검색어를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "검색어 조회 성공")
    ResponseEntity<List<AutoCompletionInfo>> searchKeywords(String value);

    @Operation(summary = "비디오를 검색합니다.")
    @ApiResponse(responseCode = "200", description = "비디오 검색 성공")
    ResponseEntity<List<VideoResponse.Simple>> searchVideo(String value);

    @Operation(summary = "인플루언서를 검색합니다.")
    @ApiResponse(responseCode = "200", description = "인플루언서 검색 성공")
    ResponseEntity<List<InfluencerResponse.Info>> searchInfluencer(String value);

    @Operation(summary = "장소를 검색합니다.")
    @ApiResponse(responseCode = "200", description = "장소 검색 성공")
    ResponseEntity<List<PlacesResponse.Simple>> searchPlace(String value);

    @Operation(summary = "인플루언서를 페이지로 조회합니다.")
    @ApiResponse(responseCode = "200", description = "인플루언서 페이지 조회 성공")
    ResponseEntity<Page<InfluencerResponse.Info>> searchInfluencer(String value, @PageableDefault Pageable pageable);
}
