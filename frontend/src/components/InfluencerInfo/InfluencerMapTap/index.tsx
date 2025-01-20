import { useCallback, useEffect, useState } from 'react';
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
    topLeftLatitude: 0,
    topLeftLongitude: 0,
    bottomRightLatitude: 0,
    bottomRightLongitude: 0,
  });
  const filters = { categories: [], influencers: [influencerName] };
  const [shouldFetchPlaces, setShouldFetchPlaces] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [placeData, setPlaceData] = useState<PlaceData[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

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
      />
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
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`;
