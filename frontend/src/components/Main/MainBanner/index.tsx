import { useEffect, useState } from 'react';
import { GrPrevious, GrNext } from 'react-icons/gr';

import styled from 'styled-components';

import BannerItem from '@/components/Main/MainBanner/BannerItem';

import { BannerData } from '@/types';
import NoItem from '@/components/common/layouts/NoItem';

export default function MainBanner({ items = [] }: { items: BannerData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (items.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex === items.length - 2 ? 0 : prevIndex + 1));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  const handleBtnPrevClick = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleBtnNextClick = () => {
    if (items.length > 1) {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, items.length - 2));
    }
  };
  return (
    <Container>
      {items.length === 0 ? (
        <NoItem message="배너 정보가 없어요!" height={400} />
      ) : (
        <>
          <PrevBtn onClick={handleBtnPrevClick} disabled={currentIndex === 0}>
            <GrPrevious size={40} />
          </PrevBtn>
          <NextBtn onClick={handleBtnNextClick} disabled={currentIndex === items.length - 2}>
            <GrNext size={40} />
          </NextBtn>
          <CarouselWrapper>
            <CarouselContainer $currentIndex={currentIndex}>
              {items.map((item) => (
                <BannerItem key={item.id} id={item.id} imageUrl={item.imageUrl} isFirst={currentIndex === 0} />
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

const CarouselContainer = styled.div<{ $currentIndex: number }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: ${({ $currentIndex }) => ($currentIndex === 0 ? null : `translateX(-${$currentIndex * 50}%)`)};
  width: 100%;
`;
