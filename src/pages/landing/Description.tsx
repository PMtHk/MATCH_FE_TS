import React from 'react';

// mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// mui styled components
import { styled } from '@mui/system';

import { SectionId } from './Content';

const Wrapper = styled(Box)(() => ({
  width: '100%',
  backgroundColor: '#d5d5d6',
})) as typeof Box;

const ContentWrapper = styled(Box)(() => ({
  width: '100%',
  height: '40vh',
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})) as typeof Box;

const TitleTypo = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  [theme.breakpoints.up('md')]: {
    fontSize: 22,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 28,
  },
  fontWeight: 700,
  margin: '20px 0 50px',
})) as typeof Typography;

interface DescriptionProps {
  addSectionRef: (id: SectionId, elem: HTMLElement) => void;
  moveToSection: (id: SectionId) => void;
}

const Description = ({ addSectionRef, moveToSection }: DescriptionProps) => {
  return (
    <Wrapper
      id="description"
      ref={(elem: HTMLElement) => {
        addSectionRef('description', elem);
      }}
    >
      <Container maxWidth="lg">
        <ContentWrapper>
          <TitleTypo align="center">
            여러 게임의 플레이어를 한 곳에서 찾아보세요.
            <br />
            <i>MatchGG </i>와 함께라면 듀오찾기가 더 편리해질 거예요.
            <br />
          </TitleTypo>
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
};

export default Description;
