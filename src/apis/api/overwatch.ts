import { useEffect, useState } from 'react';
import { authAxios, defaultAxios } from 'apis/utils';

import { promiseWrapper } from 'apis/utils/promiseWrapper';
import { cardActions } from 'store/card-slice';

// 카드 리스트 가져오기 (게시글 목록 가져오기)
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

// 카드 디테일 가져오기 (카드 상세보기 가져오기)
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

export const verifyOWNickname = async (nickname: string, battleTag: string) => {
  const response = await defaultAxios.get(
    `/api/overwatch/user/exist/${nickname}%23${battleTag}`,
  );

  const exactNickname = response.data;

  return exactNickname;
};

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
