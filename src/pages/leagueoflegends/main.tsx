/* eslint-disable react/button-has-type */
import React, { Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// mui
import { styled } from '@mui/system';
import Layout from 'components/Layout';
import { SelectChangeEvent } from '@mui/material/Select';

import ErrorFallback from 'components/errorFallback/ErrorFallback';
import Circular from 'components/loading/Circular';
import { Outlet } from 'react-router-dom';
import CardFilter from './CardFilter';
import CardListContainer from './CardListContainer';
import CardListFetcher from './CardListFetcher';

const Main = () => {
  const [queueType, setQueueType] = React.useState('ALL');
  const [tier, setTier] = React.useState('ALL');
  const [lane, setLane] = React.useState<string>('ALL');

  const handleQueueType = (event: SelectChangeEvent) => {
    if (event.target.value === 'ARAM') {
      setTier('ALL');
      setLane('ALL');
    }

    setQueueType(event.target.value);
  };

  const handleTier = (event: SelectChangeEvent) => {
    setTier(event.target.value);
  };

  const handleLane = (
    event: React.MouseEvent<HTMLElement>,
    newLane: string,
  ) => {
    if (newLane !== null) {
      setLane((_prev) => {
        return newLane;
      });
    }
  };

  const filterProps = {
    queueType,
    handleQueueType,
    tier,
    handleTier,
    lane,
    handleLane,
  };

  const fetcherProps = {
    lane,
    queueType,
    tier,
  };

  return (
    <>
      <Layout currentGame="lol">
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
