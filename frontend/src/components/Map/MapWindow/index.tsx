import { useState, useCallback, useEffect } from 'react';
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import { TbCurrentLocation } from 'react-icons/tb';
import { GrPowerCycle } from 'react-icons/gr';
import Button from '@/components/common/Button';
import { LocationData, MarkerInfo, PlaceData } from '@/types';
import { useGetAllMarkers } from '@/api/hooks/useGetAllMarkers';
import InfoWindow from '@/components/InfluencerInfo/InfluencerMapTap/InfoWindow';
import { useGetMarkerInfo } from '@/api/hooks/useGetMarkerInfo';
import OriginMarker from '@/assets/images/OriginMarker.png';
import SelectedMarker from '@/assets/images/InplaceMarker.png';
import { Text } from '@/components/common/typography/Text';
import nowLocation from '@/assets/images/now_location.webp';
import Loading from '@/components/common/layouts/Loading';

interface MapWindowProps {
  center: { lat: number; lng: number };
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
  center,
  onBoundsChange,
  onCenterChange,
  filters,
  placeData,
  selectedPlaceId,
  onPlaceSelect,
  isListExpanded,
  onListExpand,
}: MapWindowProps) {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    if (!map) return;

    const bounds = map.getBounds();
    const currentCenter = map.getCenter();

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
  }, [map, onBoundsChange, onCenterChange]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
          setIsLoading(false);
          map?.setCenter(new kakao.maps.LatLng(userLoc.lat, userLoc.lng));
          fetchMarkers();
        },
        (err) => {
          console.error('Geolocation error:', err);
        },
        { enableHighAccuracy: true },
      );
    } else {
      setIsLoading(true);
      console.warn('Geolocation is not supported by this browser.');
    }
  }, [map]);

  useEffect(() => {
    if (map && center) {
      const position = new kakao.maps.LatLng(center.lat, center.lng);
      setTimeout(
        () => {
          map.panTo(position);
        },
        selectedPlaceId !== null ? 200 : 0,
      );
    }
  }, [center, map]);

  // 마커나 장소 선택시 지도 중심으로 이동
  const moveMapToMarker = useCallback(
    (latitude: number, longitude: number) => {
      if (map) {
        const currentLevel = map.getLevel();
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

        if (map.getLevel() > 10) {
          map.setLevel(9, {
            anchor: position,
            animate: true,
          });
        }
        setTimeout(() => {
          if (map) {
            map.panTo(position);
          }
        }, 100);
      }
    },
    [isMobile, map],
  );

  // 초기 선택 시에만 이동하도록
  useEffect(() => {
    if (selectedPlaceId) {
      const marker = markers.find((m) => m.placeId === selectedPlaceId);
      if (marker) {
        moveMapToMarker(marker.latitude, marker.longitude);
      }
    }
  }, [selectedPlaceId, moveMapToMarker]);

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
    if (map && userLocation) {
      map.setCenter(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
      map.setLevel(4);
      setShowSearchButton(false);
    }
  }, [userLocation]);

  // 마커 클릭 시, 장소와 마커를 선택 상태로
  const handleMarkerClick = useCallback(
    (placeId: number, marker: kakao.maps.Marker) => {
      if (map && marker) {
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
      {isLoading ? (
        <LoadingWrapper>
          <Loading />
          <Text size="s" weight="normal" variant="white">
            내 위치 찾는 중...
          </Text>
        </LoadingWrapper>
      ) : null}
      {showSearchButton && (
        <ButtonContainer>
          <Button
            aria-label="around_btn"
            onClick={handleSearchNearby}
            variant="white"
            size="small"
            style={{
              fontSize: isMobile ? '12px' : '14px',
              borderRadius: '20px',
              padding: isMobile ? '16px' : '18px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              gap: '8px',
            }}
          >
            <GrPowerCycle />이 위치에서 장소 보기
          </Button>
        </ButtonContainer>
      )}
      <Map
        center={mapCenter}
        style={{ width: '100%', height: isMobile ? 'auto' : '570px', aspectRatio: isMobile ? '1' : 'auto' }}
        level={4}
        onCreate={(mapInstance) => {
          setMap(mapInstance);
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
              src: nowLocation,
              size: { width: userLocationSize, height: userLocationSize },
            }}
          />
        )}
        <MarkerClusterer averageCenter minLevel={10} minClusterSize={2}>
          {markers.map((place) => (
            <MapMarker
              key={place.placeId}
              zIndex={selectedPlaceId === place.placeId ? 999 : 1}
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
      {!isListExpanded && (
        <ListViewButton onClick={onListExpand}>
          <Text size="xs" variant="white" weight="normal">
            목록 보기
          </Text>
        </ListViewButton>
      )}
    </MapContainer>
  );
}

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 20px;
`;
const LoadingWrapper = styled.div`
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #29292963;

  > div {
    padding: 4px 16px;
    height: auto;
    transform: translateY(-50%);
  }

  .loader {
    border-left-color: #e6e6e6;
    padding: 0px;
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
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
