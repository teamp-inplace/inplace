package team7.inplace.token.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import team7.inplace.user.domain.User;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OauthToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "access_token")
    private String oauthToken;
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private OauthToken(String oauthToken, Instant expiresAt, User user) {
        this.oauthToken = oauthToken;
        this.expiresAt = LocalDateTime.ofInstant(expiresAt, ZoneId.systemDefault());
        this.user = user;
    }

    public void updateInfo(String oauthToken, Instant expiresAt) {
        this.oauthToken = oauthToken;
        this.expiresAt = LocalDateTime.ofInstant(expiresAt, ZoneId.systemDefault());
    }

    public static OauthToken of(String oauthToken, Instant expiresAt, User user) {
        return new OauthToken(oauthToken, expiresAt, user);
    }
}
