import { useEffect, useState } from 'react';
import { authAxios, defaultAxios } from 'apis/utils';
import {
  getDatabase,
  push,
  ref,
  update,
  child,
  set,
  get,
} from 'firebase/database';

import { addMemberToFirebaseDB } from './firebase';

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
  await defaultAxios.get(`/api/overwatch/user/${nickname}%23${battleTag}`);

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

/**
 * 파티장이 직접 파티원 추가
 * @param cardId 게시글id
 * @param chatRoomId 채팅방 id
 * @param nickname 추가하려는 사용자 닉네임
 * @param battleTag 추가하려는 사용자 배틀태그
 * @returns null
 */

export const addPartyMemberWithName = async (
  cardId: number,
  chatRoomId: string,
  nickname: string,
  battleTag: string,
) => {
  await authAxios.post(
    `/api/chat/overwatch/${cardId}/${nickname}%23${battleTag}`,
  );

  await addMemberToFirebaseDB(chatRoomId, {
    nickname: `${nickname}#${battleTag}`,
    oauth2Id: '',
    notiToken: '',
    isReviewed: false,
  });

  return null;
};

/**
 * 파티장이 파티원 강퇴
 * @param cardId 게시글 id
 * @param chatRoomId 채팅방 id
 * @param nickname 강퇴하려는 사용자 닉네임
 * @param battleTag 강퇴하려는 사용자 배틀태그
 * @param game 해당 게임
 */
export const kickMemberFromParty = async (
  cardId: number,
  chatRoomId: string,
  nickname: string,
  battleTag: string,
) => {
  await authAxios.delete(
    `/api/chat/overwatch/${cardId}/${nickname}%23${battleTag}/ban`,
  );

  const chatRoomsRef = ref(getDatabase(), 'chatRooms');
  const messagesRef = ref(getDatabase(), 'messages');
  const dataSnapshot: any = await get(child(chatRoomsRef, chatRoomId));

  const prevMemberList = [...dataSnapshot.val().memberList];

  const target = prevMemberList.find(
    (member) => member.nickname === `${nickname}#${battleTag}`,
  );

  const prevBannedList = dataSnapshot.val().bannedList
    ? [...dataSnapshot.val().bannedList]
    : [];
  const newMemberList = prevMemberList.filter(
    (member) => member.nickname !== `${nickname}#${battleTag}`,
  );
  const newBannedList = [...prevBannedList, target];

  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    memberList: newMemberList,
    bannedList: newBannedList,
  });

  await set(push(child(messagesRef, chatRoomId)), {
    type: 'system',
    timestamp: Date.now(),
    user: { nickname: 'system', oauth2Id: '', notiToken: '' },
    content: `${nickname}#${battleTag} 님이 퇴장하였습니다.`,
  });
};
