import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  ref,
  child,
  get,
  getDatabase,
  update,
  set,
  push,
  DatabaseReference,
} from 'firebase/database';

import { promiseWrapper } from 'apis/utils/promiseWrapper';
import { notificationActions } from 'store/notification-slice';
import { CHATROOM, MEMBER } from 'types/chats';

/**
 * 해당 채팅방 차단 여부 확인
 *
 * @param {string} chatRoomId 채팅방 아이디
 * @param {string} oauth2Id 사용자 oauth2Id
 * @return {boolean} 해당 채팅방의 요청자 차단 여부
 *
 * @example
 * ```typescript
 * const isBanned = await isBanned('fb-chatRoomId', 'oauth2Id');
 * console.log(isBanned); // true or false
 * ```
 */

export const isBanned = async (chatRoomId: string, oauth2Id: string) => {
  const chatRoomRef = ref(getDatabase(), 'chatRooms');

  const isBanned: boolean = await get(child(chatRoomRef, chatRoomId)).then(
    (datasnapshot) => {
      const bannedList = datasnapshot.val().bannedList
        ? datasnapshot.val().bannedList
        : [];
      const bannedOauth2IdList = bannedList.map(
        (member: MEMBER) => member.oauth2Id,
      );
      if (bannedOauth2IdList.includes(oauth2Id)) {
        return true;
      }
      return false;
    },
  );

  return isBanned;
};

/**
 * FB realtimeDB 내 해당 채팅방 멤버 추가
 *
 * @param {string} chatRoomId 채팅방 아이디
 * @param {MEMBER} newMember 새로운 멤버 객체
 * @returns null
 *
 * @example
 * ```typescript
 * const result = await addMemberToFirebaseDB(
 *    'fb-chatRoomId',
 *    { nickname: '완도수산새우도둑',
 *      oauth2Id: 'kakao1234',
 *      notiToken: 'abcdefg'
 *      isReviewed: false
 *    }); // member added
 * console.log(result); // { chatRoomId: 'fb-chatRoomId', firstRead: 123456789 }
 * ```
 */

export const addMemberToFirebaseDB = async (
  chatRoomId: string,
  newMember: MEMBER,
) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');
  const messagesRef = ref(getDatabase(), 'messages');
  const firstReadRef = ref(getDatabase(), 'firstRead');
  const lastReadRef = ref(getDatabase(), 'lastRead');

  const dataSnapshot = await get(child(chatRoomsRef, chatRoomId));

  const prevMemberList = [];
  prevMemberList.push(...dataSnapshot.val().memberList);
  const joinedMemberList = [...prevMemberList, newMember];

  // FB realtimeDB의 해당 채팅방 정보에 파티원 추가
  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    memberList: joinedMemberList,
  });

  // 참가한 사용자의 lastRead에 해당 채팅방 추가 및 참가 시간 업데이트
  await set(
    child(lastReadRef, `${newMember.oauth2Id}/${chatRoomId}`),
    Date.now(),
  );

  // 채팅방에 해당 사용자가 참가했다는 시스템 메시지 전송
  await set(push(child(messagesRef, chatRoomId)), {
    type: 'system',
    timestamp: Date.now(),
    user: {
      nickname: 'system',
      oauth2Id: '',
      notitoken: '',
    },
    content: `${newMember.nickname} 님이 참가하였습니다.`,
  });

  // 참가한 사용자의 firstRead 업데이트
  await set(
    child(firstReadRef, `${newMember.oauth2Id}/${chatRoomId}`),
    Date.now(),
  );

  // 업데이트 된 firstRead 가져오기
  const firstRead = await getFirstRead(newMember.oauth2Id, chatRoomId);

  const result = {
    chatRoomId,
    firstRead,
  };

  return result;
};

/**
 * FB realtimeDB 내 멤버 삭제
 *
 * @param {string} chatRoomId
 * @param {string} targetOauth2Id
 * @returns null
 *
 * @example
 * ```typescript
 * await removeMemberFromFirebaseDB(
 *   'fb-chatRoomId',
 *   'oauth2Id',
 * ); // member with 'oauth2Id' removed from chatroom 'fb-chatRoomId'
 * ```
 */

