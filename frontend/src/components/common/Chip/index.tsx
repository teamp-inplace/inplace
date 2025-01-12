import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import { Text } from '@/components/common/typography/Text';

type SelectedOption = {
  main: string;
  sub?: string;
  lat?: number;
  lng?: number;
};

type Props = {
  selectedLocations: SelectedOption[];
  selectedInfluencers: string[];
  onClearLocation: (option: SelectedOption) => void;
  onClearInfluencer: (influencer: string) => void;
};

export default function Chip({ selectedLocations, selectedInfluencers, onClearLocation, onClearInfluencer }: Props) {
  if (selectedLocations.length === 0 && selectedInfluencers.length === 0) {
    return (
      <Container>
        <FilterChip>
          <Text size="xs" weight="bold" variant="#36617f">
            전체 보기
          </Text>
        </FilterChip>
      </Container>
    );
  }

  return (
    <Container>
      {selectedLocations.map((location) => (
        <FilterChip key={`${location.main}-${location.sub}`}>
          <Text size="xs" weight="bold" variant="#36617f">
            {location.sub ? `${location.main} > ${location.sub}` : location.main}
          </Text>
          <ClearButton onClick={() => onClearLocation(location)}>
            <IoClose size={14} />
          </ClearButton>
        </FilterChip>
      ))}

      {selectedInfluencers.map((influencer) => (
        <FilterChip key={influencer}>
          <Text size="xs" weight="bold" variant="#36617f">
            {influencer}
          </Text>
          <ClearButton onClick={() => onClearInfluencer(influencer)}>
            <IoClose size={14} />
          </ClearButton>
        </FilterChip>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const FilterChip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  background-color: #e8f9ff;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 50%;
  cursor: pointer;
  background: none;
  border: none;
  color: inherit;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
