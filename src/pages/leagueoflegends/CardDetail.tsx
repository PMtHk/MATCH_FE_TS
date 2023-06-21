import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorFallback from 'components/errorFallback/ErrorFallback';
import CardDetailFetcher from './CardDetailFetcher';
import CardDetailContainer from './CardDetailContainer';

const CardDetail = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CardDetailFetcher>
        <CardDetailContainer />
      </CardDetailFetcher>
    </ErrorBoundary>
  );
};

export default CardDetail;
