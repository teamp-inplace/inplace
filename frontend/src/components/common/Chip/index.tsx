import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import { Text } from '@/components/common/typography/Text';
import { categoryMapping } from '@/utils/constants/CategoryOptions';

type SelectedOption = {
  main: string;
  sub?: string;
  lat?: number;
  lng?: number;
};

type Props = {
  selectedLocations: SelectedOption[];
  selectedInfluencers: string[];
  selectedCategories: string[];
  onClearLocation: (option: SelectedOption) => void;
  onClearInfluencer: (influencer: string) => void;
  onClearCategory: (category: string) => void;
};

export default function Chip({
  selectedLocations,
  selectedInfluencers,
  selectedCategories,
  onClearLocation,
  onClearInfluencer,
  onClearCategory,
}: Props) {
  return (
    <Container>
      {selectedLocations.map((location) => (
        <FilterChip key={`${location.main}-${location.sub}`}>
          <Text size="xs" weight="bold" variant="#36617f">
            {location.sub ? `${location.main} > ${location.sub}` : location.main}
          </Text>
          <ClearButton aria-label="loca-clear_btn" onClick={() => onClearLocation(location)}>
            <IoClose size={14} />
          </ClearButton>
        </FilterChip>
      ))}

      {selectedInfluencers.map((influencer) => (
        <FilterChip key={influencer}>
          <Text size="xs" weight="bold" variant="#36617f">
            {influencer}
          </Text>
          <ClearButton aria-label="infl-clear_btn" onClick={() => onClearInfluencer(influencer)}>
            <IoClose size={14} />
          </ClearButton>
        </FilterChip>
      ))}

      {selectedCategories.map((category) => (
        <FilterChip key={category}>
          <Text size="xs" weight="bold" variant="#36617f">
            {categoryMapping[category as keyof typeof categoryMapping]}
          </Text>
          <ClearButton aria-label="cate-clear_btn" onClick={() => onClearCategory(category)}>
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
  gap: 12px;
  margin: 20px 0;
  @media screen and (max-width: 768px) {
    margin: 14px 0;
  }
`;

const FilterChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: 'space-between';
  padding: 6px 10px 6px 18px;
  height: 24px;
  border-radius: 18px;
  background-color: #e8f9ff;

  @media screen and (max-width: 768px) {
    padding: 4px 10px 4px 14px;
    font-size: 14px;
  }
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
