import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Modal from 'components/Modal';
import ErrorFallback from 'components/errorFallback/ErrorFallback';
import Circular from 'components/loading/Circular';
import CardDetailFetcher from './CardDetailFetcher';
import CardDetailContainer from './CardDetailContainer';

const CardDetail = () => {
  return (
    <Modal>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense
          fallback={
            <Circular text="게시글을 불러오는 중입니다." height="568px" />
          }
        >
          <CardDetailFetcher>
            <CardDetailContainer />
          </CardDetailFetcher>
        </Suspense>
      </ErrorBoundary>
    </Modal>
  );
};

export default CardDetail;
