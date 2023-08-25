import React, { Suspense, useEffect } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import ErrorIcon from '@mui/icons-material/Error';

import { RootState } from 'store';
import FollowCardListContainer from 'components/followersCard/FollowCardListContainer';
import FollowCardListFetcher from 'components/followersCard/FollowCardListFetcher';
import Circular from 'components/loading/Circular';
import { getCurrentGame } from 'functions/commons';

const FollowersCard = () => {
  const currentGame = getCurrentGame();

  const { remainingTime } = useSelector((state: RootState) => state.refresh);

  const [refresh, setRefresh] = React.useState<number>(0);

  useEffect(() => {
    if (remainingTime < 1) {
      setRefresh((prev) => prev + 1);
      console.log('refreshed');
    }
  }, [remainingTime]);

  return (
    <ErrorBoundary
      resetKeys={[refresh]}
      FallbackComponent={FollowCardListErrorFallback}
    >
      <Suspense fallback={<CardListFetcherFallback />}>
        <FollowCardListFetcher game={currentGame} refresh={refresh}>
          <FollowCardListContainer />
        </FollowCardListFetcher>
      </Suspense>
    </ErrorBoundary>
  );
};

export default FollowersCard;

const CardListFetcherFallback = () => {
  return (
    <Circular text="팔로우한 사용자들의 게시글을 찾고 있어요." height="300px" />
  );
};

const FollowCardListErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  return (
    <ErrorFallbackWrapper role="alert">
      <ErrorTitle>
        <ErrorIcon sx={{ mr: 1, fontSize: '16px' }} />
        다른 사용자들을 팔로우하면 이곳에 먼저 표시됩니다.
      </ErrorTitle>
    </ErrorFallbackWrapper>
  );
};

const ErrorFallbackWrapper = styled(MuiBox)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px',
})) as typeof MuiBox;

const ErrorTitle = styled(MuiTypography)(() => ({
  display: 'flex',
  fontSize: '14px',
  justifyContent: 'center',
  alignItems: 'center',
})) as typeof MuiTypography;
