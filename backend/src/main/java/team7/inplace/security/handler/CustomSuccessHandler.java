package team7.inplace.security.handler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import team7.inplace.security.application.dto.CustomOAuth2User;
import team7.inplace.security.application.dto.CustomUserDetails;
import team7.inplace.security.filter.TokenType;
import team7.inplace.security.util.CookieUtil;
import team7.inplace.security.util.JwtUtil;
import team7.inplace.token.application.RefreshTokenService;

@Slf4j
public class CustomSuccessHandler implements AuthenticationSuccessHandler {

    private static final String IS_FIRST_USER = "is_first_user";
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @Value("${spring.redirect.front-end-url}")
    private String frontEndUrl;

    @Value("${spring.application.domain}")
    private String domain;

    public CustomSuccessHandler(
        JwtUtil jwtUtil,
        RefreshTokenService refreshTokenService
    ) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException {
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomOAuth2User customOAuth2User) {
            String accessToken = jwtUtil.createAccessToken(customOAuth2User.username(),
                customOAuth2User.id(), customOAuth2User.roles());
            String refreshToken = jwtUtil.createRefreshToken(customOAuth2User.username(),
                customOAuth2User.id(), customOAuth2User.roles());
            refreshTokenService.saveRefreshToken(customOAuth2User.username(), refreshToken);
            setCookie(response, accessToken);
            setCookie(response, refreshToken);
            setFirstUserToResponse(response, customOAuth2User.isFirstUser());
            if (customOAuth2User.isFirstUser()) {
                response.sendRedirect(frontEndUrl + "/choice");
                return;
            }
            response.sendRedirect(frontEndUrl + "/auth");
            return;
        }
        CustomUserDetails customUserDetails = (CustomUserDetails) principal;
        String accessToken = jwtUtil.createAccessToken(customUserDetails.username(),
            customUserDetails.id(), customUserDetails.roles());
        setCookie(response, accessToken);
        response.sendRedirect("/admin/main");
    }

    private void setFirstUserToResponse(HttpServletResponse response, boolean isFirstUser) {
        if (isFirstUser) {
            response.addHeader(HttpHeaders.SET_COOKIE,
                CookieUtil.createCookie(IS_FIRST_USER, "true", domain).toString());
            return;
        }
        response.addHeader(HttpHeaders.SET_COOKIE, CookieUtil.createCookie(IS_FIRST_USER, "false", domain).toString());
    }

    private void setCookie(
        HttpServletResponse response, String cookieValue
    ) {
        ResponseCookie cookie = CookieUtil.createHttpOnlyCookie(TokenType.REFRESH_TOKEN.getValue(), cookieValue,
            domain);
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
