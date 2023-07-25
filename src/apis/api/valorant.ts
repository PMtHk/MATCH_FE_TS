import { useEffect, useState } from 'react';
import { authAxios, defaultAxios } from 'apis/utils';

import { promiseWrapper } from 'apis/utils/promiseWrapper';

export const verifyVLRTNickname = async (nickname: string) => {
  const response = await defaultAxios.get(
    `/api/valorant/user/exist/${nickname}`,
  );

  const exactNickname = response.data;

  return exactNickname;
};
