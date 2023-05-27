import React from 'react';

// mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';

// mui icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// mui styled components
import { styled } from '@mui/system';

const Wrapper = styled(Box)(() => ({
  width: '100%',
}));

const ContentWrapper = styled(Box)(() => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Title = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const TitleTypo = styled(Typography)(({ theme }) => ({
  fontSize: 28,
  [theme.breakpoints.up('md')]: {
    fontSize: 48,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 60,
  },
  fontWeight: 700,
  margin: '20px 0 50px',
}));

const TitleSubTypo = styled(Typography)(({ theme }) => ({
  color: '#5e6064',
  fontSize: 20,
  [theme.breakpoints.up('md')]: {
    fontSize: 30,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 40,
  },
  fontWeight: 600,
}));

const ArrowDown = styled(KeyboardArrowDownIcon)(() => ({
  fontSize: 48,
  position: 'absolute',
  bottom: 0,
  color: '#6c5757',
  '@keyframes bounce': {
    '0%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-10px)',
    },
    '100%': {
      transform: 'translateY(0px)',
    },
  },
  animation: 'bounce 2s infinite',
}));

const Content = () => {
  return (
    <Wrapper>
      <Container maxWidth="lg">
        <ContentWrapper>
          <Title>
            <TitleTypo align="center">
              게임 듀오찾기는
              <br />
              <i>MatchGG </i>
              에서 쉽고 빠르게
            </TitleTypo>
            <TitleSubTypo align="center">바로 찾으러 가기</TitleSubTypo>
            <ArrowDown />
          </Title>
        </ContentWrapper>
        <ContentWrapper>test</ContentWrapper>
      </Container>
    </Wrapper>
  );
};

export default Content;
