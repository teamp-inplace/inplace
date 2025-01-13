package team7.inplace.place.persistence;

import team7.inplace.place.domain.PlaceBulk;

public interface PlaceSaveRepository {

    Long save(PlaceBulk placeBulk);
}
