import React, { useEffect } from 'react';

import { getUserInfo } from 'apis/api/user';
import { useDispatch } from 'react-redux';
import { mypageActions } from 'store/mypage-slice';

interface UserInfoFetcherProps {
  children: React.ReactNode;
}

const UserInfoFetcher = ({ children }: UserInfoFetcherProps) => {
  const dispatch = useDispatch();

  const userInfo: any = getUserInfo('/api/user/info');

  useEffect(() => {
    dispatch(mypageActions.SET_MYPAGE({ ...userInfo }));
  }, [userInfo, dispatch]);

  return <div>{children}</div>;
};

export default UserInfoFetcher;
