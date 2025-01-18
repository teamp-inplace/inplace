import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { LocationData, MarkerData } from '@/types';
import { useGetAllMarkers } from '@/api/hooks/useGetAllMarkers';
import InfluencerMapWindow from './InfluencerMapWindow';
import InfluencerPlaceSection from './InfluencerPlaceSection';

export default function InfluencerMapTap() {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [mapBounds, setMapBounds] = useState<LocationData>({
    topLeftLatitude: 0,
    topLeftLongitude: 0,
    bottomRightLatitude: 0,
    bottomRightLongitude: 0,
  });
  const filters = { categories: [], influencers: [] };
  const [shouldFetchPlaces, setShouldFetchPlaces] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  return (
    <Wrapper>
      <InfluencerMapWindow
        markers={markers}
        onBoundsChange={handleBoundsChange}
        onCenterChange={handleCenterChange}
        shouldFetchPlaces={shouldFetchPlaces}
        onCompleteFetch={handleCompleteFetch}
      />

      <InfluencerPlaceSection
        mapBounds={mapBounds}
        center={center}
        filters={filters}
        shouldFetchPlaces={shouldFetchPlaces}
        onCompleteFetch={handleCompleteFetch}
      />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`;
