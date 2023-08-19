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
  id: number;
  firstRead: number;
};

export type FETCHED_CHATROOMINFO_FB = {
  content: string;
  createdBy: string;
  game: GAME_ID;
  isDeleted: boolean;
  key: string;
  maxMember: number;
  members: MEMBER[];
  roomId: string;
  timestamp: number | Date;
};
