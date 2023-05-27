import React from 'react';

// mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';

// mui styled components
import { styled } from '@mui/system';

const BodyWrapper = styled(Box)(() => ({
  width: '100%',
  height: '100vh',
  padding: '100px 0',
}));

const ContentWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: 28,
  [theme.breakpoints.up('md')]: {
    fontSize: 48,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 60,
  },
  fontWeight: 700,
  margin: '100px 0',
}));

const Body = () => {
  return (
    <BodyWrapper>
      <Container maxWidth="lg">
        <ContentWrapper>
          <Title align="center">
            게임 듀오찾기는
            <br />
            MatchGG에서 쉽고 빠르게
          </Title>
        </ContentWrapper>
      </Container>
    </BodyWrapper>
  );
};

export default Body;
