import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import Review from '@/components/Detail/ReviewTap/Review';

const initialReviews = [
  {
    reviewId: 1,
    likes: true,
    comment: '정말 좋았어요! 다음에 또 오고 싶습니다',
    userNickname: '사용자1',
    createdDate: new Date('2024-10-01T12:00:00Z'),
    mine: true,
  },
  {
    reviewId: 2,
    likes: false,
    comment: '별로였어요. 개선이 필요합니다.',
    userNickname: '사용자2',
    createdDate: new Date('2024-10-02T15:30:00Z'),
    mine: false,
  },
  {
    reviewId: 3,
    likes: true,
    comment: '맛있고 분위기도 좋았습니다',
    userNickname: '사용자3',
    createdDate: new Date('2024-10-03T09:15:00Z'),
    mine: false,
  },
  {
    reviewId: 4,
    likes: false,
    comment: '서비스가 아쉬웠습니다',
    userNickname: '사용자4',
    createdDate: new Date('2024-10-03T11:45:00Z'),
    mine: true,
  },
];
const queryClient = new QueryClient();

function TestComponent() {
  const [reviews, setReviews] = useState(initialReviews);

  const handleDelete = (id: number) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review.reviewId !== id));
    window.alert('삭제되었습니다.');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Review items={reviews} onDelete={handleDelete} />
    </QueryClientProvider>
  );
}

test('리뷰 삭제가 반영되는지 확인', async () => {
  window.confirm = jest.fn().mockImplementation(() => true);
  window.alert = jest.fn();

  render(<TestComponent />);

  expect(screen.getByText('정말 좋았어요! 다음에 또 오고 싶습니다')).toBeInTheDocument();

  const deleteButton = screen.getAllByRole('button', { name: 'delete_btn' });
  fireEvent.click(deleteButton[0]);

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('삭제되었습니다.');
  });

  await waitFor(() => {
    expect(screen.queryByText('정말 좋았어요! 다음에 또 오고 싶습니다')).not.toBeInTheDocument();
  });
});
