import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { fetchInstance } from '../instance';
import { PageableData, SpotData } from '@/types';

export const getInfluencerVideoPath = (id: string) => `/influencers/${id}/videos`;
export const getInfluencerVideo = async (id: string, page: number, size: number) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  const response = await fetchInstance.get<PageableData<SpotData>>(`${getInfluencerVideoPath(id)}?${params}`);
  return response.data;
};
export const useGetInfluencerVideo = (id: string, size: number) => {
  return useSuspenseInfiniteQuery({
    queryKey: ['influencerVideo', size],
    queryFn: ({ pageParam = 0 }) => getInfluencerVideo(id, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    staleTime: 1000 * 60 * 5,
  });
};