export const removeMemberFromFirebaseDB = async (
  chatRoomId: string,
  targetOauth2Id: string,
) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');
  const messagesRef = ref(getDatabase(), 'messages');
  const firstReadRef = ref(getDatabase(), 'firstRead');

  // FB realtimeDB에서 기존 멤버리스트 가져오기
  const memberList = await get(
    child(chatRoomsRef, `${chatRoomId}/memberList`),
  ).then((dataSnapshot) => dataSnapshot.val());

  const prevMemberList = [...memberList];
  const newMemberList = prevMemberList.filter((member: MEMBER) => {
    return member.oauth2Id !== targetOauth2Id;
  });

  const targetMember = prevMemberList.find(
    (member: MEMBER) => member.oauth2Id === targetOauth2Id,
  );

  // targetOauth2Id를 가진 사용자를 제외한 멤버리스트로 업데이트
  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    memberList: newMemberList,
  });

  // 채팅방에 해당 사용자가 퇴장했다는 시스템 메시지 전송
  await set(push(child(messagesRef, chatRoomId)), {
    type: 'system',
    timestamp: Date.now(),
    user: {
      nickname: 'system',
      oauth2Id: '',
      notiToken: '',
    },
    content: `${targetMember.nickname} 님이 퇴장하였습니다.`,
  });

  // 해당 사용자의 firstRead 초기화
  await set(
    child(firstReadRef, `${targetOauth2Id}/${chatRoomId}`),
    9999999999999,
  );

  return null;
};

/**
 * 채팅방 삭제 여부 확인
 *
 * @deprecated not used
 *
 * @param {string} chatRoomId 채팅방 아이디
 * @returns {boolean} 채팅방 삭제 여부
 *
 * @example
 * ```typescript
 * const isDeleted = await getIsDeleted('fb-chatRoomId');
 * console.log(isDeleted); // true or false
 * ```
 */

export const getIsDeleted = async (chatRoomId: string) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');

  const isDeleted = await get(child(chatRoomsRef, chatRoomId)).then((res) => {
    return res.val().isDeleted;
  });

  return isDeleted;
};

/**
 * 사용자의 해당 채팅방 lastRead 최신화
 *
 * @param {string} oauth2Id 사용자 oauth2Id
 * @param {string} chatRoomId 채팅방 아이디
 * @returns null
 *
 * @example
 * ```typescript
 * await updateALastRead('oauth2Id', 'fb-chatRoomId'); // lastRead updated
 * ```
 */

export const updateALastRead = async (oauth2Id: string, chatRoomId: string) => {
  const lastReadRef = ref(getDatabase(), 'lastRead');

  await set(child(lastReadRef, `${oauth2Id}/${chatRoomId}`), Date.now());

  return null;
};

/**
 * 사용자의 모든 채팅방 lastRead 최신화
 *
 * @param {string} oauth2Id 사용자 oauth2Id
 * @param {CHATROOM[]} joinedChatRoomsId 사용자가 참여한 채팅방 아이디 목록
 * @returns null
 *
 * @example
 * ```typescript
 * await updateLastReads('oauth2Id', ['fb-chatRoomId1', 'fb-chatRoomId2']); // all lastRead updated
 * ```
 */

export const updateLastReads = async (
  oauth2Id: string,
  joinedChatRoomsId: CHATROOM[],
) => {
  const lastReadRef = ref(getDatabase(), 'lastRead');

  joinedChatRoomsId.forEach(async (aChatRoom) => {
    await set(
      child(lastReadRef, `${oauth2Id}/${aChatRoom.chatRoomId}`),
      Date.now(),
    );
  });

  return null;
};

/**
 * FB realtimeDB 내 채팅방 정보 가져오기
 *
 * @param {string} chatRoomId 채팅방 아이디
 * @returns 채팅방 정보
 *
 * @example
 * ```typescript
 * const chatRoomInfo = await getAChatRoomInfo('fb-chatRoomId');
 * console.log(chatRoomInfo); // { game: 'lol', roomId: 123, content: 'abc', ... }
 * ```
 */

export const getAChatRoomInfo = async (chatRoomId: string) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');

  const fetchedChatRoom = await get(child(chatRoomsRef, chatRoomId)).then(
    (res) => res.val(),
  );

  return fetchedChatRoom;
};

/**
 * 사용자의 모든 가입 채팅방의 lastRead 최신화
 *
 * @deprecated Use {@link updateLastReads} instead
 *
 * @param {string} oauth2Id 사용자의 oauth2Id
 * @param {CHATROOM[]} chatRoomList 사용자가 참여한 채팅방 목록
 * @param {ReturnType<typeof useDispatch>}dispatch 리덕스 디스패치 함수
 * @returns null
 *
 * @example
 * ```typescript
 * await getAllLastReads('oauth2Id', ['fb-chatRoomId1', 'fb-chatRoomId2'], dispatch); // all lastRead updated
 * ```
 */

export const getAllLastReads = async (
  oauth2Id: string,
  chatRoomList: CHATROOM[],
  dispatch: ReturnType<typeof useDispatch>,
) => {
  const lastReadRef = ref(getDatabase(), 'lastRead');

  chatRoomList.map(async (aChatRoom) => {
    const dataSnapshot = await get(
      child(lastReadRef, `${oauth2Id}/${aChatRoom.chatRoomId}`),
    );

    dispatch(
      notificationActions.SET_TIMESTAMPS({
        chatRoomId: aChatRoom.chatRoomId,
        timestamp: dataSnapshot.val(),
      }),
    );
  });

  return null;
};

