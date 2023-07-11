import React, { useState, useEffect } from 'react';
import { defaultAxios, authAxios, kakaoAxios } from 'apis/utils';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import store from 'store/index';
import { tokenActions } from 'store/token-slice';
import { userActions } from 'store/user-slice';
import { registerActions } from 'store/register-slice';
import { snackbarActions } from 'store/snackbar-slice';

import { GAME_ID } from 'assets/Games.data';
import { promiseWrapper } from 'apis/utils/promiseWrapper';
import { chatroomActions } from 'store/chatroom-slice';

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
 * 로그인 (카카오 연동)
 *
 * @param {string} code - 카카오 인가코드
 * @param {ReturnType<typeof useNavigate>} navigate - react-router-dom의 useNavigate
 * @param {ReturnType<typeof useDispatch>} dispatch - react-redux의 useDispatch
 * @returns {void}
 *
 * 인자로 넘겨받은 code (카카오 인가코드) 로 카카오 액세스 토큰을 발급받고,
 * 발급받은 토큰으로 백엔드에 로그인 요청을 보낸다.
 *
 * 백엔드에서 카카오 액세스 토큰으로 사용자 정보를 조회하고,
 * 해당 사용자가 DB에 없으면 404 응답을 보내고,
 * 해당 사용자가 있다면 200 응답과 accessToken과 refreshToken 을 보낸다.
 * accessToken과 refreshToken을 각각 리덕스와 로컬 스토리지에 저장한다.
 *
 * 이후, accessToken decode 해 사용자 정보를 조회하고, 이를 리덕스에 저장한다.
 */

export const login = async (
  code: string,
  navigate: ReturnType<typeof useNavigate>,
  dispatch: ReturnType<typeof useDispatch>,
) => {
  // 인가코드로 카카오 액세스 토큰 발급
  try {
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
  } catch (error: any) {
    // 회원이 아닌 경우
    if (error?.response?.status === 404) {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '일치하는 회원정보가 없습니다.\n회원가입을 진행해주세요.',
          severity: 'error',
        }),
      );
      navigate('/register');
    } else {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '로그인에 실패했습니다.',
          severity: 'error',
        }),
      );
    }
  }
};

/**
 * 사용자 게임 닉네임 정보 조회

 * @param {ReturnType<typeof useDispatch>} dispatch - react-redux의 useDispatch
 * @returns {void}
 *
 * authAxios 이용
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

/**
 * 사용자 게임별 닉네임 등록 여부 확인
 *
 * @param {string} nickname - 사용자가 입력한 닉네임
 * @param {GAME_ID} game - 게임 id
 * @param {ReturnType<typeof useDispatch>} dispatch - react-redux의 useDispatch
 * @returns {string} - 백엔드에서 조회한 사용자의 닉네임 (정확한 닉네임)
 *
 * 사용자가 입력한 닉네임을 백엔드에 보내서, 해당 닉네임이 이미 게임사에 등록되어 있는지 확인한다.
 * 이후, 정확한 닉네임을 등록할 수 있도록 입력값을 수정한다.
 */

/**
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
  navigate: ReturnType<typeof useNavigate>,
  dispatch: ReturnType<typeof useDispatch>,
) => {
  try {
    const { representative, games } = store.getState().register;

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
      overwatch: '',
      lostark: '',
      maplestory: '',
    });

    // register-slice 내용 삭제
    dispatch(registerActions.DELETE_REGISTER({}));

    // 회원가입 성공
    dispatch(
      snackbarActions.OPEN_SNACKBAR({
        message: '회원가입에 성공했습니다. 로그인 해주세요.',
        severity: 'success',
      }),
    );

    navigate('/login');
  } catch (error: any) {
    if (
      error.response.status === 400 &&
      error.response.data.message === '이미 존재하는 회원입니다.'
    ) {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '이미 존재하는 회원입니다.',
          severity: 'error',
        }),
      );
    } else {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '회원가입에 실패했습니다.',
          severity: 'error',
        }),
      );
    }
    navigate('/login');
  }
};

/**
 * 마이페이지 - 사용자 정보 조회
 * @param {string} url - 요청 url
 * @returns {Resource} - 요청 결과 -> 객체
 */

export const getUserInfo = (url: string) => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = authAxios.get(url).then((response) => response.data);
      setResource(promiseWrapper(promise));
    };

    getData();
  }, []);

  return resource;
};

/**
 * 사용자의 채팅방 목록 가져오기
 * @returns {void}
 *
 * 사용자의 채팅방 목록을 가져와서 리덕스에 저장한다.
 */

type ChatRoom = {
  id: number;
  chatRoomId: string;
  nickname: string;
  oauth2Id: string;
};

export const getUserChatRooms = () => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = authAxios.get('/api/chat/rooms').then((response) => {
        const list = response.data.chatRoomList.map((chatRoom: ChatRoom) => {
          return chatRoom.chatRoomId;
        });
        return list;
      });
      setResource(promiseWrapper(promise));
    };

    getData();
  }, []);

  return resource;
};
