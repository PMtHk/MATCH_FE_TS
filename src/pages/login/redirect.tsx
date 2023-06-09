import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { login } from 'apis/api/user';

import Linear from 'components/loading/Linear';
import { snackbarActions } from 'store/snackbar-slice';

const Redirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const params = new URL(document.URL).searchParams;
  const code = params.get('code');

  if (code) {
    login(code, navigate, dispatch);
  }

  return (
    <Linear height="100vh" text="로그인 중입니다. 잠시만 기다려 주세요." />
  );
};

export default Redirect;
