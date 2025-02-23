package team7.inplace.qrcode.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import team7.inplace.qrcode.application.QRCodeFacade;

@RestController
@RequiredArgsConstructor
@RequestMapping("/qrcodes")
public class QRCodeController implements QRCodeControllerApiSpec {

    private final QRCodeFacade qrCodeFacade;

    @Override
    @GetMapping()
    public ResponseEntity<byte[]> getQRCode(
        @RequestParam Long placeId,
        @RequestParam(required = false, defaultValue = "200")
        Integer width,
        @RequestParam(required = false, defaultValue = "200")
        Integer height
    ) {
        var qrCode = qrCodeFacade.getQRCode(placeId, width, height);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        return new ResponseEntity<>(qrCode, headers, HttpStatus.OK);
    }
}
