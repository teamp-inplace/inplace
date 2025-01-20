import { useState, useCallback, useEffect, useRef } from 'react';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import { TbCurrentLocation } from 'react-icons/tb';
import Button from '@/components/common/Button';
import { LocationData } from '@/types';
import { useGetAllMarkers } from '@/api/hooks/useGetAllMarkers';

interface MapWindowProps {
  onBoundsChange: (bounds: LocationData) => void;
  onCenterChange: (center: { lat: number; lng: number }) => void;
  filters: {
    categories: string[];
    influencers: string[];
    location: { main: string; sub?: string; lat?: number; lng?: number }[];
  };
  shouldFetchPlaces: boolean;
  onShouldFetch: (vaule: boolean) => void;
}

export default function MapWindow({
  onBoundsChange,
  onCenterChange,
  filters,
  shouldFetchPlaces,
  onShouldFetch,
}: MapWindowProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [mapBound, setMapBound] = useState<LocationData>({
    topLeftLatitude: 0,
    topLeftLongitude: 0,
    bottomRightLatitude: 0,
    bottomRightLongitude: 0,
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const { data: markers = [] } = useGetAllMarkers(
    {
      location: mapBound,
      filters,
      center: mapCenter,
    },
    shouldFetchPlaces,
  );

  const fetchMarkers = useCallback(() => {
    if (!mapRef.current) return;

    const bounds = mapRef.current.getBounds();
    const currentCenter = mapRef.current.getCenter();

    const newBounds: LocationData = {
      topLeftLatitude: bounds.getNorthEast().getLat(),
      topLeftLongitude: bounds.getSouthWest().getLng(),
      bottomRightLatitude: bounds.getSouthWest().getLat(),
      bottomRightLongitude: bounds.getNorthEast().getLng(),
    };
    setMapCenter({ lat: currentCenter.getLat(), lng: currentCenter.getLng() });
    setMapBound(newBounds);

    onCenterChange({ lat: currentCenter.getLat(), lng: currentCenter.getLng() });
    onBoundsChange(newBounds);

    onShouldFetch(true);
  }, [onBoundsChange, onCenterChange, onShouldFetch]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
          setMapCenter(userLoc);
          if (mapRef.current) {
            mapRef.current.setCenter(new kakao.maps.LatLng(userLoc.lat, userLoc.lng));
            fetchMarkers();
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
        },
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
  }, [fetchMarkers]);

  useEffect(() => {
    if (shouldFetchPlaces) {
      fetchMarkers();
      onShouldFetch(false);
    }
  }, [shouldFetchPlaces, fetchMarkers, onShouldFetch]);

  const handleSearchNearby = useCallback(() => {
    fetchMarkers();
    setShowSearchButton(false);
  }, [fetchMarkers]);

  const handleResetCenter = useCallback(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.setCenter(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
      mapRef.current.setLevel(4);
      setShowSearchButton(false);
    }
  }, [userLocation]);

  return (
    <MapContainer>
      {showSearchButton && (
        <ButtonContainer>
          <Button
            onClick={handleSearchNearby}
            variant="white"
            size="small"
            style={{
              height: '36px',
              fontSize: '16px',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '1px 1px 2px #707070',
            }}
          >
            주변 찾기
          </Button>
        </ButtonContainer>
      )}
      <Map
        center={mapCenter}
        style={{ width: '100%', height: '100%' }}
        level={4}
        onCreate={(map) => {
          mapRef.current = map;
        }}
        onCenterChanged={() => {
          setShowSearchButton(true);
        }}
        onZoomChanged={() => {
          setShowSearchButton(true);
        }}
      >
        {userLocation && (
          <MapMarker
            position={userLocation}
            image={{
              src: 'https://i.ibb.co/4gGFjRx/circle.png',
              size: { width: 24, height: 24 },
            }}
          />
        )}
        <MarkerClusterer averageCenter minLevel={10}>
          {markers.map((place) => (
            <MapMarker
              key={place.placeId}
              position={{
                lat: place.latitude,
                lng: place.longitude,
              }}
            />
          ))}
        </MarkerClusterer>
      </Map>
      <ResetButtonContainer>
        <Button
          onClick={handleResetCenter}
          variant="white"
          size="small"
          style={{ width: '40px', height: '40px', boxShadow: '1px 1px 2px #707070' }}
        >
          <TbCurrentLocation size={20} />
        </Button>
      </ResetButtonContainer>
    </MapContainer>
  );
}

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 570px;
  padding: 20px 0;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

const ResetButtonContainer = styled.div`
  position: absolute;
  bottom: 46px;
  right: 30px;
  z-index: 10;
`;
