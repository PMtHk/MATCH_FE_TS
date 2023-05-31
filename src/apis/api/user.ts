import { defaultAxios, authAxios, kakaoAxios } from 'apis/utils';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { tokenActions } from 'store/token-slice';
import { userActions } from 'store/user-slice';
import { registerActions } from 'store/register-slice';

/*
 * 카카오 로그인
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

export const kakaoLogin = async (
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

  const jwtPayload: any = jwtDecode(accessToken);
  // 회원가입 기능 개발 이후 토큰 페이로드 값 확인 후 타입 작성
  const { nickname, oAuth2Id, imageUrl, representative } = jwtPayload;
  dispatch(
    userActions.SET_USER({
      nickname,
      oauth2Id: oAuth2Id,
      profile_imageUrl: imageUrl,
      representative,
    }),
  );

  // 사용자 게임 닉네임 정보 조회 후 리덕스에 저장
  await getUserGameInfo(dispatch);

  // 사용자 지정 선호게임 페이지로 이동
  navigate(`/${representative || 'lol'}`);

  return null;
};

/*
 * 사용자 게임 닉네임 정보 조회

 * @param {ReturnType<typeof useDispatch>} dispatch - react-redux의 useDispatch
 * @returns {void}
 *
 * 백엔드에서 사용자의 게임별 닉네임 정보를 조회하고
 * 이들을 리덕스에 저장한다.
 */

export const getUserGameInfo = async (
  dispatch: ReturnType<typeof useDispatch>,
) => {
  const response = await authAxios.get('/api/user/info');

  const { lol, pubg } = response.data;
  const games = { lol, pubg };
  dispatch(userActions.SET_GAMES({ games }));

  return null;
};

/*
 * 사용자 게임별 닉네임 등록 여부 확인
 *
 * @param {string} nickname - 사용자가 입력한 닉네임
 * @param {'lol' | 'pubg'} game - 게임 id
 * @param {ReturnType<typeof useDispatch>} dispatch - react-redux의 useDispatch
 */

export const verifyingNickname = async (
  nickname: string,
  game: 'lol' | 'pubg',
  dispatch: ReturnType<typeof useDispatch>,
) => {
  dispatch(registerActions.SET_GAMES_WITH_ID({ id: game, value: '' }));

  const { data: exactNickname } = await defaultAxios.get(
    `/api/${game}/user/exist/${nickname}`,
  );

  dispatch(
    registerActions.SET_GAMES_WITH_ID({ id: game, value: exactNickname }),
  );

  return exactNickname;
};
