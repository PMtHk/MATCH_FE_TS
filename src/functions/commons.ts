import { CHATROOM } from 'types/chats';
import { GAME_ID } from 'types/games';

export const getIsJoined = (
  chatRoomId: string,
  joinedChatRoomsId: CHATROOM[],
) => {
  return joinedChatRoomsId.some(
    (joinedChatRoom: CHATROOM) => joinedChatRoom.chatRoomId === chatRoomId,
  );
};

export const getCurrentGame: () => GAME_ID = () => {
  const currentGame: GAME_ID = window.location.pathname.split(
    '/',
  )[1] as GAME_ID;

  return currentGame;
};
