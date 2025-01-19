import { useState, useCallback, useEffect, useRef } from 'react';
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import { TbCurrentLocation } from 'react-icons/tb';
import { GrPowerCycle } from 'react-icons/gr';
import Button from '@/components/common/Button';
import { LocationData, MarkerData, MarkerInfo, PlaceData } from '@/types';
import InfoWindow from './InfoWindow';
import BasicImage from '@/assets/images/basic-image.png';
import { useGetMarkerInfo } from '@/api/hooks/useGetMarkerInfo';

interface MapWindowProps {
  influencerImg: string;
  markers: MarkerData[];
  placeData: PlaceData[];
  onBoundsChange: (bounds: LocationData) => void;
  onCenterChange: (center: { lat: number; lng: number }) => void;
  shouldFetchPlaces: boolean;
  onCompleteFetch: (value: boolean) => void;
}

export default function InfluencerMapWindow({
  influencerImg,
  markers,
  placeData,
  onBoundsChange,
  onCenterChange,
  shouldFetchPlaces,
  onCompleteFetch,
}: MapWindowProps) {
  const originSize = 34;
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const openInfoWindowRef = useRef<number | null>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [markerSizes, setMarkerSizes] = useState<{ [key: number]: number }>({});
  const [markerInfo, setMarkerInfo] = useState<MarkerInfo | PlaceData>();
  const [shouldFetchData, setShouldFetchData] = useState<boolean>(false);
  const openMarkerData = markers.find((m) => m.placeId === openInfoWindowRef.current); // 열려있는 인포 찾기

  const MarkerInfoData = useGetMarkerInfo(openInfoWindowRef.current?.toString() || '', shouldFetchData);

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

  // 장소 정보에 마커 정보가 있을 경우 - 1
  useEffect(() => {
    if (openInfoWindowRef.current && placeData.length > 0) {
      getMarkerInfoWithPlaceInfo(openInfoWindowRef.current);
    }
  }, [placeData, getMarkerInfoWithPlaceInfo]);

  const handleSearchNearby = useCallback(() => {
    fetchLocation();
  }, [fetchLocation]);

  const handleResetCenter = useCallback(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.setCenter(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
      mapRef.current.setLevel(4);
    }
  }, [userLocation]);

  // 마커 클릭 시, 사이즈 조절 및 마커 정보 가져오기
  const handleMarkerClick = useCallback(
    (place: number, marker: kakao.maps.Marker) => {
      if (mapRef.current && marker && openInfoWindowRef.current !== place) {
        openInfoWindowRef.current = place;
        setTimeout(() => {
          getMarkerInfoWithPlaceInfo(place);
        }, 0);
        const pos = marker.getPosition();
        setMarkerSizes((prevSizes) => ({
          ...Object.keys(prevSizes).reduce(
            (acc, key) => ({
              ...acc,
              [key]: originSize,
            }),
            {},
          ),
          [place]: originSize + 10,
        }));
        if (mapRef.current.getLevel() > 10) {
          mapRef.current.setLevel(9, {
            anchor: pos,
            animate: true,
          });
        }
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.panTo(pos);
            openInfoWindowRef.current = place;
          }
        }, 100);
      }
      // 같은 마커 클릭하면 다시 닫음
      else {
        openInfoWindowRef.current = null;
        setShouldFetchData(false);
        setMarkerSizes((prevSizes) => ({
          ...prevSizes,
          [place]: originSize,
        }));
      }
    },
    [getMarkerInfoWithPlaceInfo],
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
                image={{
                  src: influencerImg || BasicImage,
                  size: {
                    width: markerSizes[place.placeId] || originSize,
                    height: markerSizes[place.placeId] || originSize,
                  },
                }}
              />
            ))}
          </MarkerClusterer>
          {openInfoWindowRef.current !== null && openMarkerData && markerInfo && (
            <CustomOverlayMap
              zIndex={100}
              position={{
                lat: openMarkerData.latitude,
                lng: openMarkerData.longitude,
              }}
            >
              <InfoWindow
                data={markerInfo}
                onClose={() => {
                  setMarkerSizes((prevSizes) => ({
                    ...prevSizes,
                    [openInfoWindowRef.current!]: originSize,
                  }));
                  openInfoWindowRef.current = null;
                }}
              />
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
        현재 위치에서 장소정보 보기
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
