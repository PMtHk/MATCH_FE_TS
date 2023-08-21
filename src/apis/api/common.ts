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
import { GAME_ID } from 'types/games';
import { MEMBER } from 'types/chats';
import { useEffect, useState } from 'react';
import { promiseWrapper } from 'apis/utils/promiseWrapper';
import { addMemberToFirebaseDB, removeMemberFromFirebaseDB } from './firebase';

/**
 * (공통) 게시글 작성
 *
 * @param {GAME_ID} game 게임 이름
 * @param {any} userInput 사용자 입력 데이터
 * @param {string} oauth2Id 사용자 고유 아이디
 * @param {number} maxMember 최대 인원
 * @param {string} notiToken 사용자 Notification 토큰
 * @returns 생성된 게시글의 채팅방 난수값, 생성된 게시글 ID, 게시글 작성자의 최초 접근 시간으로 구성된 객체
 *
 * @example
 * ```typescript
 * const result = await createCard('lol', userInput, 'oauth2Id', 5, 'notiToken');
 * console.log(result); // { key: '1234', boardId: 1, firstRead: 123456789 }
 * ```
 */

export const createCard = async (
  game: GAME_ID,
  userInput: any,
  oauth2Id: string,
  maxMember: number,
  notiToken?: string,
): Promise<any> => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');
  const lastReadRef = ref(getDatabase(), 'lastRead');
  const firstReadRef = ref(getDatabase(), 'firstRead');

  // 게시글 작성 요청 전송 => 생성된 게시글 ID
  const boardId: Promise<number> = await authAxios
    .post(`/api/${game}/board`, userInput)
    .then((res) => res.data);

  // FB realtimeDB에 채팅방 생성
  const { key } = push(chatRoomsRef);

  // 게시글 작성자의 최초 접근 시간 ( 기록 전 최초 접근 시간은 9999999999999 (사실상 무한))
  let firstRead = 9999999999999;

  if (key) {
    const preChatRoomInfo = {
      boardId,
      chatRoomId: key,
      totalUser: maxMember,
    };

    // 작성된 게시글과 연결된 채팅방 정보 전송
    await authAxios.post(`/api/chat/${game}`, preChatRoomInfo);

    const newChatRoom: any = {
      game,
      isDeleted: false,
      isFinished: false,
      key,
      roomId: boardId,
      createdBy: userInput.name,
      maxMember,
      memberList: [
        {
          nickname: userInput.name,
          oauth2Id,
          notiToken: notiToken || '',
          isReviewed: false,
        },
      ],
      timestamp: new Date().toString(),
      content: userInput.content,
    };

    // FB realtimeDB에 채팅방 정보 업데이트
    await update(child(chatRoomsRef, key), newChatRoom);

    // 게시글 작성자의 firstRead 및 lastRead 시간 기록
    await set(child(lastReadRef, `${oauth2Id}/${key}`), Date.now());
    await set(child(firstReadRef, `${oauth2Id}/${key}`), Date.now());

    // 게시글 작성자의 firstRead 시간 받아오기
    firstRead = await get(child(firstReadRef, `${oauth2Id}/${key}`)).then(
      (dataSnapshot) => dataSnapshot.val(),
    );
  }

  const result = {
    key,
    boardId,
    firstRead,
  };

  return result;
};

/**
 * (공통) 게시글 삭제
 *
 * @param {GAME_ID} game 게임 이름
 * @param {number} boardId 게시글 Id
 * @param {string} chatRoomId 채팅방 Id
 * @returns null
 *
 * @example
 * ```typescript
 * await deleteCard('lol', 1, 'fb-chatRoomId'); // deleted
 * ```
 */

export const deleteCard = async (
  game: string,
  boardId: number,
  chatRoomId: string,
) => {
  await authAxios.delete(`/api/${game}/board/${boardId}`);

  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    isDeleted: true,
  });

  return null;
};

