import { useState, useCallback, useEffect, useRef } from 'react';
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import { TbCurrentLocation } from 'react-icons/tb';
import Button from '@/components/common/Button';
import { LocationData, MarkerInfo, PlaceData } from '@/types';
import { useGetAllMarkers } from '@/api/hooks/useGetAllMarkers';
import InfoWindow from '@/components/InfluencerInfo/InfluencerMapTap/InfoWindow';
import { useGetMarkerInfo } from '@/api/hooks/useGetMarkerInfo';
import OriginMarker from '@/assets/images/OriginMarker.png';
import SelectedMarker from '@/assets/images/InplaceMarker.png';
import { Text } from '@/components/common/typography/Text';

interface MapWindowProps {
  onBoundsChange: (bounds: LocationData) => void;
  onCenterChange: (center: { lat: number; lng: number }) => void;
  filters: {
    categories: string[];
    influencers: string[];
    location: { main: string; sub?: string; lat?: number; lng?: number }[];
  };
  placeData: PlaceData[];
  selectedPlaceId: number | null;
  onPlaceSelect: (placeId: number | null) => void;
  isListExpanded?: boolean;
  onListExpand?: () => void;
}

export default function MapWindow({
  onBoundsChange,
  onCenterChange,
  filters,
  placeData,
  selectedPlaceId,
  onPlaceSelect,
  isListExpanded,
  onListExpand,
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
  const [markerInfo, setMarkerInfo] = useState<MarkerInfo | PlaceData>();
  const [shouldFetchData, setShouldFetchData] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const originSize = isMobile ? 26 : 34;
  const userLocationSize = isMobile ? 16 : 24;

  const { data: markers = [] } = useGetAllMarkers({
    location: mapBound,
    filters,
    center: mapCenter,
  });

  const selectedMarker = markers.find((m) => m.placeId === selectedPlaceId);
  const MarkerInfoData = useGetMarkerInfo(selectedPlaceId?.toString() || '', shouldFetchData);

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
  }, [onBoundsChange, onCenterChange]);

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

  // 마커나 장소 선택시 지도 중심으로 이동
  const moveMapToMarker = useCallback(
    (latitude: number, longitude: number) => {
      if (mapRef.current) {
        const currentLevel = mapRef.current.getLevel();
        const baseOffset = -0.007;

        let levelMultiplier;
        if (currentLevel <= 5) {
          levelMultiplier = 1;
        } else if (currentLevel <= 8) {
          levelMultiplier = currentLevel * 1.05;
        } else {
          levelMultiplier = currentLevel * 2;
        }

        const offsetY = isMobile ? (baseOffset * levelMultiplier) / 5 : 0;
        const position = new kakao.maps.LatLng(latitude - offsetY, longitude);

        if (mapRef.current.getLevel() > 10) {
          mapRef.current.setLevel(9, {
            anchor: position,
            animate: true,
          });
        }
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.panTo(position);
          }
        }, 100);
      }
    },
    [isMobile],
  );

  useEffect(() => {
    if (selectedPlaceId && selectedMarker) {
      moveMapToMarker(selectedMarker.latitude, selectedMarker.longitude);
    }
  }, [selectedPlaceId, selectedMarker, moveMapToMarker]);

  // 마커 정보를 새로 호출한 후 데이터 업데이트
  useEffect(() => {
    if (shouldFetchData && MarkerInfoData.data) {
      setMarkerInfo(MarkerInfoData.data);
      setShouldFetchData(false);
    }
  }, [MarkerInfoData.data, shouldFetchData]);

  // 마커 정보가 있을 경우 전달, 없을 경우 새로 호출 함수
  const getMarkerInfoWithPlaceInfo = useCallback(
    (place: number) => {
      if (!placeData) return;

      const existData = placeData.find((m) => m.placeId === place);
      if (existData) {
        setMarkerInfo(existData);
        setShouldFetchData(false);
      } else {
        setShouldFetchData(true);
      }
    },
    [placeData],
  );

  // 마커나 장소가 선택되었을 경우
  useEffect(() => {
    if (selectedPlaceId) {
      getMarkerInfoWithPlaceInfo(selectedPlaceId);
    }
  }, [selectedPlaceId, placeData, getMarkerInfoWithPlaceInfo]);

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

  // 마커 클릭 시, 장소와 마커를 선택 상태로
  const handleMarkerClick = useCallback(
    (placeId: number, marker: kakao.maps.Marker) => {
      if (mapRef.current && marker) {
        onPlaceSelect(selectedPlaceId === placeId ? null : placeId);
        if (selectedPlaceId !== placeId) {
          const pos = marker.getPosition();
          moveMapToMarker(pos.getLat(), pos.getLng());
        }
      }
    },
    [selectedPlaceId, onPlaceSelect, moveMapToMarker],
  );

  return (
    <MapContainer>
      {showSearchButton && (
        <ButtonContainer>
          <Button
            aria-label="around_btn"
            onClick={handleSearchNearby}
            variant="white"
            size="small"
            style={{
              borderRadius: '20px',
              padding: isMobile ? '18px' : '20px',
              boxShadow: '1px 1px 2px #707070',
            }}
          >
            주변 찾기
          </Button>
        </ButtonContainer>
      )}
      <Map
        center={mapCenter}
        style={{ width: '100%', height: isMobile ? 'auto' : '570px', aspectRatio: isMobile ? '1' : 'auto' }}
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
              size: { width: userLocationSize, height: userLocationSize },
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
              image={{
                src: selectedPlaceId === place.placeId ? SelectedMarker : OriginMarker,
                size: {
                  width: selectedPlaceId === place.placeId ? originSize + 14 : originSize,
                  height: selectedPlaceId === place.placeId ? originSize + 14 : originSize,
                },
              }}
            />
          ))}
        </MarkerClusterer>
        {selectedPlaceId !== null && selectedMarker && markerInfo && (
          <CustomOverlayMap
            zIndex={100}
            position={{
              lat: selectedMarker.latitude,
              lng: selectedMarker.longitude,
            }}
          >
            <InfoWindow
              data={markerInfo}
              onClose={() => {
                onPlaceSelect(null);
              }}
            />
          </CustomOverlayMap>
        )}
      </Map>
      <ResetButtonContainer>
        <StyledBtn aria-label="reset_btn" onClick={handleResetCenter} variant="white" size="small">
          <TbCurrentLocation size={20} />
        </StyledBtn>
      </ResetButtonContainer>
      <ListViewButton onClick={onListExpand}>
        <Text size="xs" variant="white" weight="normal">
          {isListExpanded ? '지도 보기' : '목록 보기'}
        </Text>
      </ListViewButton>
    </MapContainer>
  );
}

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 20px;
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

  @media screen and (max-width: 768px) {
    bottom: 34px;
    right: 14px;
  }
`;

const StyledBtn = styled(Button)`
  width: 40px;
  height: 40px;
  box-shadow: 1px 1px 2px #707070;

  @media screen and (max-width: 768px) {
    width: 28px;
    height: 28px;
    box-shadow: 1px 1px 1px #707070;
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const ListViewButton = styled.button`
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    cursor: pointer;
    z-index: 10;
    align-items: center;
    gap: 4px;
  }
`;
