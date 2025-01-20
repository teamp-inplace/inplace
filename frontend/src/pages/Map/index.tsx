import { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import DropdownMenu from '@/components/Map/DropdownMenu';
import MapWindow from '@/components/Map/MapWindow';
import PlaceSection from '@/components/Map/PlaceSection';
import ToggleButton from '@/components/Map/ToggleButton';
import Chip from '@/components/common/Chip';
import { Text } from '@/components/common/typography/Text';
import locationOptions from '@/utils/constants/LocationOptions';
import { LocationData } from '@/types';
import useGetDropdownName from '@/api/hooks/useGetDropdownName';

type SelectedOption = {
  main: string;
  sub?: string;
  lat?: number;
  lng?: number;
};

export default function MapPage() {
  const { data: influencerOptions } = useGetDropdownName();

  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<SelectedOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [mapBounds, setMapBounds] = useState<LocationData>({
    topLeftLatitude: 0,
    topLeftLongitude: 0,
    bottomRightLatitude: 0,
    bottomRightLongitude: 0,
  });
  const [shouldFetchPlaces, setShouldFetchPlaces] = useState(false);

  const filters = useMemo(
    () => ({
      categories: selectedCategories,
      influencers: selectedInfluencers,
      location: selectedLocations,
    }),
    [selectedCategories, selectedInfluencers, selectedLocations],
  );

  const handleInfluencerChange = useCallback((value: { main: string }) => {
    setSelectedInfluencers((prev) => {
      // 이미 선택된 인플루언서인 경우 추가하지 않음
      if (prev.includes(value.main)) return prev;
      return [...prev, value.main];
    });
    setShouldFetchPlaces(true);
  }, []);

  const handleLocationChange = useCallback((value: SelectedOption) => {
    setSelectedLocations((prev) => {
      // 중복 생성 방지
      const isDuplicate = prev.some((loc) => loc.main === value.main && loc.sub === value.sub);
      if (isDuplicate) return prev;

      if (value.sub === '전체' || !value.sub) {
        const hasAll = prev.some((loc) => loc.main === value.main && loc.sub === '전체');
        if (hasAll) return prev;
        return [...prev, value];
      }

      if (value.sub) {
        return [...prev, value];
      }
      return prev;
    });

    if (value.lat && value.lng) {
      setCenter({ lat: value.lat, lng: value.lng });
    }
    setShouldFetchPlaces(true);
  }, []);

  const handleCategorySelect = useCallback((selected: string[]) => {
    setSelectedCategories(selected);
    setShouldFetchPlaces(true);
  }, []);

  const handleBoundsChange = useCallback((bounds: LocationData) => {
    setMapBounds(bounds);
  }, []);

  const handleCenterChange = useCallback((newCenter: { lat: number; lng: number }) => {
    setCenter(newCenter);
  }, []);

  const handleShouldFetch = useCallback((value: boolean) => {
    setShouldFetchPlaces(value);
  }, []);

  const handleClearLocation = useCallback((locationToRemove: SelectedOption) => {
    setSelectedLocations((prev) =>
      prev.filter((location) => !(location.main === locationToRemove.main && location.sub === locationToRemove.sub)),
    );
    setShouldFetchPlaces(true);
  }, []);

  const handleClearInfluencer = useCallback((influencerToRemove: string) => {
    setSelectedInfluencers((prev) => prev.filter((influencer) => influencer !== influencerToRemove));
    setShouldFetchPlaces(true);
  }, []);

  return (
    <PageContainer>
      <Text size="l" weight="bold" variant="white">
        지도
      </Text>
      <DropdownContainer>
        <DropdownMenu
          options={locationOptions}
          multiLevel
          onChange={handleLocationChange}
          placeholder="위치"
          type="location"
        />
        <DropdownMenu
          options={influencerOptions}
          onChange={handleInfluencerChange}
          placeholder="인플루언서"
          type="influencer"
          defaultValue={undefined}
        />
      </DropdownContainer>
      <ToggleButton options={['CAFE', 'JAPANESE', 'KOREAN', 'RESTAURANT', 'WESTERN']} onSelect={handleCategorySelect} />
      <Chip
        selectedLocations={selectedLocations}
        selectedInfluencers={selectedInfluencers}
        onClearLocation={handleClearLocation}
        onClearInfluencer={handleClearInfluencer}
      />
      <MapWindow
        onBoundsChange={handleBoundsChange}
        onCenterChange={handleCenterChange}
        filters={filters}
        shouldFetchPlaces={shouldFetchPlaces}
        onShouldFetch={handleShouldFetch}
      />
      <PlaceSection
        mapBounds={mapBounds}
        filters={filters}
        center={center}
        shouldFetchPlaces={shouldFetchPlaces}
        onShouldFetch={handleShouldFetch}
      />
    </PageContainer>
  );
}

const PageContainer = styled.div`
  padding: 6px 0;
`;

const DropdownContainer = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 16px;
`;
