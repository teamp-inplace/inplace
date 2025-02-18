package team7.inplace.admin.banner.presentation;

import team7.inplace.admin.banner.application.dto.BannerInfo;

public class BannerResponse {
    public record Info(
            Long id,
            String imageUrl,
            Boolean isMain,
            Boolean isMobile,
            Long influencerId
    ) {
        public static Info from(BannerInfo.Detail banner) {
            return new Info(banner.id(), banner.imageUrl(), banner.isMain(), banner.isMobile(), banner.influencerId());
        }
    }
}
