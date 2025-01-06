package team7.inplace.place.domain;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class PlaceBulk {
    private Place place;
    private List<Menu> menus;
    private List<OpenTime> openTimes;
    private List<OffDay> offDays;
    private List<MenuBoardPhoto> menuBoardPhotos;


    public PlaceBulk(
            String name, String facility, String menuImgsUrl, String category,
            String address, String x, String y,
            List<String> offDays,
            List<String> openPeriods,
            List<String> menus,
            LocalDateTime menuUpdatedAt,
            List<String> menuboardphotourlList
    ) {
        this.place = new Place(name, facility, menuImgsUrl, category, address, x, y, menuUpdatedAt);

        this.offDays = offDays.stream()
                .map(OffDay::of)
                .toList();
        this.openTimes = openPeriods.stream()
                .map(OpenTime::of)
                .toList();
        this.menus = menus.stream()
                .map(Menu::of)
                .toList();
        this.menuBoardPhotos = menuboardphotourlList.stream()
                .map(MenuBoardPhoto::of)
                .toList();
    }
}
