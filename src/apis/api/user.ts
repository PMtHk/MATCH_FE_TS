import { useState, useEffect } from 'react';
import { defaultAxios, authAxios, kakaoAxios } from 'apis/utils';
import jwtDecode from 'jwt-decode';

import { promiseWrapper } from 'apis/utils/promiseWrapper';

import { GAME_ID } from 'types/games';
import { FETCHED_CHATROOM, MEMBER } from 'types/chats';

// interfaces
interface IAccessTokenPayload {
  sub: string;
  oAuth2Id: string;
  nickname: string;
  imageUrl: string;
  representative: 'LOL' | 'PUBG' | 'VALORANT' | 'OVERWATCH';
  iat: number;
  exp: number;
}

/**
 * (사용자) 로그인
 *
 * @param {string} code 카카오 인가코드
 * @returns {null}
 *
 * @description
 * 카카오 로그인을 통해 받은 카카오 인가코드로 Kakao_AccessToken을 발급받고,
 * 발급받은 Kakao_AccessToken으로 서버에 로그인을 요청한다.
 *
 * 해당 요청의 결과로 사용자가 존재하지 않으면 404,
 * 사용자가 존재하면 200 응답으로 accessToken과 refreshToken을 받는다.
 *
 * 추가로, 받은 accessToken의 payload를 디코딩하여 사용자 정보를 추출하고,
 * accessToken과 refreshToken 및 사용자 정보를 반환한다.
 */

export const login = async (code: string) => {
  const {
    data: { access_token: kakaoAccessToken },
  } = await kakaoAxios.get('/oauth/token', {
    params: {
      redirect_uri: process.env.REACT_APP_REDIRECT_URI_LOGIN,
      code,
    },
  });

  const response = await defaultAxios.post('/api/user/signin', {
    oauth2AccessToken: kakaoAccessToken,
  });

  const { accessToken, refreshToken } = response.data;

  const jwtPayload: IAccessTokenPayload =
    jwtDecode<IAccessTokenPayload>(accessToken);
  const { nickname, oAuth2Id, imageUrl, representative } = jwtPayload;

  const result = {
    accessToken,
    refreshToken,
    nickname,
    oauth2Id: oAuth2Id,
    profileImage: imageUrl,
    representative: representative.toLowerCase() as GAME_ID,
  };

  return result;
};

/**
 * (사용자) 로그아웃
 *
 * @returns null
 */

export const logout = async () => {
  const response = await authAxios.post('/api/user/logout');

  return null;
};

/**
 * (사용자) 등록된 게임 닉네임 가져오기
 *
 * @returns {Promise<{lol: string, pubg: string, overwatch: string}>} 사용자의 게임 닉네임
 */

export const getUserGameInfo = async () => {
  const { lol, pubg, overwatch, valorant } = await authAxios
    .get('/api/user/info')
    .then((res) => res.data);

  return { lol, pubg, overwatch, valorant };
};

/**
 * (사용자) 회원가입
 *
 * @param {string} code 카카오 인가코드
 * @returns null
 *
 * @description
 * 카카오 로그인을 통해 받은 카카오 인가코드로 Kakao_AccessToken을 발급받고,
 * 발급받은 Kakao_AccessToken으로 서버에 회원가입을 요청한다.
 */

export const signup = async (
  code: string,
  representative: GAME_ID,
  games: {
    lol: string;
    pubg: string;
    overwatch: string;
    valorant: string;
  },
) => {
  const {
    data: { access_token: kakaoAccessToken },
  } = await kakaoAxios.get('/oauth/token', {
    params: {
      redirect_uri: process.env.REACT_APP_REDIRECT_URI_REGISTER,
      code,
    },
  });

  await defaultAxios.post('/api/user/signup', {
    oauth2AccessToken: kakaoAccessToken,
    representative: representative.toUpperCase(),
    lol: games.lol,
    pubg: games.pubg,
    overwatch: games.overwatch,
    valorant: games.valorant,
  });

  return null;
};

/**
 * (사용자) 마이페이지에서의 사용자 조회
 *
 * @returns {Resource} - 사용자 정보 Promise
 */

export const getUserInfo = () => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = authAxios
        .get('/api/user/info')
        .then((response) => response.data);
      setResource(promiseWrapper(promise));
    };

    getData();
  }, []);

  return resource;
};

/**
 * (사용자) 사용자의 가입된 채팅방
 *
 * @returns {Resource} - 사용자가 가입한 채팅방 목록 Promise
 */

export const getUserChatRooms = () => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = authAxios.get('/api/chat/rooms').then((response) => {
        const list = response.data.chatRoomList.map(
          (chatRoom: FETCHED_CHATROOM) => {
            return chatRoom.chatRoomId;
          },
        );
        return list;
      });
      setResource(promiseWrapper(promise));
    };

    getData();
  }, []);

  return resource;
};

/**
 * (사용자) 게임별 인증된 닉네임 변경
 *
 * @param game 닉네임을 변경할 게임
 * @param nickname 변경할 닉네임
 * @returns 성공시 true 실패시 false
 *
 * @example
 * ```typescript
 * const result = await changeNickname('lol', '완도수산새우도둑');
 * console.log(result); // true
 * ```
 */

export const changeNickname = async (game: string, nickname: string) => {
  const response = await authAxios.put(
    `/api/user/${game.toUpperCase()}/${nickname.replace('#', '%23')}/nickname`,
  );

  if (response.status === 200) return true;
  return false;
};

/**
 * (사용자) 대표게임을 변경하는 함수
 *
 * @param game 변경될 게임
 * @returns 성공시 true 실패시 false
 *
 * @example
 * ```typescript
 * const result = await changeRepresentative('lol');
 * console.log(result); // true
 * ```
 */

export const changeRepresentative = async (game: string) => {
  const response = await authAxios.put(
    `/api/user/${game.toUpperCase()}/representative`,
  );

  if (response.status === 200) return true;
  return false;
};

/**
 * (사용자) 팔로우 목록을 가져오는 함수
 * @returns 팔로워들의 oauth2Id 및 각 게임별 닉네임 list
 */

export const getFollowList = async () => {
  const response = await authAxios.get('/api/user/follow/list');
  return response.data;
};
