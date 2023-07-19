import { authAxios } from 'apis/utils';
import { getDatabase, push, ref, update, child, set } from 'firebase/database';

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

  const { boardId } = boardResponse.data;

  // 서버에 전송할 데이터 생성
  // 1. 키 생성
  const { key } = push(chatRoomsRef);

  if (key) {
    // 2. 데이터 생성
    const preChatRoomInfo = {
      boardId,
      key,
      maxMember,
    };

    // 2. 서버 내 채팅방 생성 요청
    const chatResponse = await authAxios.post(
      `/api/chat/${game}`,
      preChatRoomInfo,
    );

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
  return null;
};
