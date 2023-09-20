import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiButton from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Error';

import Modal from 'components/Modal';
import Circular from 'components/loading/Circular';
import CardDetailFetcher from '../../components/CardDetailFetcher';
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
          <CardDetailFetcher game="valorant">
            <CardDetailContainer />
          </CardDetailFetcher>
        </Suspense>
      </ErrorBoundary>
    </Modal>
  );
};

export default CardDetail;

interface ErrorBoundaryProps {
  error: any;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorBoundaryProps) => {
  const navigate = useNavigate();

  return (
    <ErrorFallbackWrapper role="alert">
      <ErrorTitle>
        <ErrorIcon sx={{ mr: 1 }} />
        문제가 발생했습니다.
      </ErrorTitle>
      <ErrorDetail>{error.message}</ErrorDetail>
      <MuiButton
        onClick={() => {
          navigate(-1);
        }}
      >
        뒤로가기
      </MuiButton>
    </ErrorFallbackWrapper>
  );
};

const ErrorFallbackWrapper = styled(MuiBox)(() => ({
  width: '100%',
  height: '100%',
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
