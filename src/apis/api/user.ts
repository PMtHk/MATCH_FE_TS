import React, { useState, useEffect } from 'react';
import { defaultAxios, authAxios, kakaoAxios } from 'apis/utils';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { promiseWrapper } from 'apis/utils/promiseWrapper';
import { addMemberToFirebaseDB } from 'apis/api/firebase';
import store from 'store/index';
import { tokenActions } from 'store/token-slice';
import { userActions } from 'store/user-slice';
import { registerActions } from 'store/register-slice';
import { snackbarActions } from 'store/snackbar-slice';
import { chatroomActions } from 'store/chatroom-slice';
import { notificationActions } from 'store/notification-slice';
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

/** ------------------------------------------------------------
 * 로그인 (카카오 연동)
 *
 * @param {string} code - 카카오 인가코드
 * @param {ReturnType<typeof useNavigate>} navigate - react-router-dom의 useNavigate
 * @param {ReturnType<typeof useDispatch>} dispatch - react-redux의 useDispatch
 * @returns {null}
 *
 * 카카오 로그인을 통해 받은 code (카카오 인가코드) 로 카카오 액세스 토큰을 발급받고,
 * 발급받은 카카오 액세스 토큰으로 백엔드에 로그인 요청을 보낸다.
 *
 * 백엔드에서 카카오 액세스 토큰으로 사용자 정보를 조회하고,
 * 해당 사용자가 DB에 없으면 404 응답을,
 * 해당 사용자가 있다면 200 응답과 accessToken과 refreshToken 을 받는다.
 * accessToken과 refreshToken을 각각 리덕스와 로컬 스토리지에 저장한다.
 *
 * 이후, accessToken decode 해 사용자 정보를 조회하고, 이를 리덕스에 저장한다.
 * 사용자의 게임 닉네임 정보를 조회하고, 이를 리덕스에 저장한다.
 *
 * snackbar 열고, 사용자 지정 선호게임 페이지로 이동시킨다.
 */

export const login = async (
  code: string,
  navigate: ReturnType<typeof useNavigate>,
  dispatch: ReturnType<typeof useDispatch>,
) => {
  // 인가코드로 카카오 액세스 토큰 발급
  const {
    data: { access_token: kakaoAccessToken },
  } = await kakaoAxios.get('/oauth/token', {
    params: {
      redirect_uri: process.env.REACT_APP_REDIRECT_URI_LOGIN,
      code,
    },
  });

  // 액세스 토큰을 담아서 백엔드로 로그인 요청
  const response = await defaultAxios.post('/api/user/signin', {
    oauth2AccessToken: kakaoAccessToken,
  });

  // 요청의 결과로 받은 액세스 및 리프레시 토큰을 각각 리덕스와 로컬 스토리지에 저장
  const { accessToken, refreshToken } = response.data;
  dispatch(tokenActions.SET_TOKEN({ accessToken }));
  localStorage.setItem('matchGG_refreshToken', refreshToken);

  const jwtPayload: IAccessTokenPayload =
    jwtDecode<IAccessTokenPayload>(accessToken);
  const { nickname, oAuth2Id, imageUrl, representative } = jwtPayload;

  dispatch(
    userActions.SET_USER({
      nickname,
      oauth2Id: oAuth2Id,
      profileImage: imageUrl,
      representative: representative.toLowerCase() as 'lol' | 'pubg',
    }),
  );

  // 사용자 게임 닉네임 정보 조회 후 리덕스에 저장
  await getUserGameInfo(dispatch);

  // snackbar 열기
  dispatch(
    snackbarActions.OPEN_SNACKBAR({
      message: '로그인에 성공했습니다.',
      severity: 'success',
    }),
  );

  // 사용자 지정 선호게임 페이지로 이동
  const redirectToRepresentative = store.getState().user.representative;
  navigate(`/${redirectToRepresentative || 'lol'}`);

  return null;
};

/** ------------------------------------------------------------
 * 로그아웃
 * @param {ReturnType<typeof useDispatch>} dispatch - react-redux의 useDispatch
 * @returns {null}
 *
 * 로그아웃 요청을 보내고, 로그아웃 성공시 리덕스에 저장된 사용자 정보를 삭제한다.
 */

