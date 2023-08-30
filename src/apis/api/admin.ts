import jwtDecode from 'jwt-decode';
import CryptoJs from 'crypto-js';

import { defaultAxios } from 'apis/utils';
import { GAME_ID } from 'types/games';

/**
 * (관리자) 로그인
 *
 * @param {string} username - 관리자 username
 * @param {string} password - 암호화 이전의 관리자 password
 */

export const loginForAdmin = async (username: string, password: string) => {
  const response = await defaultAxios.post('/api/admin/login', {
    id: username,
    pw: CryptoJs.SHA256(password).toString(),
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

interface IAccessTokenPayload {
  sub: string;
  oAuth2Id: string;
  nickname: string;
  imageUrl: string;
  representative: 'LOL' | 'PUBG' | 'VALORANT' | 'OVERWATCH';
  iat: number;
  exp: number;
}
