import { MEMBER_FROM_SERVER } from 'types/commons';
import { GAME_ID } from 'types/games';

export const getCurrentGame: () => GAME_ID = () => {
  const currentGame: GAME_ID = window.location.pathname.split(
    '/',
  )[1] as GAME_ID;

  return currentGame;
};

export const isInParty = (
  memberList: MEMBER_FROM_SERVER[],
  myOauth2Id: string,
) => {
  const kakaoOauthIdList: string[] = [];

  memberList.map((member: MEMBER_FROM_SERVER) => {
    kakaoOauthIdList.push(member.oauth2Id);
    return null;
  });

  if (kakaoOauthIdList.includes(myOauth2Id)) {
    return true;
  }
  return false;
};

export const getIsBanned = (
  bannedList: MEMBER_FROM_SERVER[],
  myOauth2Id: string,
) => {
  const bannedKakaoOauthIdList: string[] = [];

  bannedList.map((member: MEMBER_FROM_SERVER) => {
    bannedKakaoOauthIdList.push(member.oauth2Id);
    return null;
  });

  if (bannedKakaoOauthIdList.includes(myOauth2Id)) {
    return true;
  }
  return false;
};
