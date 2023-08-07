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
import { addMemberToFirebaseDB, removeMemberFromFirebaseDB } from './firebase';

/**
 * 게시글 생성
 * @param {string} game 게임 이름
 * @param {any} userInput 사용자 입력 데이터
 * @param {string} oauth2Id 사용자 고유 아이디
 * @param {number} maxMember 최대 인원
 * @param {string} notiToken 사용자 Notification 토큰
 * @returns {
 *    key: string; 생성된 채팅방 난수 값
 *    boardId: number; 생성된 게시글의 Id 값
 * } - 채팅방 난수 값과 게시글 Id 값
 *
 * firebaseDB의 새 채팅방 난수값을 생성한 후 이를 게시글 내용과 함께
 * 서버에 게시글 생성 요청을 보낸 후,
 * 해당 요청 성공시, firebaseDB에 게시글 정보를 생성한다.
 */

export const createCard = async (
  game: string,
  userInput: any,
  oauth2Id: string,
  maxMember: number,
  notiToken?: string,
) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');
  const lastReadRef = ref(getDatabase(), 'lastRead');

  // 1. 서버 내 게시글 생성 요청
  const boardResponse = await authAxios.post(`/api/${game}/board`, userInput);

  const boardId = boardResponse.data;

  // 서버에 전송할 데이터 생성
  // 1. 키 생성
  const { key } = push(chatRoomsRef);

  if (key) {
    // 2. 데이터 생성
    const preChatRoomInfo = {
      boardId,
      chatRoomId: key,
      totalUser: maxMember,
    };

    // 2. 서버 내 채팅방 생성 요청
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
    // 파이어베이스에 게시글 생성
    await update(child(chatRoomsRef, key), newChatRoom);
    await set(child(lastReadRef, `${oauth2Id}/${key}`), Date.now());
  }

  const result = {
    key,
    boardId,
  };

  return result;
};

/**
 * 게시글 삭제
 * @param game 게임 이름
 * @param boardId 게시글 Id
 * @param chatRoomId 채팅방 Id
 * @returns null
 *
 * 서버 DB에 해당 게시글을 삭제 요청을 보낸 후,
 * 해당 요청 성공시, firebaseDB의 게시글 정보 중 isDeleted 를 수정한다.
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
 * 게시글 업데이트
 * @param currentGame 현재 게임 이름
 * @param boardId 게시글 Id
 * @param chatRoomId 채팅방 Id
 * @param userInput 사용자 입력 데이터
 * @param updatedMaxMember 최대 인원
 * @returns null
 *
 * 서버 DB에 해당 게시글의 내용을 사용자 입력에 따라 업데이트 요청을 보낸 후,
 * 해당 요청 성공시, firebaseDB의 게시글 정보를 수정한다.
 */

export const updateCard = async (
  currentGame: string,
  boardId: number,
  chatRoomId: string,
  userInput: any,
  updatedMaxMember: number,
) => {
  await authAxios.put(`/api/${currentGame}/board/${boardId}`, { ...userInput });

  await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
    content: userInput.content,
    maxMember: updatedMaxMember,
  });

  await authAxios.put(`/api/chat/${currentGame}/${boardId}`, {
    totalUser: updatedMaxMember,
  });

  return null;
};

export const finishCard = async (currentGame: string, boardId: number) => {
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');
  await authAxios.post(`/api/chat/${currentGame}/${boardId}/finish`);

  await update(child(chatRoomsRef, `${boardId}`), {
    isFinished: true,
  });

  return null;
};

/**
 * 파티장이 직접 파티원 추가
 * @param cardId 게시글id
 * @param chatRoomId 채팅방 id
 * @param nicknameToAdd 추가하려는 사용자 닉네임
 * @param game 해당 게임
 * @returns null
 */

export const addPartyMemberWithName = async (
  cardId: number,
  chatRoomId: string,
  nicknameToAdd: string,
  game: string,
) => {
  await authAxios.post(`/api/chat/${game}/${cardId}/${nicknameToAdd}`);

  await addMemberToFirebaseDB(
    { nickname: nicknameToAdd, oauth2Id: '', notiToken: '', isReviewed: false },
    chatRoomId,
  );

  return null;
};

/**
 * 파티장이 파티원 강퇴
 * @param cardId 게시글 id
 * @param chatRoomId 채팅방 id
 * @param nickname 강퇴하려는 사용자 닉네임
 * @param game 해당 게임
 */
export const kickMemberFromParty = async (
  cardId: number,
  chatRoomId: string,
  nickname: string,
  game: string,
) => {
  await authAxios.delete(`/api/chat/${game}/${cardId}/${nickname}/ban`);

  const chatRoomsRef = ref(getDatabase(), 'chatRooms');
  const messagesRef = ref(getDatabase(), 'messages');
  const dataSnapshot: any = await get(child(chatRoomsRef, chatRoomId));

  const prevMemberList = [...dataSnapshot.val().memberList];

  const target = prevMemberList.find((member) => member.nickname === nickname);

  const prevBannedList = dataSnapshot.val().bannedList
    ? [...dataSnapshot.val().bannedList]
    : [];
  const newMemberList = prevMemberList.filter(
    (member) => member.nickname !== nickname,
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
    content: `${nickname} 님이 퇴장하였습니다.`,
  });
};

/**
 * 스스로 파티 나가기
 */

export const leaveParty: (
  oauth2Id: string,
  game: GAME_ID,
  cardId: number,
  chatRoomId: string,
) => Promise<null> = async (
  oauth2Id: string,
  game: GAME_ID,
  cardId: number,
  chatRoomId,
) => {
  await authAxios.delete(`/api/chat/${game}/${cardId}/member`);

  await removeMemberFromFirebaseDB(oauth2Id, chatRoomId);

  return null;
};

export const fetchBoardInfo = async (game: GAME_ID, boardId: number) => {
  const response = await defaultAxios.get(`/api/${game}/boards/${boardId}`);

  return response.data;
};
