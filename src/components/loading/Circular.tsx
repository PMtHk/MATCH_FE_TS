import React from 'react';

// mui
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

// mui styled components
import { styled } from '@mui/system';
import { Container } from '@mui/material';

interface CircularWrapperProps {
  height: string;
}

const CircularWrapper = styled(Box)(({ height }: CircularWrapperProps) => ({
  width: '100%',
  height,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '32px',
}));

const Text = styled(Typography)(() => ({
  color: '#2f3134',
  fontSize: 20,
  fontWeight: 700,
})) as typeof Typography;

interface CircularProps {
  text: string;
  height: string;
}

const Circular = ({ text, height }: CircularProps) => {
  return (
    <Container maxWidth="sm">
      <CircularWrapper height={height}>
        <CircularProgress color="inherit" />
        <Text>{text}</Text>
      </CircularWrapper>
    </Container>
  );
};

export default Circular;
