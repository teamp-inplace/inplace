package team7.inplace.admin.banner.presentation;

import java.time.LocalDate;
import org.springframework.web.multipart.MultipartFile;
import team7.inplace.admin.banner.application.command.BannerCommand;

public class BannerRequest {
    public record Create(
            String imageName,
            MultipartFile imageFile,
            LocalDate startDate,
            LocalDate endDate,
            Boolean isFixed,
            Boolean isMain,
            Boolean isMobile
    ) {
        public BannerCommand.Create toCommand() {
            return new BannerCommand.Create(
                    imageName,
                    imageFile,
                    startDate.atStartOfDay(),
                    endDate.atStartOfDay(),
                    isFixed,
                    isMain,
                    isMobile
            );
        }
    }
}
