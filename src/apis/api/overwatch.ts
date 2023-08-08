import { useEffect, useState } from 'react';
import { authAxios, defaultAxios } from 'apis/utils';

import { promiseWrapper } from 'apis/utils/promiseWrapper';

/**
 * 오버워치 게시글 불러오기
 * @param url 요청 url
 * @param config 요청 config
 * @param deps useEffect deps
 * @returns - 오버워치 게시글 목록
 *
 * 오버워치 게시글을 불러온다.
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
 * 오버워치 게시글 상세보기 불러오기
 * @param url
 * @returns - 오버워치 게시글 상세보기
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
 * 오버워치 사용자명 존재 여부 확인 및 true나 false 반환
 * @param nickname 닉네임
 * @param battleTag 배틀태그
 * @returns 일치하는 닉네임이 있으면 true, 없으면 false
 */
export const verifyOWNickname = async (nickname: string, battleTag: string) => {
  const response = await defaultAxios.get(
    `/api/overwatch/user/exist/${nickname}%23${battleTag}`,
  );

  const exactNickname = response.data;

  return exactNickname;
};

/**
 * 오버워치 플레이어의 전적 불러오기 trigger
 * @param nickname 닉네임
 * @param battleTag 배틀태그
 * @returns null
 */
export const loadOWPlayerInfoInDB = async (
  nickname: string,
  battleTag: string,
) => {
  const response = await defaultAxios.get(
    `/api/overwatch/user/${nickname}%23${battleTag}`,
  );

  if (response.status === 200) {
    return 'success';
  }

  return null;
};

/**
 * 오버워치 파티원 정보 가져오기
 */

export const fetchPlayerInfo = async (
  nickname: string,
  battleTag: string,
  type: string,
) => {
  const response = await defaultAxios.get(
    `/api/overwatch/player/${nickname}%23${battleTag}/${type}`,
  );

  return response.data;
};
