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
   */

  const AuthCheck = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLogin } = useSelector((state: RootState) => state.user);
    const { isAdmin } = useSelector((state: RootState) => state.user);

    useEffect(() => {
      let snackbarPayload = {
        message: '',
        severity: undefined as Tseverity,
      };
      if (!isLogin) {
        if (option) {
          snackbarPayload = {
            message: '로그인이 필요합니다.',
            severity: 'warning' as Tseverity,
          };
          navigate(-1);
          dispatch(snackbarActions.OPEN_SNACKBAR(snackbarPayload));
        }
      } else if (adminRoute && isAdmin) {
        snackbarPayload = {
          message: '관리지만 접근 가능합니다.',
          severity: 'warning' as Tseverity,
        };
        navigate(-1);
        dispatch(snackbarActions.OPEN_SNACKBAR(snackbarPayload));
      } else if (option === false) {
        snackbarPayload = {
          message: '비정상적인 접근입니다.',
          severity: 'error' as Tseverity,
        };
        navigate(-1);
        dispatch(snackbarActions.OPEN_SNACKBAR(snackbarPayload));
      }
    }, [isLogin, isAdmin]);

    return <InnerComponent />;
  };
  return AuthCheck;
};

export default AuthHoc;
