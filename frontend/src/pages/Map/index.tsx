import { useState, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components';
import DropdownMenu from '@/components/Map/DropdownMenu';
import MapWindow from '@/components/Map/MapWindow';
import PlaceSection from '@/components/Map/PlaceSection';
import Chip from '@/components/common/Chip';
import { Text } from '@/components/common/typography/Text';
import locationOptions from '@/utils/constants/LocationOptions';
import categoryOptions from '@/utils/constants/CategoryOptions';
import { LocationData, PlaceData } from '@/types';
import useGetDropdownName from '@/api/hooks/useGetDropdownName';

type SelectedOption = {
  main: string;
  sub?: string;
  lat?: number;
  lng?: number;
};

export default function MapPage() {
  const { data: influencerOptions } = useGetDropdownName();
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<SelectedOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [placeData, setPlaceData] = useState<PlaceData[]>([]);
  const [translateY, setTranslateY] = useState(window.innerHeight);
  const lastMoveTimeRef = useRef(0);
  const dragStartRef = useRef<{
    isDragging: boolean;
    startY: number;
    startTranslate: number;
  }>({ isDragging: false, startY: 0, startTranslate: window.innerHeight });

  const [mapBounds, setMapBounds] = useState<LocationData>({
    topLeftLatitude: 0,
    topLeftLongitude: 0,
    bottomRightLatitude: 0,
    bottomRightLongitude: 0,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartRef.current = {
      isDragging: true,
      startY: e.touches[0].clientY,
      startTranslate: translateY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current.isDragging) return;

    const now = Date.now();
    if (now - lastMoveTimeRef.current < 50) return;

    lastMoveTimeRef.current = now;

    const delta = e.touches[0].clientY - dragStartRef.current.startY;
    const newTranslate = dragStartRef.current.startTranslate + delta;
    const clampedTranslate = Math.max(0, Math.min(window.innerHeight, newTranslate));
    setTranslateY(clampedTranslate);
  };
  const autoCloseThreshold = window.innerHeight * 0.75;

  const handleTouchEnd = () => {
    dragStartRef.current.isDragging = false;

    const threshold = 50;

    if (Math.abs(translateY - dragStartRef.current.startTranslate) < threshold) {
      setTranslateY(dragStartRef.current.startTranslate);
    } else if (translateY > autoCloseThreshold) {
      setTranslateY(window.innerHeight);
      setIsListExpanded(false);
    }
  };

  const filters = useMemo(
    () => ({
      categories: selectedCategories,
      influencers: selectedInfluencers,
      location: selectedLocations,
    }),
    [selectedCategories, selectedInfluencers, selectedLocations],
  );

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
  }, []);

  const handleInfluencerChange = useCallback((value: { main: string }) => {
    setSelectedInfluencers((prev) => {
      // 이미 선택된 인플루언서인 경우 추가하지 않음
      if (prev.includes(value.main)) return prev;
      return [...prev, value.main];
    });
  }, []);

  const handleCategoryChange = useCallback((value: { main: string }) => {
    setSelectedCategories((prev) => {
      if (prev.includes(value.main)) return prev;
      return [...prev, value.main];
    });
  }, []);

  const handleClearLocation = useCallback((locationToRemove: SelectedOption) => {
    setSelectedLocations((prev) =>
      prev.filter((location) => !(location.main === locationToRemove.main && location.sub === locationToRemove.sub)),
    );
  }, []);

  const handleClearInfluencer = useCallback((influencerToRemove: string) => {
    setSelectedInfluencers((prev) => prev.filter((influencer) => influencer !== influencerToRemove));
  }, []);

  const handleClearCategory = useCallback((categoryToRemove: string) => {
    setSelectedCategories((prev) => prev.filter((category) => category !== categoryToRemove));
  }, []);

  const handleBoundsChange = useCallback((bounds: LocationData) => {
    setMapBounds(bounds);
  }, []);

  const handleCenterChange = useCallback((newCenter: { lat: number; lng: number }) => {
    setCenter(newCenter);
  }, []);

  const handleGetPlaceData = useCallback((data: PlaceData[]) => {
    setPlaceData((prevData) => {
      if (JSON.stringify(prevData) !== JSON.stringify(data)) {
        return data;
      }
      return prevData;
    });
  }, []);

  const handlePlaceSelect = useCallback((placeId: number | null) => {
    setSelectedPlaceId((prevId) => (prevId === placeId ? null : placeId));
  }, []);

  const handleListExpand = useCallback(() => {
    setIsListExpanded((prev) => {
      const newExpandedState = !prev;
      setTranslateY(newExpandedState ? 0 : window.innerHeight);
      return newExpandedState;
    });
  }, []);

  return (
    <PageContainer>
      <Wrapper>
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
          <DropdownMenu
            options={categoryOptions}
            onChange={handleCategoryChange}
            placeholder="카테고리"
            type="category"
          />
        </DropdownContainer>
        <Chip
          selectedLocations={selectedLocations}
          selectedInfluencers={selectedInfluencers}
          selectedCategories={selectedCategories}
          onClearLocation={handleClearLocation}
          onClearInfluencer={handleClearInfluencer}
          onClearCategory={handleClearCategory}
        />
      </Wrapper>
      <MapWindow
        center={center}
        onBoundsChange={handleBoundsChange}
        onCenterChange={handleCenterChange}
        filters={filters}
        placeData={placeData}
        selectedPlaceId={selectedPlaceId}
        onPlaceSelect={handlePlaceSelect}
        isListExpanded={isListExpanded}
        onListExpand={handleListExpand}
      />
      <PlaceSectionDesktop>
        <PlaceSection
          mapBounds={mapBounds}
          filters={filters}
          center={center}
          onGetPlaceData={handleGetPlaceData}
          onPlaceSelect={handlePlaceSelect}
          selectedPlaceId={selectedPlaceId}
        />
      </PlaceSectionDesktop>
      <MobilePlaceSection
        $isExpanded={isListExpanded}
        onClick={() => isListExpanded && setIsListExpanded(false)}
        $translateY={translateY}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <DragHandle />
        <PlaceSection
          mapBounds={mapBounds}
          filters={filters}
          center={center}
          onGetPlaceData={handleGetPlaceData}
          onPlaceSelect={handlePlaceSelect}
          selectedPlaceId={selectedPlaceId}
          isListExpanded={isListExpanded}
          onListExpand={handleListExpand}
        />
      </MobilePlaceSection>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  padding: 6px 0;
  @media screen and (max-width: 768px) {
    width: 100%;
    align-items: center;
    touch-action: none;
  }
`;

const Wrapper = styled.div`
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    > * {
      width: 90%;
    }
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  gap: 14px;
  padding-top: 16px;

  @media screen and (max-width: 768px) {
    width: 90%;
    gap: 12px;
    padding-top: 12px;
    z-index: 9;

    flex-wrap: wrap;
  }
`;

const PlaceSectionDesktop = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobilePlaceSection = styled.div<{ $translateY: number; $isExpanded: boolean }>`
  display: ${({ $isExpanded }) => ($isExpanded ? 'block' : 'none')};

  @media screen and (max-width: 768px) {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translateY(${(props) => props.$translateY}px);
    height: 80vh;
    background-color: #3c3c3c;
    z-index: 90;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    transition: transform 0.3s ease-out;
    touch-action: none;
  }
`;

const DragHandle = styled.div`
  width: 100%;
  height: 20px;
  padding: 12px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: transparent;
  cursor: grab;
  touch-action: none;

  &:after {
    content: '';
    width: 40px;
    height: 4px;
    background-color: #666;
    border-radius: 2px;
  }
`;
