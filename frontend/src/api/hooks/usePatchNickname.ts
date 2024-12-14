import { useMutation } from '@tanstack/react-query';

import { fetchInstance } from '../instance';

export const patchNicknamePath = () => `/user/nickname`;
const patchNickname = async (nickname: string) => {
  const params = new URLSearchParams({
    nickname: nickname.toString(),
  });
  const response = await fetchInstance.patch(`${patchNicknamePath()}?${params}`, {}, { withCredentials: true });
  return response.data;
};

export const usePatchNickname = () => {
  return useMutation({
    mutationFn: (nickname: string) => patchNickname(nickname),
  });
};