/**
 * 사용자의 해당 채팅방의 lastRead 가져오기
 *
 * @param {string} oauth2Id 사용자 oauth2Id
 * @param {string} chatRoomId 채팅방 아이디
 * @returns 사용자의 해당 채팅방의 lastRead
 *
 * @example
 * ```typescript
 * const lastRead = await getALastRead('oauth2Id', 'fb-chatRoomId');
 * console.log(lastRead); // 123456789
 * ```
 */

export const getALastRead = async (oauth2Id: string, chatRoomId: string) => {
  const lastReadRef = ref(getDatabase(), 'lastRead');

  const lastRead = await get(
    child(lastReadRef, `${oauth2Id}/${chatRoomId}`),
  ).then((res) => res.val());

  return lastRead;
};

/**
 * 사용자의 해당 채팅방 리뷰 여부 확인
 *
 * @param {string} oauth2Id 사용자 oauth2Id
 * @param {string} chatRoomId 채팅방 아이디
 * @returns 사용자의 해당 채팅방 리뷰 여부
 *
 * @example
 * ```typescript
 * const isReviewed = await asyncGetIsReviewed('oauth2Id', 'fb-chatRoomId');
 * console.log(isReviewed); // true or false
 * ```
 */

export const asyncGetIsReviewed = async (
  oauth2Id: string,
  chatRoomId: string,
) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');

  const isReviewed = await get(child(chatRoomsRef, chatRoomId)).then(
    (dataSnapshot) => {
      const member = dataSnapshot
        .val()
        .memberList.find((aMember: MEMBER) => aMember.oauth2Id === oauth2Id);

      if (member) {
        return dataSnapshot
          .val()
          .memberList.find((member: MEMBER) => member.oauth2Id === oauth2Id)
          .isReviewed;
      }

      return false;
    },
  );

  return isReviewed;
};

/**
 * 사용자의 해당 채팅방 리뷰 여부 업데이트
 *
 * @param oauth2Id 사용자의 oauth2id
 * @param chatRoomId 해당 파티의 채팅방 Id
 * @returns null
 *
 * @example
 * ```typescript
 * await doReview('oauth2Id', 'fb-chatRoomId'); // isReview updated to true
 * ```
 */

export const doReview = async (oauth2Id: string, chatRoomId: string) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');

  const dataSnapshot = await get(
    child(chatRoomsRef, `${chatRoomId}/memberList`),
  );

  const prevMemberList = [...dataSnapshot.val()];
  const newMemberList = prevMemberList.map((member: MEMBER) => {
    if (member.oauth2Id === oauth2Id) {
      const temp = member;
      temp.isReviewed = true;
      return temp;
    }
    return member;
  });

  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    memberList: newMemberList,
  });

  return null;
};

/**
 * 리뷰 대상 멤버리스트 가져오기
 *
 * @param {string} chatRoomId 해당 파티의 채팅방 id
 * @param {string} oauth2Id 사용자의 oauth2Id
 * @returns 리뷰 대상 멤버리스트
 *
 * @example
 * ```typescript
 * const filteredMemberList = await getFilteredMemberListForReview('fb-chatRoomId', 'oauth2Id');
 * console.log(filteredMemberList); // ['완도수산새우도둑', '밍꾸라지', ...]
 * ```
 */

export const getMemberListForReview = async (
  chatRoomId: string,
  oauth2Id: string,
) => {
  const chatRoomRef = ref(getDatabase(), 'chatRooms');

  const fetchedMemberList = await get(
    child(chatRoomRef, `${chatRoomId}/memberList`),
  ).then((res) => res.val());

  const prevMemberList = [...fetchedMemberList];
  const filteredMemberList = prevMemberList.filter(
    (member) => member.oauth2Id.length > 0 && member.oauth2Id !== oauth2Id,
  );

  const result = filteredMemberList.map((member) => member.nickname);

  return result;
};

/**
 * 사용자의 해당 채팅방의 최초접근 시간 가져오기
 *
 * @param {string} oauth2Id 사용자 oauth2Id
 * @param {string} chatRoomId 채팅방 아이디
 * @returns 사용자의 해당 채팅방의 최초접근 시간
 *
 * @example
 * ```typescript
 * const firstRead = await getFirstRead('oauth2Id', 'fb-chatRoomId');
 * console.log(firstRead); // 123456789
 * ```
 */

export const getFirstRead = async (oauth2Id: string, chatRoomId: string) => {
  const firstReadRef = ref(getDatabase(), 'firstRead');

  const firstRead = await get(
    child(firstReadRef, `${oauth2Id}/${chatRoomId}`),
  ).then((res) => res.val());

  return firstRead;
};
