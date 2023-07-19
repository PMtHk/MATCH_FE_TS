import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';

import { SelectChangeEvent } from '@mui/material';

import Layout from 'components/Layout';
import ErrorFallback from 'components/errorFallback/ErrorFallback';
import Circular from 'components/loading/Circular';

import CardFilter from './CardFilter';
import CardListFetcher from './CardListFetcher';
import CardListContainer from './CardListContainer';

const Main = () => {
  const [platform, setPlatform] = React.useState('ALL');
  const [type, setType] = React.useState('ALL');
  const [tier, setTier] = React.useState('ALL');

  const handlePlatform = (e: SelectChangeEvent) => {
    setPlatform(e.target.value);
  };

  const handleType = (e: SelectChangeEvent) => {
    setType(e.target.value);
  };

  const handleTier = (e: SelectChangeEvent) => {
    setTier(e.target.value);
  };

  const filterProps = {
    platform,
    handlePlatform,
    type,
    handleType,
    tier,
    handleTier,
  };

  const fetcherProps = {
    platform,
    type,
    tier,
  };

  return (
    <>
      <Layout currentGame="pubg">
        <CardFilter filterProps={filterProps} />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense
            fallback={
              <Circular text="게시글을 불러오는 중입니다." height="500px" />
            }
          >
            <CardListFetcher fetcherProps={fetcherProps}>
              <CardListContainer />
            </CardListFetcher>
          </Suspense>
        </ErrorBoundary>
      </Layout>
      <Outlet />
    </>
  );
};

export default Main;
