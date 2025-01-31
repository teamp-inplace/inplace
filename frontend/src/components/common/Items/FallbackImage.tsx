import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import BasicImage from '@/assets/images/basic-image.webp';

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export default function FallbackImage({ src, fallbackSrc = BasicImage, alt = '', ...props }: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      setCurrentSrc(src || fallbackSrc);
      setHasError(false);
    }
  }, [isVisible, src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return <StyledImage ref={imgRef} src={currentSrc} alt={alt} onError={handleError} {...props} />;
}

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  transition: opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.loading ? '0' : '1')};
`;
