import React from 'react';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiButton from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Error';

interface ErrorBoundaryProps {
  error: any;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorBoundaryProps) => {
  return (
    <ErrorFallbackWrapper role="alert">
      <ErrorTitle>
        <ErrorIcon sx={{ mr: 1 }} />
        문제가 발생했습니다.
      </ErrorTitle>
      <ErrorDetail>{error.message}</ErrorDetail>
      <MuiButton onClick={resetErrorBoundary}>다시 시도</MuiButton>
    </ErrorFallbackWrapper>
  );
};

export default ErrorFallback;

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
