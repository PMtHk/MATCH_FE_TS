import { useEffect, useState } from 'react';
import { authAxios, defaultAxios } from 'apis/utils';

import { promiseWrapper } from 'apis/utils/promiseWrapper';

export const verifyPUBGNickname = async (
  nickname: string,
  platform: string,
) => {
  const response = await defaultAxios.get(
    `/api/pubg/user/exist/${nickname}/${platform}`,
  );

  const exactNickname = response.data;

  return exactNickname;
};
