import { authAxios } from 'apis/utils';
import { getDatabase, push, ref, update, child, set } from 'firebase/database';

/**
 * 게시글 생성
 * @param game 게임 이름
 * @param userInput 사용자 입력 데이터
 * @param oauth2Id 사용자 고유 아이디
 * @param maxMember 최대 인원
 * @param notiToken 사용자 Notification 토큰
 * @returns {
 *    key: string; 생성된 채팅방 난수 값
 *    boardId: number; 생성된 게시글의 Id 값
 * }
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
      key,
      roomId: boardId,
      createdBy: userInput.name,
      maxMember,
      memberList: [
        {
          nickname: userInput.name,
          oauth2Id,
          notiToken: notiToken || '',
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
 *
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
};

/**
 * 게시글 업데이트
 *
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
};
