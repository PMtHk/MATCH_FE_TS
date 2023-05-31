import axios from 'axios';
import store from 'store/index';

const axiosInstance = (url: string) => {
  const instance = axios.create({ baseURL: url });
  return instance;
};

const axiosInstanceWithAuth = (url: string) => {
  const { accessToken } = store.getState().token;
  const refreshToken = localStorage.getItem('matchGG_refreshToken');
  const instance = axios.create({
    baseURL: url,
    headers: {
      // Authorization: `Bearer ${accessToken}`,
      'Refresh-Token': refreshToken,
    },
  });
  return instance;
};

const axiosKakaoInstance = (url: string) => {
  const instance = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    params: {
      grant_type: 'authorization_code',
      client_id: process.env.REACT_APP_REST_API_KEY,
      // redirect_uri  - login or register
      // code - 인가코드 넣어야 함
    },
  });
  return instance;
};

export const defaultAxios = axiosInstance(
  process.env.REACT_APP_API_BASE_URL as string,
);
export const authAxios = axiosInstanceWithAuth(
  process.env.REACT_APP_API_BASE_URL as string,
);

export const kakaoAxios = axiosKakaoInstance('https://kauth.kakao.com');
