import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Text } from '@/components/common/typography/Text';
import BaseLayout from '@/components/common/BaseLayout';
import { useGetAllInfluencers } from '@/api/hooks/useGetAllInfluencers';
import { usePostMultipleInfluencerLike } from '@/api/hooks/usePostMultipleInfluencerLike';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';
import InfluencerSearchBar from '@/components/common/InfluencerSearchBar';
import { useGetSearchInfluencers } from '@/api/hooks/useGetSearchInfluencers';
import useDebounce from '@/hooks/useDebounce';

export default function ChoicePage() {
  const navigate = useNavigate();
  const { mutateAsync: postMultipleLikes } = usePostMultipleInfluencerLike();
  const [selectedInfluencers, setSelectedInfluencers] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const isFirstUser = document.cookie
      .split('; ')
      .find((row) => row.startsWith('is_first_user='))
      ?.split('=')[1];

    if (isFirstUser !== 'true') {
      navigate('/', { replace: true });
      return;
    }
    document.cookie = 'is_first_user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.inplace.my; Secure';
  }, [navigate]);

  const debouncedInputValue = useDebounce(inputValue, 300);

  const { data: allInfluencersData } = useGetAllInfluencers({
    page: currentPage - 1,
    size: 10,
  });

  const { data: filteredData } = useGetSearchInfluencers({
    value: debouncedInputValue,
    page: currentPage - 1,
    size: 10,
  });
  const pageableData = debouncedInputValue ? filteredData : allInfluencersData;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedInputValue]);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  const handleSkip = () => {
    navigate('/');
  };

  const handleStart = async () => {
    try {
      if (selectedInfluencers.size > 0) {
        await postMultipleLikes({
          influencerIds: Array.from(selectedInfluencers),
          likes: true,
        });
      }
      navigate('/');
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
      navigate('/');
    }
  };

  const handleToggleLike = (influencerId: number, isLiked: boolean) => {
    setSelectedInfluencers((prev) => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.add(influencerId);
      } else {
        newSet.delete(influencerId);
      }
      return newSet;
    });
  };

  return (
    <PageContainer>
      <Text size="l" weight="bold" variant="white">
        관심 있는{' '}
        <Text size="28px" weight="bold" variant="mint">
          인플루언서
        </Text>
        를 선택하세요!
      </Text>
      <InfluencerSearchBar inputValue={inputValue} setInputValue={setInputValue} />
      <LayoutWrapper>
        <BaseLayout
          type="influencer"
          mainText=""
          SubText=""
          items={pageableData?.content || []}
          showMoreButton={false}
          isChoice
          onToggleLike={handleToggleLike}
          selectedInfluencers={selectedInfluencers}
        />
      </LayoutWrapper>
      <Pagination
        currentPage={currentPage}
        totalPages={pageableData?.totalPages || 0}
        totalItems={pageableData?.totalElements}
        onPageChange={handlePageChange}
        itemsPerPage={pageableData?.pageable.pageSize}
      />
      <ButtonWrapper>
        <Button
          aria-label="skip_btn"
          variant="white"
          style={{ fontWeight: 'bold', width: '170px', height: '46px', fontSize: '18px' }}
          onClick={handleSkip}
        >
          건너뛰기
        </Button>
        <Button
          aria-label="start_btn"
          variant="mint"
          style={{ fontWeight: 'bold', width: '170px', height: '46px', fontSize: '18px' }}
          onClick={handleStart}
        >
          시작하기
        </Button>
      </ButtonWrapper>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  padding: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const LayoutWrapper = styled.div`
  margin-bottom: 60px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 960px;
  margin-bottom: 30px;
`;
