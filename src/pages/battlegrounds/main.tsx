/* eslint-disable react/button-has-type */
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiContainer from '@mui/material/Container';
import MuiPagination from '@mui/material/Pagination';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiButton from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Error';
import { SelectChangeEvent } from '@mui/material/Select';

import Circular from 'components/loading/Circular';
import { cardActions } from 'store/card-slice';
import { RootState } from 'store';
import FollowersCard from 'components/followersCard/FollowersCard';
import CardFilter from './CardFilter';
import CardListFetcher from '../../components/CardListFetcher';
import CardListContainer from './CardListContainer';

const Main = () => {
  const dispatch = useDispatch();

  const { isLogin } = useSelector((state: RootState) => state.user);

  const [platform, setPlatform] = React.useState('ALL');
  const [type, setType] = React.useState('ALL');
  const [tier, setTier] = React.useState('ALL');

  const { totalPage, currentPage } = useSelector(
    (state: RootState) => state.card,
  );

  const handlePlatform = (e: SelectChangeEvent) => {
    dispatch(cardActions.SET_CURRENT_PAGE(0));
    setPlatform(e.target.value);
  };

  const handleType = (e: SelectChangeEvent) => {
    dispatch(cardActions.SET_CURRENT_PAGE(0));
    setType(e.target.value);
  };

  const handleTier = (e: SelectChangeEvent) => {
    dispatch(cardActions.SET_CURRENT_PAGE(0));
    setTier(e.target.value);
  };

  const handlePage = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(cardActions.SET_CURRENT_PAGE(value - 1));
    window.scrollTo(0, 0);
  };

  const filterProps = {
    platform,
    handlePlatform,
    type,
    handleType,
    tier,
    handleTier,
  };

  const fetchParams = {
    platform,
    type,
    tier,
  };

  const gameDeps = [platform, type, tier];

  return (
    <>
      <CardFilter filterProps={filterProps} />
      {isLogin && <FollowersCard game="pubg" />}
      {!isLogin && <MuiBox sx={{ height: '30px' }} />}
      <ErrorBoundary
        resetKeys={gameDeps}
        FallbackComponent={CardListErrorFallback}
      >
        <Suspense fallback={<CardListFetcherFallback />}>
          <CardListFetcher game="pubg" params={fetchParams} gameDeps={gameDeps}>
            <CardListContainer />
          </CardListFetcher>
        </Suspense>
      </ErrorBoundary>
      <Pagination
        count={totalPage}
        page={currentPage + 1}
        color="primary"
        onChange={handlePage}
      />
      <Outlet />
    </>
  );
};

export default Main;

const CardListFetcherFallback = () => {
  return (
    <Circular text="게시글을 불러오는 중입니다." height="calc(100vh - 386px)" />
  );
};

interface ErrorBoundaryProps {
  error: any;
  resetErrorBoundary: () => void;
}

const CardListErrorFallback = ({
  error,
  resetErrorBoundary,
}: ErrorBoundaryProps) => {
  return (
    <ErrorFallbackWrapper role="alert">
      <ErrorTitle>
        <ErrorIcon sx={{ mr: 1 }} />
        검색된 파티가 없어요...
      </ErrorTitle>
      <ErrorDetail>다른 조건으로 파티를 다시 검색해 보세요.</ErrorDetail>
      <MuiButton onClick={resetErrorBoundary}>다시 검색하기</MuiButton>
    </ErrorFallbackWrapper>
  );
};

const Pagination = styled(MuiPagination)(() => ({
  margin: '10px 0 30px 0',
}));

const ErrorFallbackWrapper = styled(MuiBox)(() => ({
  width: '100%',
  height: 'calc(100vh - 386px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const ErrorTitle = styled(MuiTypography)(() => ({
  display: 'flex',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  justifyContent: 'center',
  alignItems: 'center',
})) as typeof MuiTypography;

const ErrorDetail = styled(MuiTypography)(() => ({
  fontSize: '1rem',
  marginBottom: '1rem',
})) as typeof MuiTypography;
