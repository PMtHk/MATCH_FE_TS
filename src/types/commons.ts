// CountDownTimer
export type EXPIRE_TIME =
  | 'FIFTEEN_M'
  | 'THIRTY_M'
  | 'ONE_H'
  | 'TWO_H'
  | 'THREE_H'
  | 'SIX_H'
  | 'TWELVE_H'
  | 'TWENTY_FOUR_H';

export type MEMBER_FROM_SERVER = {
  nickname: string;
  oauth2Id: string;
};
