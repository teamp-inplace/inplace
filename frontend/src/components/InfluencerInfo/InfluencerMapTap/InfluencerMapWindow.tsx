import { useState, useCallback, useEffect, useRef } from 'react';
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import { TbCurrentLocation } from 'react-icons/tb';
import { GrPowerCycle } from 'react-icons/gr';
import Button from '@/components/common/Button';
import { LocationData, MarkerData } from '@/types';
import InfoWindow from './InfoWindow';

interface MapWindowProps {
  markers: MarkerData[];
  onBoundsChange: (bounds: LocationData) => void;
  onCenterChange: (center: { lat: number; lng: number }) => void;
  shouldFetchPlaces: boolean;
  onCompleteFetch: (value: boolean) => void;
}

export default function InfluencerMapWindow({
  markers,
  onBoundsChange,
  onCenterChange,
  shouldFetchPlaces,
  onCompleteFetch,
}: MapWindowProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [openInfoWindow, setOpenInfoWindow] = useState<number | null>(null);

  const markerData = markers.find((m) => m.placeId === openInfoWindow);

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

    onCompleteFetch(true);
  }, [onBoundsChange, onCenterChange]);

  useEffect(() => {
    if (shouldFetchPlaces) {
      fetchLocation();
      onCompleteFetch(false);
    }
  }, [shouldFetchPlaces, fetchLocation, onCompleteFetch]);

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

  const handleSearchNearby = useCallback(() => {
    fetchLocation();
  }, [fetchLocation]);

  const handleResetCenter = useCallback(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.setCenter(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
      mapRef.current.setLevel(4);
    }
  }, [userLocation]);

  const handleMarkerClick = useCallback(
    (place: number, marker: kakao.maps.Marker) => {
      if (mapRef.current && marker && openInfoWindow !== place) {
        const pos = marker.getPosition();

        if (mapRef.current.getLevel() > 10) {
          mapRef.current.setLevel(9, {
            anchor: pos,
            animate: true,
          });
        }
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.panTo(pos);
            setOpenInfoWindow(place);
          }
        }, 100);
      } else {
        setOpenInfoWindow(null);
      }
    },
    [mapRef.current, openInfoWindow],
  );
  return (
    <>
      <MapContainer>
        <Map
          center={{
            lat: 36.2683,
            lng: 127.6358,
          }}
          style={{ width: '100%', height: '100%' }}
          level={14}
          onCreate={(map) => {
            mapRef.current = map;
          }}
          ref={mapRef}
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
          <MarkerClusterer averageCenter minLevel={10} minClusterSize={2}>
            {markers.map((place) => (
              <MapMarker
                key={place.placeId}
                onClick={(marker) => {
                  handleMarkerClick(place.placeId, marker);
                }}
                position={{
                  lat: place.latitude,
                  lng: place.longitude,
                }}
              />
            ))}
          </MarkerClusterer>
          {openInfoWindow !== null && markerData && (
            <CustomOverlayMap
              zIndex={100}
              position={{
                lat: markerData.latitude,
                lng: markerData.longitude,
              }}
            >
              <InfoWindow data={markerData} onClose={() => setOpenInfoWindow(null)} />
            </CustomOverlayMap>
          )}
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
      <Btn onClick={handleSearchNearby}>
        <GrPowerCycle />
        다시 모기
      </Btn>
    </>
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
const Btn = styled.div`
  display: flex;
  color: #c3c3c3;
  border-radius: 0px;
  font-size: 20px;
  border-bottom: 0.5px solid #c3c3c3;
  width: fit-content;
  padding-bottom: 4px;
  gap: 6px;
  cursor: pointer;
`;
