import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { login, getUserGameInfo } from 'apis/api/user';
import { RootState } from 'store';
import { snackbarActions } from 'store/snackbar-slice';
import { userActions } from 'store/user-slice';
import { tokenActions } from 'store/token-slice';
import Linear from 'components/loading/Linear';

const Redirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const params = new URL(document.URL).searchParams;
  const code = params.get('code');

  const loginHandler = async (code: string) => {
    try {
      const {
        accessToken,
        refreshToken,
        nickname,
        oauth2Id,
        profileImage,
        representative,
      } = await login(code);

      dispatch(tokenActions.SET_TOKEN({ accessToken }));
      localStorage.setItem('matchGG_refreshToken', refreshToken);

      dispatch(
        userActions.SET_USER({
          nickname,
          oauth2Id,
          profileImage,
          representative,
        }),
      );

      const { lol, pubg, overwatch, valorant } = await getUserGameInfo();

      const games = { lol, pubg, overwatch, valorant };

      dispatch(userActions.SET_GAMES({ games }));

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '로그인에 성공했습니다.',
          severity: 'success',
        }),
      );

      navigate(`/${representative}`);
    } catch (error: any) {
      if (error.response.status === 404) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '일치하는 회원정보가 없습니다.\n회원가입을 진행해주세요.',
            severity: 'error',
          }),
        );
        navigate('/login');
      } else {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '로그인에 실패했습니다.',
            severity: 'error',
          }),
        );
        navigate('/login');
      }
    }
  };

  React.useEffect(() => {
    if (code) {
      loginHandler(code);
    }
  }, []);

  return (
    <Linear height="100vh" text="로그인 중입니다. 잠시만 기다려 주세요." />
  );
};

export default Redirect;
