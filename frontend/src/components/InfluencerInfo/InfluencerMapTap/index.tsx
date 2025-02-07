import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { LocationData, MarkerData, PlaceData } from '@/types';
import { useGetAllMarkers } from '@/api/hooks/useGetAllMarkers';
import InfluencerMapWindow from './InfluencerMapWindow';
import InfluencerPlaceSection from './InfluencerPlaceSection';

export default function InfluencerMapTap({
  influencerImg,
  influencerName,
}: {
  influencerImg: string;
  influencerName: string;
}) {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [mapBounds, setMapBounds] = useState<LocationData>({
    topLeftLatitude: 40.22639734631998,
    topLeftLongitude: 117.27774208342159,
    bottomRightLatitude: 31.274644378932404,
    bottomRightLongitude: 139.18297869519475,
  });
  const [isListExpanded, setIsListExpanded] = useState(false);
  const filters = { categories: [], influencers: [influencerName] };
  const [shouldFetchPlaces, setShouldFetchPlaces] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [placeData, setPlaceData] = useState<PlaceData[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(window.innerHeight);
  const dragStartRef = useRef<{
    isDragging: boolean;
    startY: number;
    startTranslate: number;
  }>({ isDragging: false, startY: 0, startTranslate: window.innerHeight });

  const { data: fetchedMarkers = [] } = useGetAllMarkers(
    {
      location: mapBounds,
      filters,
      center,
    },
    isInitialLoad,
  );

  useEffect(() => {
    if (isInitialLoad && fetchedMarkers.length > 0) {
      setMarkers(fetchedMarkers);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, fetchedMarkers]);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartRef.current = {
      isDragging: true,
      startY: e.touches[0].clientY,
      startTranslate: translateY,
    };
  };
  const lastMoveTimeRef = useRef(0);

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
  const autoCloseThreshold = window.innerHeight * 0.65;

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

  const handleBoundsChange = useCallback((bounds: LocationData) => {
    setMapBounds(bounds);
  }, []);

  const handleCenterChange = useCallback((newCenter: { lat: number; lng: number }) => {
    setCenter(newCenter);
  }, []);

  const handleCompleteFetch = useCallback((value: boolean) => {
    setShouldFetchPlaces(value);
  }, []);

  const handleGetPlaceData = useCallback((data: PlaceData[]) => {
    setPlaceData((prevData) => {
      if (JSON.stringify(prevData) !== JSON.stringify(data)) {
        return data;
      }
      return prevData;
    });
  }, []);

  // 현재 선택된 장소 id 저장, 같은장소 재선택시 취소
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
    <Wrapper>
      <InfluencerMapWindow
        influencerImg={influencerImg}
        placeData={placeData}
        markers={markers}
        selectedPlaceId={selectedPlaceId}
        onBoundsChange={handleBoundsChange}
        onCenterChange={handleCenterChange}
        shouldFetchPlaces={shouldFetchPlaces}
        onCompleteFetch={handleCompleteFetch}
        onPlaceSelect={handlePlaceSelect}
        isListExpanded={isListExpanded}
        onListExpand={handleListExpand}
      />
      <PlaceSectionDesktop>
        <InfluencerPlaceSection
          mapBounds={mapBounds}
          center={center}
          filters={filters}
          shouldFetchPlaces={shouldFetchPlaces}
          onCompleteFetch={handleCompleteFetch}
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
        <InfluencerPlaceSection
          mapBounds={mapBounds}
          center={center}
          filters={filters}
          shouldFetchPlaces={shouldFetchPlaces}
          onCompleteFetch={handleCompleteFetch}
          onGetPlaceData={handleGetPlaceData}
          onPlaceSelect={handlePlaceSelect}
          selectedPlaceId={selectedPlaceId}
        />
      </MobilePlaceSection>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`;
const PlaceSectionDesktop = styled.div`
  width: 100%;
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
