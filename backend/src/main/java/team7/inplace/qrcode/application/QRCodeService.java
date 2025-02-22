package team7.inplace.qrcode.application;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.springframework.stereotype.Service;

@Service
public class QRCodeService {

    public byte[] generateQRCode(Long kakaoPlaceId, Integer width, Integer height) {
        String qrCodeData = "http://place.map.kakao.com/" + kakaoPlaceId;

        width = (width == null) ? 200 : width;
        height = (height == null) ? 200 : height;

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix;

        try {
            bitMatrix = qrCodeWriter.encode(qrCodeData, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            return outputStream.toByteArray();
        } catch (IOException | WriterException e) {
            throw new IllegalArgumentException("QR 코드 생성 중 오류가 발생했습니다.", e);
        }
    }
}
