import { useState, useCallback, useEffect, useRef } from 'react';
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import { TbCurrentLocation } from 'react-icons/tb';
import { GrPowerCycle } from 'react-icons/gr';
import Button from '@/components/common/Button';
import { LocationData, MarkerData, MarkerInfo, PlaceData } from '@/types';
import InfoWindow from './InfoWindow';
import BasicImage from '@/assets/images/basic-image.webp';
import { useGetMarkerInfo } from '@/api/hooks/useGetMarkerInfo';
import { Text } from '@/components/common/typography/Text';

interface MapWindowProps {
  influencerImg: string;
  markers: MarkerData[];
  placeData: PlaceData[];
  selectedPlaceId: number | null;
  onBoundsChange: (bounds: LocationData) => void;
  onCenterChange: (center: { lat: number; lng: number }) => void;
  shouldFetchPlaces: boolean;
  onCompleteFetch: (value: boolean) => void;
  onPlaceSelect: (placeId: number | null) => void;
  isListExpanded?: boolean;
  onListExpand?: () => void;
  onSearchNearby?: (handleSearcNearby: () => void) => void;
}

export default function InfluencerMapWindow({
  influencerImg,
  markers,
  placeData,
  selectedPlaceId,
  onBoundsChange,
  onCenterChange,
  shouldFetchPlaces,
  onCompleteFetch,
  onPlaceSelect,
  isListExpanded,
  onListExpand,
  onSearchNearby,
}: MapWindowProps) {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [markerInfo, setMarkerInfo] = useState<MarkerInfo | PlaceData>();
  const [shouldFetchData, setShouldFetchData] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const originSize = isMobile ? 26 : 34;
  const userLocationSize = isMobile ? 16 : 24;
  const selectedMarker = markers.find((m) => m.placeId === selectedPlaceId);
  const MarkerInfoData = useGetMarkerInfo(selectedPlaceId?.toString() || '', shouldFetchData);

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
  }, [onBoundsChange, onCenterChange, onCompleteFetch]);

  // 장소 정보 업데이트가 필요한 경우 바운더리와 센터를 구해서 전달
  useEffect(() => {
    if (shouldFetchPlaces) {
      fetchLocation();
      onCompleteFetch(false);
    }
  }, [shouldFetchPlaces, fetchLocation, onCompleteFetch]);

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
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    onSearchNearby?.(handleSearchNearby);
  }, [handleSearchNearby, onSearchNearby]);

  const handleResetCenter = useCallback(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.setCenter(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
      mapRef.current.setLevel(4);
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
    <>
      <MapContainer>
        <Map
          center={{
            lat: 36.2683,
            lng: 127.6358,
          }}
          style={{ width: '100%', height: 'auto', aspectRatio: isMobile ? '1' : '1.65/1' }}
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
                src: 'https://i.ibb.co/4gGFjRx/circle.webp',
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
                zIndex={selectedPlaceId === place.placeId ? 999 : 1}
                position={{
                  lat: place.latitude,
                  lng: place.longitude,
                }}
                image={{
                  src: influencerImg || BasicImage,
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
      <Btn onClick={handleSearchNearby}>
        <GrPowerCycle />
        현재 위치에서 장소정보 보기
      </Btn>
    </>
  );
}

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 20px;
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
const Btn = styled.div`
  display: flex;
  color: #c3c3c3;
  border-radius: 0px;
  font-size: 16px;
  border-bottom: 0.5px solid #c3c3c3;
  width: fit-content;
  padding-bottom: 4px;
  gap: 6px;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    display: none;
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
