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
  // if (selectedLocations.length === 0 && selectedInfluencers.length === 0) {
  //   return (
  //     <Container>
  //       <FilterChip hasButton={false}>
  //         <Text size="xs" weight="bold" variant="#36617f">
  //           전체 보기
  //         </Text>
  //       </FilterChip>
  //     </Container>
  //   );
  // }

  return (
    <Container>
      {selectedLocations.map((location) => (
        <FilterChip $hasButton key={`${location.main}-${location.sub}`}>
          <Text size="xs" weight="bold" variant="#36617f">
            {location.sub ? `${location.main} > ${location.sub}` : location.main}
          </Text>
          <ClearButton onClick={() => onClearLocation(location)}>
            <IoClose size={14} />
          </ClearButton>
        </FilterChip>
      ))}

      {selectedInfluencers.map((influencer) => (
        <FilterChip $hasButton key={influencer}>
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

const FilterChip = styled.div<{ $hasButton: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$hasButton ? 'space-between' : 'center')};
  padding: ${(props) => (props.$hasButton ? '8px 12px 8px 20px' : '8px 20px')};
  height: 24px;
  border-radius: 18px;
  background-color: #e8f9ff;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
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
