import { useEffect, useState } from 'react';
import { GrPrevious, GrNext } from 'react-icons/gr';

import styled from 'styled-components';

import BannerItem from '@/components/Main/MainBanner/BannerItem';

import { BannerData } from '@/types';
import NoItem from '@/components/common/layouts/NoItem';

const getTransformValue = ({ $currentIndex, $isMobile }: { $currentIndex: number; $isMobile: boolean }) => {
  if ($isMobile) {
    return `translateX(-${$currentIndex * 100}%)`;
  }

  if ($currentIndex === 0) {
    return 'none';
  }

  return `translateX(-${$currentIndex * 50}%)`;
};

export default function MainBanner({ items = [] }: { items: BannerData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (items.length > 1) {
        setCurrentIndex((prevIndex) => {
          const maxIndex = isMobile ? items.length - 1 : items.length - 2;
          return prevIndex === maxIndex ? 0 : prevIndex + 1;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length, isMobile]);

  const handleBtnPrevClick = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleBtnNextClick = () => {
    if (items.length > 1) {
      const maxIndex = isMobile ? items.length - 1 : items.length - 2;
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
    }
  };

  return (
    <Container>
      {items.length === 0 ? (
        <NoItem message="배너 정보가 없어요!" height={400} />
      ) : (
        <>
          <PrevBtn aria-label="prev_btn" onClick={handleBtnPrevClick} disabled={currentIndex === 0}>
            <GrPrevious size={40} />
          </PrevBtn>
          <NextBtn
            aria-label="next_btn"
            onClick={handleBtnNextClick}
            disabled={currentIndex === (isMobile ? items.length - 1 : items.length - 2)}
          >
            <GrNext size={40} />
          </NextBtn>
          <CarouselWrapper>
            <CarouselContainer $currentIndex={currentIndex} $isMobile={isMobile}>
              {items.map((item) => (
                <BannerItem
                  key={item.id}
                  id={item.id}
                  imageUrl={item.imageUrl}
                  isFirst={currentIndex === 0 && !isMobile}
                />
              ))}
            </CarouselContainer>
          </CarouselWrapper>
        </>
      )}
    </Container>
  );
}
const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;

const PrevBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  left: 10px;
  z-index: 1;
  color: white;
`;

const NextBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  z-index: 1;
  color: white;
`;

const CarouselWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
`;

const CarouselContainer = styled.div<{ $currentIndex: number; $isMobile: boolean }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: ${getTransformValue};
  width: 100%;
`;
