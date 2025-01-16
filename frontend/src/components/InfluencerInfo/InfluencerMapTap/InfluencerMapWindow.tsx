import { useState, useCallback, useEffect, useRef } from 'react';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import { TbCurrentLocation } from 'react-icons/tb';
import Button from '@/components/common/Button';
import { LocationData, MarkerData } from '@/types';

interface MapWindowProps {
  markers: MarkerData[];
  onBoundsChange: (bounds: LocationData) => void;
  onCenterChange: (center: { lat: number; lng: number }) => void;
  shouldFetchPlaces: boolean;
}

export default function InfluencerMapWindow({
  markers,
  onBoundsChange,
  onCenterChange,
  shouldFetchPlaces,
}: MapWindowProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const fetchLocation = useCallback(() => {
    if (!mapRef.current) return;

    const bounds = mapRef.current.getBounds();
    const currentCenter = mapRef.current.getCenter();

    const newBounds: LocationData = {
      topLeftLatitude: bounds.getNorthEast().getLat(),
      topLeftLongitude: bounds.getSouthWest().getLng(),
      bottomRightLatitude: bounds.getSouthWest().getLat(),
      bottomRightLongitude: bounds.getNorthEast().getLng(),
    };
    onCenterChange({ lat: currentCenter.getLat(), lng: currentCenter.getLng() });
    onBoundsChange(newBounds);
  }, [onBoundsChange, onCenterChange]);

  useEffect(() => {
    if (shouldFetchPlaces) {
      fetchLocation();
    }
  }, [shouldFetchPlaces, fetchLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
        },
        (err) => {
          console.error('Geolocation error:', err);
        },
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleResetCenter = useCallback(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.setCenter(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
      mapRef.current.setLevel(4);
    }
  }, [userLocation]);

  return (
    <MapContainer>
      <Map
        center={{
          lat: 36.2683,
          lng: 127.6358,
        }}
        style={{ width: '100%', height: '100%' }}
        level={13}
        onCreate={(map) => {
          mapRef.current = map;
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

const ResetButtonContainer = styled.div`
  position: absolute;
  bottom: 46px;
  right: 30px;
  z-index: 10;
`;
