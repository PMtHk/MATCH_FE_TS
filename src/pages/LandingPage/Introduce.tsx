import React from 'react';
// import { useNavigate } from 'react-router-dom';

// mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// mui icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// mui styled components
import { styled } from '@mui/system';

import { SectionId } from './Content';
import GameSupport from './GameSupport';

const Wrapper = styled(Box)(() => ({
  width: '100%',
  background: 'linear-gradient(#ffffff, #3c393956)',
})) as typeof Box;

const ContentWrapper = styled(Box)(() => ({
  width: '100%',
  height: '100vh',
  padding: '300px 0 0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
})) as typeof Box;

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
})) as typeof Typography;

const LookAround = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: '300px',
  color: '#5e6064',
  fontSize: 20,
  [theme.breakpoints.up('md')]: {
    fontSize: 30,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 40,
  },
  fontWeight: 600,
  '&:hover': {},
})) as typeof Box;

interface ArrowDownBtnProps {
  children: React.ReactNode;
  onClick: () => void;
}

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

interface IIntroduceProps {
  addSectionRef: (id: SectionId, elem: HTMLElement) => void;
  moveToSection: (id: SectionId) => void;
}

const Introduce = ({ addSectionRef, moveToSection }: IIntroduceProps) => {
  // const navigate = useNavigate();

  // 둘러보기 영역 hover 상태 -> 지원게임 목록을 보여주기
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Wrapper
      ref={(elem: HTMLElement) => {
        addSectionRef('introduce', elem);
      }}
    >
      <Container maxWidth="lg">
        <ContentWrapper>
          <TitleTypo align="center">
            게임 듀오찾기는
            <br />
            <i>MatchGG </i>
            에서 쉽고 빠르게
          </TitleTypo>
          <LookAround
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {!isHovered && '둘러보러 가기'}
            {isHovered && <GameSupport />}
          </LookAround>
          <ArrowDownBtn onClick={() => moveToSection('description')}>
            <KeyboardArrowDownIcon />
          </ArrowDownBtn>
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
};

export default Introduce;
