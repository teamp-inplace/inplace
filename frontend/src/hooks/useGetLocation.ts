import { useState, useEffect } from 'react';

export default function useGetLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  useEffect(() => {
    const checkKakaoLoaded = () => {
      if (window.kakao && window.kakao.maps) {
        setIsKakaoLoaded(true);
      } else {
        setTimeout(checkKakaoLoaded, 100);
      }
    };
    checkKakaoLoaded();
  }, []);

  useEffect(() => {
    if (!isKakaoLoaded) return undefined;

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newCenter);
        },
        (error) => {
          console.error('Error fetching location', error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
    console.error('Geolocation is not supported by this browser.');
    return undefined;
  }, [isKakaoLoaded]);

  return location;
}
