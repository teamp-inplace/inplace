package team7.inplace.place.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "off_days")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OffDay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String holidayName;

    private String weekAndDay;

    private String temporaryHolidays;

    @Column(nullable = false)
    private Long placeId;

    private OffDay(String holidayName, String weekAndDay, String temporaryHolidays) {
        this.holidayName = holidayName;
        this.weekAndDay = weekAndDay;
        this.temporaryHolidays = temporaryHolidays;
    }

    public static OffDay of(String offDay) {
        String[] offDayArray = offDay.split("\\|");
        return new OffDay(offDayArray[0], offDayArray[1], offDayArray[2]);
    }
}
