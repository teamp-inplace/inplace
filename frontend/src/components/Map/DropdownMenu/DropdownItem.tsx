import styled from 'styled-components';

interface DropdownItemProps {
  label: string;
  onClick: () => void;
  type: 'location' | 'influencer' | 'category';
  isSelected?: boolean;
  isFiltered?: boolean;
  children?: React.ReactNode;
}

export default function DropdownItem({ label, onClick, children, type, isSelected, isFiltered }: DropdownItemProps) {
  return (
    <DropdownItems onClick={onClick} type={type} $isSelected={isSelected} $isFiltered={isFiltered}>
      {label}
      {children}
    </DropdownItems>
  );
}

const DropdownItems = styled.div<{
  type: 'location' | 'influencer' | 'category';
  $isSelected?: boolean;
  $isFiltered?: boolean;
}>`
  padding: 10px 16px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${(props) => {
    if (props.$isFiltered) return '#e8f9ff';
    if (props.$isSelected) return '#e6f0ff';
    return 'transparent';
  }};

  &:hover {
    background-color: ${(props) => (props.$isSelected ? '#d1e5ff' : '#f0f0f0')};
  }

  @media screen and (max-width: 768px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;
