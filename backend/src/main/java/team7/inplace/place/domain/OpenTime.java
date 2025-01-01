package team7.inplace.place.domain;

import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "open_times")
@NoArgsConstructor(access = PROTECTED)
public class OpenTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String timeName;

    private String timeSE;

    private String dayOfWeek;

    private Long placeId;

    private OpenTime(String timeName, String timeSE, String dayOfWeek) {
        this.timeName = timeName;
        this.timeSE = timeSE;
        this.dayOfWeek = dayOfWeek;
    }

    public static OpenTime of(String openTime) {
        String[] time = openTime.split("\\|");
        return new OpenTime(time[0], time[1], time[2]);
    }
}
