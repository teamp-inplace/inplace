import { useEffect, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { GrPowerCycle } from 'react-icons/gr';
import PlaceItem from '@/components/Map/PlaceSection/PlaceItem';
import { PlaceData, LocationData, PageableData } from '@/types';
import Loading from '@/components/common/layouts/Loading';
import NoItem from '@/components/common/layouts/NoItem';
import { useGetInfinitePlaceList } from '@/api/hooks/useGetInfinitePlaceList';

export interface PlaceSectionProps {
  mapBounds: LocationData;
  filters: {
    categories: string[];
    influencers: string[];
  };
  center: { lat: number; lng: number };
  shouldFetchPlaces: boolean;
  onCompleteFetch: (value: boolean) => void;
  onGetPlaceData: (data: PlaceData[]) => void;
  onPlaceSelect: (placeId: number) => void;
  selectedPlaceId: number | null;
  onSearchNearby?: () => void;
}

export default function InfluencerPlaceSection({
  mapBounds,
  filters,
  center,
  shouldFetchPlaces,
  onCompleteFetch,
  onGetPlaceData,
  onPlaceSelect,
  selectedPlaceId,
  onSearchNearby,
}: PlaceSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const previousPlacesRef = useRef<PlaceData[]>([]);

  const { ref: loadMoreRef, inView } = useInView({
    root: sectionRef.current,
    rootMargin: '0px',
    threshold: 0,
  });

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfinitePlaceList(
    {
      location: mapBounds,
      filters,
      center,
      size: 10,
    },
    shouldFetchPlaces,
  );

  const filteredPlaces = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: PageableData<PlaceData>) => page.content);
  }, [data]);

  useEffect(() => {
    if (data?.pages) {
      const places = data.pages.flatMap((page: PageableData<PlaceData>) => page.content);
      onGetPlaceData(places);
    }
  }, [data, onGetPlaceData]);

  useEffect(() => {
    if (shouldFetchPlaces) {
      onCompleteFetch(false);
    }
  }, [filteredPlaces, shouldFetchPlaces, onCompleteFetch, onGetPlaceData]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 장소 클릭 시 상위로 선택된 장소 전달
  const handlePlaceClick = useCallback(
    (placeId: number) => {
      onPlaceSelect(placeId);
      if (isListExpanded && onListExpand) {
        onListExpand();
      }
    },
    [onPlaceSelect, isListExpanded, onListExpand],
  );

  if (isLoading && !isFetchingNextPage && previousPlacesRef.current.length === 0) {
    return (
      <SectionContainer>
        <LoadingContainer>
          <Loading size={50} />
        </LoadingContainer>
      </SectionContainer>
    );
  }

  if (isError) {
    return (
      <SectionContainer>
        <ErrorContainer>Error: {(error as Error).message}</ErrorContainer>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer ref={sectionRef}>
      {filteredPlaces.length === 0 ? (
        <>
          <ContentContainer>
            <Btn onClick={onSearchNearby}>
              <GrPowerCycle />
              현재 위치에서 장소정보 보기
            </Btn>
          </ContentContainer>
          <NoItem message="장소 정보가 없어요!" height={400} />
        </>
      ) : (
        <ContentContainer>
          <Btn onClick={onSearchNearby}>
            <GrPowerCycle />
            현재 위치에서 장소정보 보기
          </Btn>
          <PlacesGrid>
            {filteredPlaces.map((place) => (
              <PlaceItem
                key={place.placeId}
                {...place}
                onClick={() => handlePlaceClick(place.placeId)}
                isSelected={selectedPlaceId === place.placeId}
              />
            ))}
          </PlacesGrid>
          {(hasNextPage || isFetchingNextPage) && (
            <LoadMoreTrigger ref={loadMoreRef}>
              <Loading size={30} />
            </LoadMoreTrigger>
          )}
        </ContentContainer>
      )}
    </SectionContainer>
  );
}

const SectionContainer = styled.div`
  height: 600px;
  width: 100%;
  overflow-y: auto;
  padding-right: 4px;
  box-sizing: content-box;
  &::-webkit-scrollbar {
    width: 8px;
    color: #1f1f1f;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #1f1f1f;
    border-radius: 4px;
    border: none;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #1f1f1f;
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  @media screen and (max-width: 768px) {
    height: 100%;
    padding-right: 0;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0 10px 40px 16px;
    box-sizing: border-box;
  }
`;

const PlacesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  @media screen and (max-width: 430px) {
    gap: 8px;
  }
`;

const LoadMoreTrigger = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  margin-top: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: red;
`;

const Btn = styled.div`
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
    font-size: 14px;
  }

  color: #c3c3c3;
  border-radius: 0px;
  font-size: 16px;
  border-bottom: 0.5px solid #c3c3c3;
  width: fit-content;
  padding: 0px 4px;
  gap: 6px;
  cursor: pointer;
`;
