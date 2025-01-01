package team7.inplace.place.domain;

import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "menu_board_photos")
@NoArgsConstructor(access = PROTECTED)
public class MenuBoardPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    private Long placeId;

    private MenuBoardPhoto(String url) {
        this.url = url;
    }

    public static MenuBoardPhoto of(String url) {
        return new MenuBoardPhoto(url);
    }
}
