package team7.inplace.place.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Category {
    CAFE("카페"),
    WESTERN("양식"),
    JAPANESE("일식"),
    KOREAN("한식"),
    RESTAURANT("음식점"),
    CHINESE("중식"),
    CHICKEN("치킨"),
    VIETNAMESE("베트남식"),
    THAI("태국식"),
    INDIAN("인도식"),
    NONE("없음");

    private final String name;

    public static Category of(String name) {
        for (Category category : values()) {
            if (category.name.equalsIgnoreCase(name) || category.name().equalsIgnoreCase(name)) {
                return category;
            }
        }
        return null;
    }
}