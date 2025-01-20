package team7.inplace.security.handler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.antlr.v4.runtime.Token;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import team7.inplace.security.application.dto.CustomOAuth2User;
import team7.inplace.security.application.dto.CustomUserDetails;
import team7.inplace.security.filter.TokenType;
import team7.inplace.security.util.CookieUtil;
import team7.inplace.security.util.JwtUtil;
import team7.inplace.token.application.RefreshTokenService;

@Slf4j
public class CustomSuccessHandler implements AuthenticationSuccessHandler {

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
            addAccessTokenToResponse(response, accessToken);
            addRefreshTokenToResponse(response, refreshToken);
            if (customOAuth2User.isFirstUser()) response.sendRedirect(frontEndUrl + "/choice");
            else response.sendRedirect(frontEndUrl + "/auth");
            return;
        }
        CustomUserDetails customUserDetails = (CustomUserDetails) principal;
        String accessToken = jwtUtil.createAccessToken(customUserDetails.username(),
            customUserDetails.id(), customUserDetails.roles());
        addAccessTokenToResponse(response, accessToken);
        response.sendRedirect("/admin/main");
    }

    private void addAccessTokenToResponse(
        HttpServletResponse response, String accessToken
    ) {
        ResponseCookie accessTokenCookie = CookieUtil.createCookie(TokenType.ACCESS_TOKEN.getValue(), accessToken, domain);
        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
    }

    private void addRefreshTokenToResponse(
        HttpServletResponse response, String refreshToken
    ) {
        ResponseCookie refreshTokenCookie = CookieUtil.createCookie(TokenType.REFRESH_TOKEN.getValue(), refreshToken, domain);
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
    }
}
