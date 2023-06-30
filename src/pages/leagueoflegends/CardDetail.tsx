import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Modal from 'components/Modal';
import ErrorFallback from 'components/errorFallback/ErrorFallback';
import CardDetailFetcher from './CardDetailFetcher';
import CardDetailContainer from './CardDetailContainer';

const CardDetail = () => {
  return (
    <Modal>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<p>loading...1,2,3,4,5,6</p>}>
          <CardDetailFetcher />
        </Suspense>
      </ErrorBoundary>
    </Modal>
  );
};

export default CardDetail;
