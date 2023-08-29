import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// components
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
