package team7.inplace.place.persistence;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import team7.inplace.place.domain.Menu;
import team7.inplace.place.domain.OffDay;
import team7.inplace.place.domain.OpenTime;
import team7.inplace.place.domain.Place;
import team7.inplace.place.domain.PlaceBulk;

@Repository
@RequiredArgsConstructor
public class PlaceSaveRepositoryImpl implements PlaceSaveRepository {
    private final JdbcTemplate jdbcTemplate;

    @Override
    public Long save(PlaceBulk placeBulk) {
        Place place = placeBulk.getPlace();
        long placeId = savePlace(place);

        List<Menu> menus = placeBulk.getMenus();
        saveMenus(placeId, menus);
        List<OpenTime> openTimes = placeBulk.getOpenTimes();
        saveOpenTimes(placeId, openTimes);
        List<OffDay> offDays = placeBulk.getOffDays();
        saveOffDays(placeId, offDays);

        return placeId;
    }

    private long savePlace(Place place) {
        String sql = """
                INSERT INTO places (
                    name, facility, menu_img_url, category,
                    address1, address2, address3,
                    latitude, longitude,
                    menu_updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, place.getName());
            ps.setString(2, place.getFacility());
            ps.setString(3, place.getMenuImgUrl());
            ps.setString(4, place.getCategory().name());
            ps.setString(5, place.getAddress().getAddress1());
            ps.setString(6, place.getAddress().getAddress2());
            ps.setString(7, place.getAddress().getAddress3());
            ps.setString(8, place.getCoordinate().getLatitude());
            ps.setString(9, place.getCoordinate().getLongitude());
            ps.setTimestamp(10, Timestamp.valueOf(place.getMenuUpdatedAt()));
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    private void saveMenus(long placeId, List<Menu> menus) {
        String sql = """
                INSERT INTO menus (price, recommend, menu_name, menu_img_url, description, place_id)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Menu menu = menus.get(i);
                ps.setString(1, menu.getPrice());
                ps.setBoolean(2, menu.isRecommend());
                ps.setString(3, menu.getMenuName());
                ps.setString(4, menu.getMenuImgUrl());
                ps.setString(5, menu.getDescription());
                ps.setLong(6, placeId);
            }

            @Override
            public int getBatchSize() {
                return menus.size();
            }
        });
    }

    private void saveOpenTimes(long placeId, List<OpenTime> openTimes) {
        String sql = """
                INSERT INTO open_times (
                    time_name, timese, day_of_week, place_id
                ) VALUES (?, ?, ?, ?)
                """;

        jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                OpenTime openTime = openTimes.get(i);
                ps.setString(1, openTime.getTimeName());
                ps.setString(2, openTime.getTimeSE());
                ps.setString(3, openTime.getDayOfWeek());
                ps.setLong(4, placeId);
            }

            @Override
            public int getBatchSize() {
                return openTimes.size();
            }
        });
    }

    private void saveOffDays(long placeId, List<OffDay> offDays) {
        String sql = """
                INSERT INTO off_days (
                    holiday_name, week_and_day, temporary_holidays, place_id
                ) VALUES (?, ?, ?, ?)
                """;

        jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                OffDay offDay = offDays.get(i);
                ps.setString(1, offDay.getHolidayName());
                ps.setString(2, offDay.getWeekAndDay());
                ps.setString(3, offDay.getTemporaryHolidays());
                ps.setLong(4, placeId);
            }

            @Override
            public int getBatchSize() {
                return offDays.size();
            }
        });
    }
}
