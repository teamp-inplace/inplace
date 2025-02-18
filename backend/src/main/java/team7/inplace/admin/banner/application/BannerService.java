package team7.inplace.admin.banner.application;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import team7.inplace.admin.banner.application.command.BannerCommand.Create;
import team7.inplace.admin.banner.application.dto.BannerInfo;
import team7.inplace.admin.banner.application.dto.BannerInfo.Detail;
import team7.inplace.admin.banner.persistence.BannerRepository;
import team7.inplace.admin.banner.persistence.BannerS3Repository;
import team7.inplace.global.exception.InplaceException;
import team7.inplace.global.exception.code.BannerErrorCode;
import team7.inplace.influencer.persistence.InfluencerRepository;

@Service
@RequiredArgsConstructor
public class BannerService {
    private final BannerS3Repository bannerS3Repository;
    private final BannerRepository bannerRepository;
    private final InfluencerRepository influencerRepository;

    public void uploadBanner(Create command) {
        var imgPath = bannerS3Repository.uploadBanner(command.imageFile());
        Long influencerId = null;
        if (!command.isMain()) {
            influencerId = influencerRepository.findIdByName(command.imgName())
                .orElseThrow(() -> InplaceException.of(BannerErrorCode.INFLUENCER_NOT_FOUND));
        }
        var banner = command.toEntity(imgPath, influencerId);
        bannerRepository.save(banner);
    }

    public List<Detail> getBanners() {
        var now = LocalDateTime.now();
        var banners = bannerRepository.findActiveBanner(now);

        return banners.stream()
                .sorted((a, b) -> Boolean.compare(b.getIsFixed(), a.getIsFixed()))
                .map(BannerInfo.Detail::from)
                .toList();
    }

    public void deleteBanner(Long id) {
        var banner = bannerRepository.findById(id)
                .orElseThrow(() -> InplaceException.of(BannerErrorCode.NOT_FOUND));
        bannerS3Repository.deleteBanner(banner.getImgPath());
        bannerRepository.delete(banner);
    }
}
