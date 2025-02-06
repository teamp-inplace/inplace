import styled from 'styled-components';
import { categoryMapping } from '@/utils/constants/CategoryOptions';

interface DropdownItemProps {
  label: string;
  onClick: () => void;
  type: 'location' | 'influencer' | 'category';
  isSelected?: boolean;
  children?: React.ReactNode;
}

export default function DropdownItem({ label, onClick, children, type, isSelected }: DropdownItemProps) {
  const displayLabel = type === 'category' ? categoryMapping[label as keyof typeof categoryMapping] : label;

  return (
    <DropdownItems onClick={onClick} type={type} $isSelected={isSelected}>
      {displayLabel}
      {children}
    </DropdownItems>
  );
}

const DropdownItems = styled.div<{ type: 'location' | 'influencer' | 'category'; $isSelected?: boolean }>`
  padding: 10px 16px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${(props) => (props.$isSelected ? '#e6f0ff' : 'transparent')};

  &:hover {
    background-color: ${(props) => (props.$isSelected ? '#d1e5ff' : '#f0f0f0')};
  }

  @media screen and (max-width: 768px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;
