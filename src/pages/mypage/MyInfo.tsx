import React from 'react';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';

import { RootState } from 'store';
import { Divider } from '@mui/material';

const MyInfo = () => {
  const { email, created, likeCount, dislikeCount, matchCount } = useSelector(
    (state: RootState) => state.mypage,
  );

  return (
    <Container>
      <MenuTitle>내 정보</MenuTitle>
      <Divider />
      <Section>
        <SectionTitle>이메일 및 가입 일자</SectionTitle>
        <SectionContentTypo>이메일 : {email}</SectionContentTypo>
        <SectionContentTypo>
          가입일자 : {created.slice(0, 11)}
        </SectionContentTypo>
      </Section>
      <Section>
        <SectionTitle>받은 평가</SectionTitle>
        <SectionContentTypo>매칭 횟수 : {matchCount}</SectionContentTypo>
        <SectionContentTypo>받은 좋아요 : {likeCount}</SectionContentTypo>
        <SectionContentTypo>받은 싫어요 : {dislikeCount}</SectionContentTypo>
      </Section>
    </Container>
  );
};
export default MyInfo;

const Container = styled(MuiBox)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '16px',
}));

const MenuTitle = styled(MuiTypography)(() => ({
  width: '100%',
  fontSize: '18px',
  fontWeight: '700',
  padding: '0 0 0 8px',
})) as typeof MuiTypography;

const Section = styled(MuiBox)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '8px 0 0 16px',
  gap: '8px',
}));

const SectionTitle = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '8px',
}));

const SectionContentTypo = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '500',
  padding: '0 0 0 16px',
}));
