import { useEffect, useState } from 'react';
import { authAxios, defaultAxios } from 'apis/utils';
import axios from 'axios';

import { promiseWrapper } from 'apis/utils/promiseWrapper';

export const checkPUBGUserPlatform = async (nickname: string) => {
  const steamResponse: any = await axios.get(
    `https://api.pubg.com/shards/steam/players?filter[playerNames]=${nickname}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PUBG_API_KEY}`,
        Accept: 'application/vnd.api+json',
      },
    },
  );

  const kakaoResponse: any = await axios.get(
    `https://api.pubg.com/shards/kakao/players?filter[playerNames]=${nickname}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PUBG_API_KEY}`,
        Accept: 'application/vnd.api+json',
      },
    },
  );

  let platform =
    steamResponse.data.data[0].relationships.matches.data.length >=
    kakaoResponse.data.data[0].relationships.matches.data.length
      ? 'STEAM'
      : 'KAKAO';

  if (
    steamResponse.data.data[0].relationships.matches.data.length ===
    kakaoResponse.data.data[0].relationships.matches.data.length
  ) {
    platform = '';
  }

  const result = {
    nickname,
    platform,
  };

  return result;
};

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
