package team7.inplace.influencer.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team7.inplace.influencer.application.InfluencerService;
import team7.inplace.influencer.application.dto.InfluencerCommand;
import team7.inplace.influencer.presentation.dto.InfluencerNameResponse;
import team7.inplace.influencer.presentation.dto.InfluencerRequest;
import team7.inplace.influencer.presentation.dto.InfluencerResponse;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/influencers")
public class InfluencerController implements InfluencerControllerApiSpec {

    private final InfluencerService influencerService;

    @GetMapping()
    public ResponseEntity<Page<InfluencerResponse>> getAllInfluencers(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<InfluencerResponse> influencers = influencerService.getAllInfluencers(pageable)
                .map(InfluencerResponse::from);

        return new ResponseEntity<>(influencers, HttpStatus.OK);
    }

    @GetMapping("/names")
    public ResponseEntity<List<InfluencerNameResponse>> getAllInfluencerNames() {
        List<InfluencerNameResponse> names = influencerService.getAllInfluencerNames().stream()
                .map(InfluencerNameResponse::from)
                .toList();
        return new ResponseEntity<>(names, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Long> createInfluencer(@RequestBody InfluencerRequest request) {
        var command = request.toCommand();
        Long savedId = influencerService.createInfluencer(command);

        return new ResponseEntity<>(savedId, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateInfluencer(
            @PathVariable Long id,
            @RequestBody InfluencerRequest request
    ) {
        InfluencerCommand influencerCommand = request.toCommand();
        Long updatedId = influencerService.updateInfluencer(id, influencerCommand);

        return new ResponseEntity<>(updatedId, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> deleteInfluencer(@PathVariable Long id) {
        influencerService.deleteInfluencer(id);

        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
