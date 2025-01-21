import styled from 'styled-components';

interface DropdownItemProps {
  label: string;
  onClick: () => void;
  type: 'location' | 'influencer';
  isSelected?: boolean;
  children?: React.ReactNode;
}

export default function DropdownItem({ label, onClick, children, type, isSelected }: DropdownItemProps) {
  return (
    <DropdownItems onClick={onClick} type={type} $isSelected={isSelected}>
      {label}
      {children}
    </DropdownItems>
  );
}

const DropdownItems = styled.div<{ type: 'location' | 'influencer'; $isSelected?: boolean }>`
  padding: 10px 16px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${(props) => (props.$isSelected ? '#e6f0ff' : 'transparent')};

  &:hover {
    background-color: ${(props) => (props.$isSelected ? '#d1e5ff' : '#f0f0f0')};
  }
`;
