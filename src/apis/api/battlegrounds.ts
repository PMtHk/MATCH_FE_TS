import { useEffect, useState } from 'react';
import { defaultAxios, authAxios } from 'apis/utils';

import { promiseWrapper } from 'apis/utils/promiseWrapper';

/**
 *배틀그라운드 게시글 불러오기
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
export function fetchCardDetail(url: string) {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = defaultAxios.get(url).then((response) => response.data);
      setResource(promiseWrapper(promise));
    };

    getData();
  }, []);

  return resource;
}

/**
 *배틀그라운드 닉네임으로 사용자 존재 여부 인증받기
 * @param name 배틀그라운드 닉네임
 * @param platform 배틀그라운드 플랫폼
 * @returns 닉네임 인증 성공 여부
 */
export const getExactPubgPlayerName = async (
  name: string,
  platform: string,
) => {
  const response = await defaultAxios.get(
    `/api/pubg/user/exist/${name}/${platform}`,
  );

  if (response.status === 200) {
    return response.data;
  }

  return null;
};

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
