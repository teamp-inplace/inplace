import styled from 'styled-components';
import { SpotData } from '@/types';
import NoItem from '@/components/common/layouts/NoItem';
import SpotItem from '@/components/Main/SpotSection/SpotItem';
import Loading from '@/components/common/layouts/Loading';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

type Props = {
  items: SpotData[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};
export default function InfluencerVideoTap({ items, fetchNextPage, hasNextPage, isFetchingNextPage }: Props) {
  const loadMoreRef = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetchingNextPage });

  return (
    <Container>
      {items.length === 0 ? (
        <NoItem message="그곳 정보가 없어요!" alignItems="center" />
      ) : (
        <GridContainer>
          {items.map((item, index) => {
            const column = (index % 2) + 1;
            return (
              <GridItem key={item.videoId} $column={column}>
                <SpotItem
                  key={item.videoId}
                  videoId={item.videoId}
                  videoAlias={item.videoAlias}
                  videoUrl={item.videoUrl}
                  place={item.place}
                  isInfluencer
                />
              </GridItem>
            );
          })}
          {(hasNextPage || isFetchingNextPage) && (
            <LoadMoreTrigger ref={loadMoreRef}>{isFetchingNextPage ? <Loading size={30} /> : null}</LoadMoreTrigger>
          )}
        </GridContainer>
      )}
    </Container>
  );
}
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-row-gap: 60px;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    grid-row-gap: 40px;
  }
`;
const Container = styled.div``;
const LoadMoreTrigger = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  margin-top: 20px;
`;
const GridItem = styled.div<{ $column: number }>`
  justify-self: ${({ $column }) => ($column === 1 ? 'start' : 'end')};
  @media screen and (max-width: 768px) {
    justify-self: center;
  }
`;