/**
 * (공통) 게시글 업데이트
 *
 * @param {GAME_ID} game 게임 이름
 * @param {number} boardId 게시글 Id
 * @param {string} chatRoomId 채팅방 Id
 * @param {any} userInput 사용자 입력 데이터
 * @param {number} updatedMaxMember 최대 인원
 * @returns null
 *
 * @example
 * ```typescript
 * await updateCard('lol', 1, 'fb-chatRoomId', userInput, 5); // updated
 * ```
 */

export const updateCard = async (
  game: string,
  boardId: number,
  chatRoomId: string,
  userInput: any,
  updatedMaxMember: number,
) => {
  // 게시글 업데이트 요청 전송
  await authAxios.put(`/api/${game}/board/${boardId}`, { ...userInput });

  // FB realtimeDB에 채팅방 정보 업데이트
  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    content: userInput.content,
    maxMember: updatedMaxMember,
  });

  // 게시글과 연결된 채팅방 인원수 수정
  await authAxios.put(`/api/chat/${game}/${boardId}`, {
    totalUser: updatedMaxMember,
  });

  return null;
};

/**
 * (공통) 게시글의 인원 모집완료 처리
 *
 * @param {GAME_ID} game 게임 이름
 * @param {number} boardId 게시글 Id
 * @param {string} chatRoomId 채팅방 Id
 * @returns null
 *
 * @example
 * ```typescript
 * await finishCard('lol', 123, 'fb-chatRoomId'); // finished
 * ```
 */

export const finishCard = async (
  game: string,
  boardId: number,
  chatRoomId: string,
) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');

  // 게시글 모집완료 처리 요청 전송
  await authAxios.post(`/api/chat/${game}/${boardId}/finish`);

  // FB realtimeDB에 해당 채팅방 isFinished 정보 업데이트
  await update(child(chatRoomsRef, `${chatRoomId}`), {
    isFinished: true,
  });

  return null;
};

/**
 * (공통) 작성자가 닉네임으로 파티 인원 추가
 *
 * @param {GAME_ID} game 해당 게임
 * @param {number} boardId 게시글id
 * @param {string} chatRoomId 채팅방 id
 * @param {string} nicknameToAdd 추가하려는 사용자 닉네임
 * @returns null
 *
 * @example
 * ```typescript
 * await addPartyMemberWithName(123, 'fb-chatRoomId', '완도수산새우도둑', 'lol'); // member added with nickname
 * ```
 */

export const addPartyMemberWithName = async (
  game: GAME_ID,
  boardId: number,
  chatRoomId: string,
  nicknameToAdd: string,
) => {
  // 작성자가 닉네임으로 파티 인원 추가 요청 전송
  await authAxios.post(
    `/api/chat/${game}/${boardId}/${nicknameToAdd.replace('#', '%23')}`,
  );

  // FB realtimeDB에 추가할 파티원 정보 생성
  const newMember: MEMBER = {
    nickname: nicknameToAdd,
    oauth2Id: '',
    notiToken: '',
    isReviewed: false,
  };

  // FB realtimeDB의 해당 채팅방 정보에 파티원 추가
  await addMemberToFirebaseDB(chatRoomId, newMember);

  return null;
};

/**
 * (공통) 파티멤버 강제퇴장
 *
 * @param {GAME_ID} game 해당 게임
 * @param {number} boardId 게시글 id
 * @param {string} chatRoomId 채팅방 id
 * @param {string} nickname 강퇴하려는 사용자 닉네임
 * @returns null
 *
 * @example
 * ```typescript
 * await kickMemberFromParty('lol', 123, 'fb-chatRoomId', '완도수산새우도둑'); // member kicked
 * ```
 */

