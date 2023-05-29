import React from 'react';
import { useNavigate } from 'react-router-dom';

// mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// mui icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// mui styled components
import { styled } from '@mui/system';

import { SectionId, refType } from './Content';

const Wrapper = styled(Box)(() => ({
  width: '100%',
  background: 'linear-gradient(#ffffff, #3c393956)',
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
  fontWeight: 700,
  margin: '20px 0 50px',
  [theme.breakpoints.up('md')]: {
    fontSize: 48,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 60,
  },
}));

const LookAroundBtn = styled(Button)(({ theme }) => ({
  color: '#5e6064',
  fontSize: 20,
  [theme.breakpoints.up('md')]: {
    fontSize: 30,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 40,
  },
  fontWeight: 600,
  '&:hover': {
    borderRadius: 0,
    transform: 'translateY(-5px)',
  },
}));

type ArrowDownBtnProps = {
  children: React.ReactNode;
  onClick: () => void;
};

const ArrowDownBtn = styled(IconButton)<ArrowDownBtnProps>(() => ({
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
  '& > *': {
    fontSize: '45px',
    transform: 'scale(2, 1)',
  },
}));

type IntroduceProps = {
  addSectionRef: (id: SectionId, elem: HTMLElement) => void;
  moveToSection: (id: SectionId) => void;
};

const Introduce = ({ addSectionRef, moveToSection }: IntroduceProps) => {
  const navigate = useNavigate();

  return (
    <Wrapper
      ref={(elem: HTMLElement) => {
        addSectionRef('introduce', elem);
      }}
    >
      <Container maxWidth="lg">
        <ContentWrapper>
          <Title>
            <TitleTypo align="center">
              게임 듀오찾기는
              <br />
              <i>MatchGG </i>
              에서 쉽고 빠르게
            </TitleTypo>
            <LookAroundBtn onClick={() => navigate('/lol')}>
              둘러보러 가기
            </LookAroundBtn>
            <ArrowDownBtn onClick={() => moveToSection('description')}>
              <KeyboardArrowDownIcon />
            </ArrowDownBtn>
          </Title>
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
};

export default Introduce;
