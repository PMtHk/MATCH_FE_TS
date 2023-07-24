import { useEffect, useState } from 'react';
import { authAxios, defaultAxios } from 'apis/utils';

import { ref, getDatabase, child, get, update } from 'firebase/database';

import { promiseWrapper } from 'apis/utils/promiseWrapper';

/**
 * 리그오브레전드 소환사명 존재 여부 확인 및 정확한 소환사명 반환
 * @param nickname 리그오브레전드 닉네임
 * @returns 닉네임의 정확한 표기
 */

export const verifyLOLNickname = async (nickname: string) => {
  const response = await defaultAxios.get(`/api/lol/user/exist/${nickname}`);

  const exactNickname: string = response.data;

  return exactNickname;
};

/**
 * 리그오브레전드 게시글 불러오기
 * @param url 요청 url
 * @param config 요청 config
 * @param deps useEffect deps
 * @returns - 리그오브레전드 게시글 목록
 *
 * 리그오브레전드 게시글을 불러온다.
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
 * 리그오브레전드 게시글 상세보기 불러오기
 * @param url
 * @returns - 리그오브레저드 게시글 상세보기
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
 * 리그오브레전드 소환사의 전적 불러오기 trigger
 * @param summonerName
 * @returns null
 */

export const loadSummonerInfoIntoDB = async (summonerName: string) => {
  const response = await defaultAxios.get(`/api/lol/user/${summonerName}`);

  return null;
};

/**
 * 파티장이 소환사 명으로 파티인원 추가
 * @param cardId 카드 번호
 * @param nicknameToAdd 추가하려는 사용자 닉네임
 * @returns null
 */

export const addPartyMemberWithSummonerName = async (
  cardId: number,
  nicknameToAdd: string,
) => {
  await authAxios.post(`/api/chat/lol/${cardId}/${nicknameToAdd}`);

  return null;
};

export const kickMemberFromParty = async (
  cardId: number,
  chatRoomId: string,
  summonerName: string,
) => {
  await authAxios.delete(`/api/chat/lol/${cardId}/${summonerName}/ban`);

  const chatRoomsRef = ref(getDatabase(), 'chatRooms');
  const dataSnapshot: any = await get(child(chatRoomsRef, chatRoomId));

  const prevMemberList = [...dataSnapshot.val().memberList];

  const target = prevMemberList.find(
    (member) => member.nickname === summonerName,
  );
  console.log(target);

  const prevBannedList = dataSnapshot.val().bannedList
    ? [...dataSnapshot.val().bannedList]
    : [];
  const newMemberList = prevMemberList.filter(
    (member) => member.nickname !== summonerName,
  );
  const newBannedList = [...prevBannedList, target];

  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    memberList: newMemberList,
    bannedList: newBannedList,
  });
};
