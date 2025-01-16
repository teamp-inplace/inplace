import { useCallback, useState } from 'react';
import MapWindow from '@/components/Map/MapWindow';
import PlaceSection from '@/components/Map/PlaceSection';
import { LocationData } from '@/types';

export default function InfluencerMapTap() {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [mapBounds, setMapBounds] = useState<LocationData>({
    topLeftLatitude: 0,
    topLeftLongitude: 0,
    bottomRightLatitude: 0,
    bottomRightLongitude: 0,
  });
  const [shouldFetchPlaces, setShouldFetchPlaces] = useState(false);
  const [initialLocation, setInitialLocation] = useState(false);

  const filters = {
    categories: [],
    influencers: [],
    location: [{ main: '', sub: '' }],
  };
  const places = [
    {
      placeId: 1,
      placeName: '료코',
      address: {
        address1: '대구',
        address2: '북구',
        address3: '대학로',
      },
      category: 'RESTAURANT',
      influencerName: '성시경',
      longitude: '35.123',
      latitude: '135.11',
      likes: true,
      menuImgUrl: 'https://via.placeholder.com/500',
    },
  ];
  const handleBoundsChange = useCallback((bounds: LocationData) => {
    setMapBounds(bounds);
  }, []);

  const handleCenterChange = useCallback((newCenter: { lat: number; lng: number }) => {
    setCenter(newCenter);
  }, []);

  const handlePlacesUpdate = () => {};

  const handleSearchNearby = () => {};

  const handleInitialLocation = useCallback((value: boolean) => {
    setInitialLocation(value);
    if (value) {
      setShouldFetchPlaces(true);
    }
  }, []);
  const handleFetchComplete = useCallback(() => {
    setShouldFetchPlaces(false);
  }, []);

  return (
    <>
      <MapWindow
        onBoundsChange={handleBoundsChange}
        onCenterChange={handleCenterChange}
        onSearchNearby={handleSearchNearby}
        onInitialLocation={handleInitialLocation}
        center={center}
        places={places}
      />
      <PlaceSection
        mapBounds={mapBounds}
        filters={filters}
        onPlacesUpdate={handlePlacesUpdate}
        center={center}
        shouldFetchPlaces={shouldFetchPlaces}
        onFetchComplete={handleFetchComplete}
        initialLocation={initialLocation}
      />
    </>
  );
}
