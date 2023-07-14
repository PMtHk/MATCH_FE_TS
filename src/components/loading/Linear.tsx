import React from 'react';

// mui
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

// mui styled components
import { styled } from '@mui/system';
import { Container } from '@mui/material';

interface LinearWrapperProps {
  height: string;
}

const LinearWrapper = styled(Box)(({ height }: LinearWrapperProps) => ({
  width: '100%',
  height,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '32px',
})) as typeof Box;

const Text = styled(Typography)(() => ({
  color: '#2f3134',
  fontSize: 20,
  fontWeight: 700,
})) as typeof Typography;

interface LinearProps {
  text: string;
  height: string;
}

const Linear = ({ text, height }: LinearProps) => {
  return (
    <Container maxWidth="sm">
      <LinearWrapper height={height}>
        <LinearProgress color="inherit" sx={{ width: '100%' }} />
        <Text>{text}</Text>
      </LinearWrapper>
    </Container>
  );
};

export default Linear;
