import React from 'react';

// mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// mui styled components
import { styled } from '@mui/system';

const Wrapper = styled(Box)(() => ({
  width: '100%',
  backgroundColor: '#ffffff',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '200px 0',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

const ColumnBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  padding: '25px 40px',
  [theme.breakpoints.up('md')]: {
    width: '50%',
    padding: '15px 10px',
  },
}));

const ColumnTitle = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 600,
  color: '#3182f6',
  padding: '0 0 40px',
  [theme.breakpoints.up('sm')]: {
    fontSize: 24,
  },
  [theme.breakpoints.up('md')]: {
    fontSize: 28,
  },
}));

const ColumnDescription = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  padding: '0 0 30px',
  [theme.breakpoints.up('sm')]: {
    fontSize: 20,
  },
  [theme.breakpoints.up('md')]: {
    fontSize: 22,
  },
}));

const Service = () => {
  return (
    <Wrapper>
      <Container maxWidth="lg">
        <ContentWrapper>
          <ColumnBox>
            <ColumnTitle>파티 찾기</ColumnTitle>
            <ColumnDescription>
              카드형 UI 를 통해
              <br />
              현재 모집중인 파티들을
              <br /> 한눈에 확인할 수 있어요.
              <br />
              <br />
              팔로우한 유저들의 새 게시글을
              <br /> 상단에서 먼저 확인할 수 있어요.
            </ColumnDescription>
            {/* image should be here ( Card UI and Party Modal ) */}
          </ColumnBox>
          <ColumnBox>
            <ColumnTitle>채팅</ColumnTitle>
            <ColumnDescription>
              파티에 참가하여 대화를 나눠보세요.
              <br />
              게임에 앞서, 상대방과 합을 맞출 수 있어요.
            </ColumnDescription>
            {/* image should be here ( chatroom UI ) */}
          </ColumnBox>
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
};

export default Service;
