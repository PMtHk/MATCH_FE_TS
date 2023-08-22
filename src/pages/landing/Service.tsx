import React from 'react';

// mui
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Service = () => {
  return (
    <Wrapper>
      <Container maxWidth="lg">
        <ContentWrapper>
          <ColumnBox>
            <ColumnText>
              <ColumnTitle>파티 찾기</ColumnTitle>
              <ColumnDescription>
                인게임 데이터,
                <br />
                모집현황을,
                <br /> 카드형 UI를 통해
                <br /> 한눈에
              </ColumnDescription>
            </ColumnText>
            <CardUIImageWrapper>
              <img
                src="https://d18ghgbbpc0qi2.cloudfront.net/assets/landing/CardUI.png"
                alt="card_design"
              />
            </CardUIImageWrapper>
            <UserUIImageWrapper>
              <img
                src="https://d18ghgbbpc0qi2.cloudfront.net/assets/landing/UserUI.png"
                alt="usercard_design"
              />
            </UserUIImageWrapper>
          </ColumnBox>
          <ColumnBox>
            <ColumnText>
              <ColumnTitle>채팅</ColumnTitle>
              <ColumnDescription>
                팀원과의 합,
                <br />
                파티 전용 채팅을 통해
                <br /> 미리 맞춰보기
              </ColumnDescription>
            </ColumnText>
          </ColumnBox>
          <ColumnBox>
            <ColumnText>
              <ColumnTitle>알림</ColumnTitle>
              <ColumnDescription>
                기약없는 기다림이 아닌
                <br />
                빠른 플레이를 위해
              </ColumnDescription>
            </ColumnText>
          </ColumnBox>
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
};

export default Service;

const Wrapper = styled(Box)(() => ({
  width: '100%',
  backgroundColor: '#ffffff',
})) as typeof Box;

const ContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '100px 0 150px 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '160px',
})) as typeof Box;

const ColumnBox = styled(Box)(({ theme }) => ({
  width: '100%',
  position: 'relative',
  padding: '25px 40px',
  [theme.breakpoints.up('md')]: {
    padding: '15px 10px',
  },
})) as typeof Box;

const ColumnText = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
})) as typeof Box;

const ColumnTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 500,
  color: '#3182f6',
  padding: '0 0 30px',
  [theme.breakpoints.up('md')]: {
    fontSize: 28,
  },
})) as typeof Typography;

const ColumnDescription = styled(Typography)(({ theme }) => ({
  fontSize: 28,
  fontWeight: 600,
  padding: '0 0 30px',
  [theme.breakpoints.up('md')]: {
    fontSize: 50,
  },
})) as typeof Typography;

const CardUIImageWrapper = styled(Box)(({ theme }) => ({
  '& > img': {
    width: '100%',
    cover: 'object-fit',
    maxWidth: '500px',
  },
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
    top: '70px',
    right: '0px',
  },
  [theme.breakpoints.up('lg')]: {
    position: 'absolute',
    top: '70px',
    right: '30px',
  },
}));

const UserUIImageWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& > img': {
    width: '100%',
    cover: 'object-fit',
    maxWidth: '700px',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
  },
}));
