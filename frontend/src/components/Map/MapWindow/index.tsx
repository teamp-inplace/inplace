import { useState, useCallback, useEffect, useRef } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import { TbCurrentLocation } from 'react-icons/tb';
import Button from '@/components/common/Button';
import { LocationData, PlaceData } from '@/types';

interface MapWindowProps {
  onBoundsChange: (bounds: LocationData) => void;
  onCenterChange: (center: { lat: number; lng: number }) => void;
  onSearchNearby: () => void;
  onInitialLocation: (value: boolean) => void;
  center: { lat: number; lng: number };
  places: PlaceData[];
}

export default function MapWindow({
  onBoundsChange,
  onCenterChange,
  onSearchNearby,
  onInitialLocation,
  center,
  places,
}: MapWindowProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const accumulatedPlacesRef = useRef<Set<string>>(new Set());
  const [accumulatedPlaces, setAccumulatedPlaces] = useState<PlaceData[]>([]);

  useEffect(() => {
    const newPlaces = places.filter((place) => !accumulatedPlacesRef.current.has(place.placeId.toString()));

    if (newPlaces.length > 0) {
      newPlaces.forEach((place) => {
        accumulatedPlacesRef.current.add(place.placeId.toString());
      });
      setAccumulatedPlaces((prev) => [...prev, ...newPlaces]);
    }
  }, [places]);

  const updateBounds = useCallback(() => {
    if (!mapRef.current) return;

    const bounds = mapRef.current.getBounds();
    const newCenter = mapRef.current.getCenter();
    const newBounds: LocationData = {
      topLeftLatitude: bounds.getNorthEast().getLat(),
      topLeftLongitude: bounds.getSouthWest().getLng(),
      bottomRightLatitude: bounds.getSouthWest().getLat(),
      bottomRightLongitude: bounds.getNorthEast().getLng(),
    };
    onBoundsChange(newBounds);
    onCenterChange({ lat: newCenter.getLat(), lng: newCenter.getLng() });
  }, [onBoundsChange, onCenterChange]);

  const handleSearchNearby = useCallback(() => {
    updateBounds();
    onSearchNearby();
  }, [updateBounds, onSearchNearby]);

  const handleResetCenter = useCallback(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.setCenter(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
      mapRef.current.setLevel(4);
      updateBounds();
    }
  }, [userLocation, updateBounds]);

  const handleCenterChanged = useCallback(
    (map: kakao.maps.Map) => {
      const newCenter = map.getCenter();
      const centerData = {
        lat: newCenter.getLat(),
        lng: newCenter.getLng(),
      };
      setMapCenter(centerData);
      onCenterChange(centerData);
    },
    [onCenterChange],
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(newCenter);
          setUserLocation(newCenter);
          onInitialLocation(true);
          if (mapRef.current) {
            mapRef.current.setCenter(new kakao.maps.LatLng(newCenter.lat, newCenter.lng));
            onCenterChange(newCenter);
            updateBounds();
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
        },
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && (center.lat !== mapCenter.lat || center.lng !== mapCenter.lng)) {
      mapRef.current.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
      setMapCenter(center);
      updateBounds();
    }
  }, [center, mapCenter, updateBounds]);

  return (
    <MapContainer>
      <ButtonContainer>
        <Button onClick={handleSearchNearby} variant="mint" size="small" style={{ margin: '5px', fontSize: '16px' }}>
          주변 찾기
        </Button>
      </ButtonContainer>
      <Map
        center={mapCenter}
        style={{ width: '100%', height: '100%' }}
        level={4}
        onCreate={(map) => {
          mapRef.current = map;
        }}
        onCenterChanged={handleCenterChanged}
        onZoomChanged={updateBounds}
        onDragEnd={updateBounds}
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
        {accumulatedPlaces.map((place) => (
          <MapMarker
            key={place.placeId}
            position={{
              lat: Number(place.latitude),
              lng: Number(place.longitude),
            }}
          />
        ))}
      </Map>
      <ResetButtonContainer>
        <Button
          onClick={handleResetCenter}
          variant="white"
          size="small"
          style={{ width: '30px', height: '30px', boxShadow: '0px 2px 2px #707070' }}
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
  padding: 10px 0;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

const ResetButtonContainer = styled.div`
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 10;
`;
