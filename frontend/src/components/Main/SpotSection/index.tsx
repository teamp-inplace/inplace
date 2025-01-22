import styled from 'styled-components';
import { GrPrevious, GrNext } from 'react-icons/gr';

import { useRef } from 'react';
import SpotItem from './SpotItem';
import { SpotData } from '@/types';
import NoItem from '@/components/common/layouts/NoItem';

export default function SpotSection({ items = [] }: { items: SpotData[] }) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollList = (direction: 'left' | 'right') => {
    if (listRef.current) {
      const someWidth = 520;
      const scrollAmount = direction === 'left' ? -someWidth : someWidth;
      listRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  return (
    <SectionContainer>
      {items.length === 0 ? (
        <NoItem message="그곳 정보가 없어요!" height={200} />
      ) : (
        <>
          <ArrowButton onClick={() => scrollList('left')} className="left-arrow" direction="left">
            <GrPrevious size={40} />
          </ArrowButton>
          <ListContainer ref={listRef}>
            {items.map((spot) => {
              return (
                <SpotItem
                  key={spot.videoId}
                  videoId={spot.videoId}
                  videoAlias={spot.videoAlias}
                  videoUrl={spot.videoUrl}
                  place={spot.place}
                />
              );
            })}
          </ListContainer>
          {items.length > 3 && (
            <ArrowButton onClick={() => scrollList('right')} className="right-arrow" direction="right">
              <GrNext size={40} />
            </ArrowButton>
          )}
        </>
      )}
    </SectionContainer>
  );
}
const SectionContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  overflow: visible;
  width: 100%;
`;
const ListContainer = styled.div`
  overflow: hidden;
  display: flex;
  gap: 40px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-width: 768px) {
    gap: 18px;
  }
`;
const ArrowButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  font-size: 24px;
  height: 100%;
  color: transparent;
  background: none;
  border: none;
  cursor: pointer;
  transition:
    color 0.3s,
    background 0.3s;
  padding: 0;
  z-index: 9;

  &:hover {
    color: white;
    background: ${({ direction }) =>
      direction === 'left'
        ? 'linear-gradient(to right, rgba(0, 0, 0, 0.6), transparent 90%)'
        : 'linear-gradient(to left, rgba(0, 0, 0, 0.6), transparent 90%)'};
  }

  &.left-arrow {
    left: 0;
  }

  &.right-arrow {
    right: 0;
  }

  @media screen and (max-width: 768px) {
    svg {
      height: 20px;
    }
  }
`;
