package team7.inplace.place.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity(name = "places")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    //@Column(columnDefinition = "json")
    private String facility;

    @Column(columnDefinition = "TEXT")
    private String menuImgUrl;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Category category;

    @Embedded
    private Address address;

    @Embedded
    private Coordinate coordinate;

    private LocalDateTime menuUpdatedAt;

    public Place(
            String name, String facility, String menuImgsUrl, String category,
            String address, String x, String y,
            LocalDateTime menuUpdatedAt
    ) {
        this.name = name;
        this.facility = facility;
        this.menuImgUrl = menuImgsUrl;
        this.category = Category.of(category);
        this.address = Address.of(address);
        this.coordinate = Coordinate.of(x, y);
        this.menuUpdatedAt = menuUpdatedAt;
    }
}