export const logout = async (dispatch: ReturnType<typeof useDispatch>) => {
  const response = await authAxios.post('/api/user/logout');

  if (response.status === 200) {
    dispatch(userActions.DELETE_USER());
    dispatch(notificationActions.DELETE_NOTIFICATION());
    dispatch(tokenActions.DELETE_TOKEN());
    dispatch(chatroomActions.REMOVE_ALL_JOINED_CHATROOMS_ID());
    dispatch(
      snackbarActions.OPEN_SNACKBAR({
        message: '로그아웃 되었습니다.',
        severity: 'success',
      }),
    );
  }

  return null;
};

/** ------------------------------------------------------------
 * 사용자 게임 닉네임 정보 조회
 *
 * @param {ReturnType<typeof useDispatch>} dispatch - react-redux의 useDispatch
 * @returns {null}
 *
 * 백엔드에서 사용자의 게임별 닉네임 정보를 조회하고
 * 이들을 리덕스에 저장한다.
 */

export const getUserGameInfo = async (
  dispatch: ReturnType<typeof useDispatch>,
) => {
  const response = await authAxios.get('/api/user/info');

  const { lol, pubg, overwatch } = response.data;
  const games = { lol, pubg, overwatch };
  dispatch(userActions.SET_GAMES({ games }));
};

/** ------------------------------------------------------------
 * 회원가입
 *
 * @param {string} code - 카카오 인가코드
 * @param {ReturnType<typeof useNavigate>} navigate - react-router-dom의 useNavigate
 * @param {ReturnType<typeof useDispatch>} dispatch - react-redux의 useDispatch
 * @returns {void}
 *
 * 인자로 넘겨받은 code (카카오 인가코드) 로 카카오 액세스 토큰을 발급받고,
 * 발급받은 토큰과 회원가입시 사용자가 작성한 내용으로 백엔드에 로그인 요청을 보낸다.
 *
 * 백엔드에서 이미 가입한 사용자, 새로 가입하는 사용자를 구분하여 처리한다.
 *
 * 이후, register-slice를 비우고, 로그인 페이지로 이동시킨다.
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
  // 인가코드로 카카오 액세스 토큰 발급
  const {
    data: { access_token: kakaoAccessToken },
  } = await kakaoAxios.get('/oauth/token', {
    params: {
      redirect_uri: process.env.REACT_APP_REDIRECT_URI_REGISTER,
      code,
    },
  });

  // 백엔드에 회원가입 요청
  await defaultAxios.post('/api/user/signup', {
    oauth2AccessToken: kakaoAccessToken,
    representative: representative.toUpperCase(),
    lol: games.lol,
    pubg: games.pubg,
    overwatch: games.overwatch,
    // valorant: games.valorant,
  });

  // 발로란트로 수정해야함 나중에
};

/** ------------------------------------------------------------
 * 마이페이지 - 사용자 정보 조회
 * @returns {Resource} - 사용자 정보 Promise
 *
 * 백엔드에서 사용자 정보를 조회하고, 이를 리덕스에 저장한다.
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

/** ------------------------------------------------------------
 * 사용자의 채팅방 목록 가져오기
 * @returns {void}
 *
 * 백엔드에서 사용자가 참여한 채팅방 목록을 조회하고, 이를 리덕스에 저장한다.
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

/** ------------------------------------------------------------
 * 채팅방 참가
 * @param {string} game - 파티의 게임 종류
 * @param {number} id - 파티 번호
 * @param {string} chatRoomId - 채팅방 아이디
 * @param {Member} newMember - 새로 참가하는 멤버
 * @returns {null}
 *
 * 조회 중인 파티의 종류와 번호를 이용해 해당 게시글에 참가한다.
 * 파티 참가에 성공하면, 해당 firebase 정보도 갱신한다.
 */

export const joinParty = async (
  game: string,
  boardId: number,
  chatRoomId: string,
  newMember: MEMBER,
  dispatch: ReturnType<typeof useDispatch>,
) => {
  const response = await authAxios.post(`/api/chat/${game}/${boardId}/member`);

  const { firstRead } = await addMemberToFirebaseDB(newMember, chatRoomId);

  dispatch(
    chatroomActions.ADD_JOINED_CHATROOMS_ID({
      chatRoomId,
      game: game as GAME_ID,
      id: boardId,
      firstRead,
    }),
  );

  return null;
};
