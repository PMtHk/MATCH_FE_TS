import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';

import { RootState } from 'store';

// components
import Layout from 'components/Layout';
import ErrorFallback from 'components/errorFallback/ErrorFallback';
import Circular from 'components/loading/Circular';
import UserInfoFetcher from './UserInfoFetcher';
import UserInfoContainer from './UserInfoContainer';

const MyPage = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={
          <Circular text="유저정보를 불러오는 중입니다." height="500px" />
        }
      >
        <UserInfoFetcher>
          <UserInfoContainer />
        </UserInfoFetcher>
      </Suspense>
    </ErrorBoundary>
  );
};

export default MyPage;
