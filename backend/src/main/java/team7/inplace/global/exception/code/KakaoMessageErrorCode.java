package team7.inplace.global.exception.code;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@RequiredArgsConstructor
public enum KakaoMessageErrorCode implements ErrorCode {
    MESSAGE_SEND_COUNT_EXCEEDED(HttpStatus.BAD_REQUEST, "K001", "하루 최대 메시지 전송 횟수를 초과하였습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public HttpStatus httpStatus() {
        return httpStatus;
    }

    @Override
    public String code() {
        return code;
    }

    @Override
    public String message() {
        return message;
    }
}