export const kickMemberFromParty = async (
  game: string,
  boardId: number,
  chatRoomId: string,
  nickname: string,
) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');
  const messagesRef = ref(getDatabase(), 'messages');

  // 파티원 강퇴 요청 전송
  await authAxios.delete(
    `/api/chat/${game}/${boardId}/${nickname.replace('#', '%23')}/ban`,
  );

  // FB realtimeDB에서 해당 채팅방 정보 조회
  const chatRoomData: any = await get(child(chatRoomsRef, chatRoomId)).then(
    (res) => res.val(),
  );

  const prevMemberList = [...chatRoomData.memberList];
  const prevBannedList = chatRoomData.bannedList
    ? [...chatRoomData.bannedList]
    : [];

  const targetToKick = prevMemberList.find(
    (member) => member.nickname === nickname,
  );

  const newMemberList = prevMemberList.filter(
    (member) => member.nickname !== nickname,
  );
  const newBannedList = [...prevBannedList, targetToKick];

  // FB realtimeDB의 해당 채팅방의 멤버리스트와 밴리스트 업데이트
  await update(child(chatRoomsRef, chatRoomId), {
    memberList: newMemberList,
    bannedList: newBannedList,
  });

  // 시스템 메시지 전송
  await set(push(child(messagesRef, chatRoomId)), {
    type: 'system',
    timestamp: Date.now(),
    user: { nickname: 'system', oauth2Id: '', notiToken: '' },
    content: `${nickname} 님이 퇴장하였습니다.`,
  });

  return null;
};

/**
 * (공통) 채팅방 참가하기
 *
 * @param {string} game  파티의 게임 종류
 * @param {number} id  파티 번호
 * @param {string} chatRoomId  채팅방 아이디
 * @param {Member} newMember  새로 참가하는 멤버
 * @returns {number} 채팅방 최초 접근 시간
 *
 * @example
 * ```typescript
 * const firstRead = await joinParty('lol', 123, 'fb-chatRoomId', newMember);
 * console.log(firstRead); // 123456789
 * ```
 */

export const joinParty = async (
  game: string,
  boardId: number,
  chatRoomId: string,
  newMember: MEMBER,
) => {
  await authAxios.post(`/api/chat/${game}/${boardId}/member`);

  const { firstRead } = await addMemberToFirebaseDB(chatRoomId, newMember);

  return firstRead;
};

/**
 * (공통) 파티 떠나기
 *
 * @param {GAME_ID} game 해당 게임
 * @param {number} cardId 게시글 id
 * @param {string} chatRoomId 채팅방 id
 * @param {string} oauth2Id 사용자 고유 아이디
 * @returns null
 *
 * @example
 * ```typescript
 * await leaveParty('lol', 'oauth2Id', 123, 'fb-chatRoomId'); // left party
 * ```
 */

export const leaveParty = async (
  game: GAME_ID,
  boardId: number,
  chatRoomId: string,
  oauth2Id: string,
) => {
  // 파티 떠나기 요청 전송
  await authAxios.delete(`/api/chat/${game}/${boardId}/member`);

  // FB realtimeDB의 해당 채팅방에서 파티원 삭제
  await removeMemberFromFirebaseDB(chatRoomId, oauth2Id);

  return null;
};

/**
 * (공통) 게시글 정보 조회
 *
 * @param {GAME_ID} game 게임 이름
 * @param {number} boardId 게시글 Id
 * @returns 게시글 정보
 *
 * @example
 * ```typescript
 * const result = await fetchBoardInfo('lol', 123);
 * console.log(result); // { boardId: 123, content: 'content', ... }
 * ```
 */

export const fetchBoardInfo = async (game: GAME_ID, boardId: number) => {
  const fetchedBoardInfo = await defaultAxios
    .get(`/api/${game}/boards/${boardId}`)
    .then((res) => res.data);

  return fetchedBoardInfo;
};

/**
 * (공통) 게시글 목록 불러오기
 *
 * @param url 요청 url
 * @param config 요청 config
 * @param deps useEffect deps
 * @returns - 게시글 목록
 *
 * @example
 * ```typescript
 * const cardList = fetchCardList('/api/lol/boards', config, deps);
 * console.log(cardList); // [{id: 1, title: '게시글', ... }, ... ]
 * ```
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
 * (공통) 게시글 상세보기 불러오기
 *
 * @param url 요청 url
 * @param deps useEffect deps
 * @returns - 게시글 상세보기
 *
 * @example
 * ```typescript
 * const cardDetail = fetchCardDetail('/api/lol/boards/1', deps);
 * console.log(cardDetail); // {id: 1, title: '해당 게임 게시글', ... }
 * ```
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
