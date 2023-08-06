import { GAME_ID } from './games';

export type MEMBER = {
  nickname: string;
  oauth2Id: string;
  notiToken: string;
  isReviewed: boolean;
};

export type FETCHED_CHATROOM = {
  id: string;
  chatRoomId: string;
  nickname: string;
  oauth2Id: string;
};

export type CHATROOM = {
  chatRoomId: string;
  game: GAME_ID;
};
