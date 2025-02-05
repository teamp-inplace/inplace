import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchInstance } from '../instance';

interface Influencer {
  influencerName: string;
}

const useGetDropdownName = () => {
  return useSuspenseQuery({
    queryKey: ['influencersName'],
    queryFn: async () => {
      const { data } = await fetchInstance.get<Influencer[]>('/influencers/names');
      return data.map((influencer) => ({
        label: influencer.influencerName,
      }));
    },
    refetchOnMount: 'always',
  });
};

export default useGetDropdownName;
