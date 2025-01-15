import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Text } from '@/components/common/typography/Text';

export default function InfluencerInfoPage() {
  const { id } = useParams() as { id: string };
  return (
    <PageContainer>
      <Text size="l" weight="bold" variant="white">
        인플루언서 {id}
      </Text>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  padding: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
