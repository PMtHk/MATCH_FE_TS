import { useEffect, useState } from 'react';
import { authAxios, defaultAxios } from 'apis/utils';
import axios from 'axios';

import { promiseWrapper } from 'apis/utils/promiseWrapper';

/**
 * 배틀그라운드 닉네임으로 플랫폼 인증하기
 * @param nickname 배틀그라운드 닉네임
 * @returns 배틀그라운드 플랫폼
 */
export const checkPUBGUserPlatform = async (nickname: string) => {
  // 스팀 요청
  const steamResponse: any = await axios.get(
    `https://api.pubg.com/shards/steam/players?filter[playerNames]=${nickname}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PUBG_API_KEY}`,
        Accept: 'application/vnd.api+json',
      },
    },
  );

  // 카카오 요청
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

  // 플랫폼, 닉네임 객체로 반환
  const result = {
    nickname,
    platform,
  };

  return result;
};

/**
 * 배틀그라운드 닉네임 인증 요청 (서버)
 * @param nickname 배틀그라운드 닉네임
 * @param platform 배틀그라운드 플랫폼 (STEAM | KAKAO)
 * @returns 인증 성공 여부
 */
export const verifyPUBGNickname = async (
  nickname: string,
  platform: string,
) => {
  const response = await defaultAxios.get(
    `/api/pubg/user/exist/${nickname}/${platform}`,
  );

  if (response.status === 200) {
    return response.data;
  }

  return null;
};

/**
 *배틀그라운드 게시글들 불러오기
 * @param url 요청 url
 * @param config 요청 config
 * @param deps useEffect deps
 * @returns 배틀그라운드 게시글 목록
 */
export function fetchCardList(url: string, config: any, deps: any[]) {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = defaultAxios
        .get(url, config)
        .then((response) => response.data);
      setResource(promiseWrapper(promise));
    };

    getData();
  }, deps);

  return resource;
}

/**
 * 배틀그라운드 게시글 상세정보 불러오기
 * @param url 요청 url
 * @returns 게시글 상세 정보
 */
export function fetchCardDetail(url: string, deps: any[]) {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = defaultAxios.get(url).then((response) => response.data);
      setResource(promiseWrapper(promise));
    };

    getData();
  }, deps);

  return resource;
}

/**
 * 배틀그라운드 플레이어 전적 불러오기 trigger
 * @param name 배틀그라운드 닉네임
 * @param platform 배틀그라운드 플랫폼
 * @returns
 */
export const loadPubgPlayerInfoIntoDB = async (
  name: string,
  platform: string,
) => {
  const response = await defaultAxios.get(`/api/pubg/user/${name}/${platform}`);

  if (response.status === 200) {
    return 'success';
  }

  return null;
};
