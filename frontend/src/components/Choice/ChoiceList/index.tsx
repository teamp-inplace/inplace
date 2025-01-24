import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ChoiceItem from '@/components/common/Items/ChoiceItem';
import { InfluencerData } from '@/types';
import NoItem from '@/components/common/layouts/NoItem';

interface ChoiceListProps {
  items: InfluencerData[];
  onToggleLike: (influencerId: number, isLiked: boolean) => void;
  selectedInfluencers: Set<number>;
}

export default function ChoiceList({ items, onToggleLike, selectedInfluencers }: ChoiceListProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayItems = isMobile ? items.slice(0, 9) : items;

  return displayItems.length === 0 ? (
    <NoItem message="인플루언서 정보가 없어요!" height={350} alignItems="center" />
  ) : (
    <GridContainer>
      {displayItems.map((influencer) => {
        return (
          <ChoiceItem
            key={influencer.influencerId}
            influencerId={influencer.influencerId}
            influencerName={influencer.influencerName}
            influencerImgUrl={influencer.influencerImgUrl}
            influencerJob={influencer.influencerJob}
            onToggleLike={onToggleLike}
            isSelected={selectedInfluencers.has(influencer.influencerId)}
          />
        );
      })}
    </GridContainer>
  );
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 26px;

  @media screen and (max-width: 768px) {
    margin: 0 auto;
    grid-template-columns: repeat(3, 110px);
    gap: 20px;
    justify-content: center;
    align-items: center;
  }
`;
