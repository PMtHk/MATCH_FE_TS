import { useEffect, useState } from 'react';
import { authAxios, defaultAxios } from 'apis/utils';

import { promiseWrapper } from 'apis/utils/promiseWrapper';

export const verifyOWNickname = async (nickname: string, battleTag: string) => {
  const response = await defaultAxios.get(
    `/api/overwatch/user/exist/${nickname}/${battleTag}`,
  );

  const exactNickname = response.data;

  return exactNickname;
};
