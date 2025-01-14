package team7.inplace.admin.banner.presentation;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import team7.inplace.admin.banner.application.BannerService;

@RestController
@Slf4j
@RequestMapping("/banners")
@RequiredArgsConstructor
public class BannerController {
    private final BannerService bannerService;

    //    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping()
    public void saveBanner(BannerRequest.Create request) {

        bannerService.uploadBanner(request.toCommand());
    }

    @GetMapping()
    public ResponseEntity<List<BannerResponse.Info>> getBanners() {
        var banners = bannerService.getBanners();

        var response = banners.stream()
                .map(BannerResponse.Info::from)
                .toList();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
    }
}
