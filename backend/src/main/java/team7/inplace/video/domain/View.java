package team7.inplace.video.domain;

import static lombok.AccessLevel.PROTECTED;

import jakarta.persistence.Embeddable;
import lombok.Getter;

@Embeddable
@Getter(value = PROTECTED)
public class View {
    private Long viewCount;

    private Long viewCountIncrease;

    public View() {
        this.viewCount = -1L;
        this.viewCountIncrease = -1L;
    }

    public void updateViewCount(Long viewCount) {
        if (this.viewCount == -1L) {
            this.viewCount = viewCount;
            this.viewCountIncrease = 0L;
            return;
        }

        this.viewCountIncrease = viewCount - this.viewCount;
        this.viewCount = viewCount;
    }
}
