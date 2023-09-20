import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from 'store';
import { snackbarActions, Tseverity } from 'store/snackbar-slice';

const AuthHoc = (
  InnerComponent: React.ElementType,
  option: boolean | null,
  adminRoute = null,
) => {
  /*
   * option: null: 아무나 출입이 가능한 페이지
   * option: true: 로그인한 유저만 출입이 가능한 페이지
   * option: false: 로그인한 유저는 출입이 불가능한 페이지
   * adminRoute: true: 관리자만 출입이 가능한 페이지
   */

  const AuthCheck = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLogin, isAdmin, representative } = useSelector(
      (state: RootState) => state.user,
    );

    useEffect(() => {
      let snackbarPayload = {
        message: '',
        severity: undefined as Tseverity,
      };

      if (option === true && !isLogin) {
        snackbarPayload = {
          message: '로그인이 필요합니다. 로그인 페이지로 이동합니다.',
          severity: 'warning' as Tseverity,
        };
        navigate('/login');
        dispatch(snackbarActions.OPEN_SNACKBAR(snackbarPayload));
      } else if (option === false && isLogin) {
        snackbarPayload = {
          message: '비정상적인 접근입니다.',
          severity: 'error' as Tseverity,
        };
        navigate(`/${representative}`);
        dispatch(snackbarActions.OPEN_SNACKBAR(snackbarPayload));
      } else if (adminRoute && !isAdmin) {
        snackbarPayload = {
          message:
            '관리자만 접근 가능합니다. 관리자 로그인페이지로 이동합니다.',
          severity: 'warning' as Tseverity,
        };
        navigate('/login/admin');
        dispatch(snackbarActions.OPEN_SNACKBAR(snackbarPayload));
      }
    }, [isLogin, isAdmin]);

    return <InnerComponent />;
  };
  return AuthCheck;
};

export default AuthHoc;
