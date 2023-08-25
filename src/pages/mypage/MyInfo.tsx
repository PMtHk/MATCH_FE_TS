import React from 'react';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import { Divider } from '@mui/material';

import { RootState } from 'store';

const MyInfo = () => {
  const { email, created, likeCount, dislikeCount, matchCount } = useSelector(
    (state: RootState) => state.mypage,
  );

  return (
    <Container>
      <MenuTitle>내 정보</MenuTitle>
      <Section>
        <SectionTitle>이메일 및 가입 일자</SectionTitle>
        <FlexRow>
          <SectionSubTitle>이메일</SectionSubTitle>
          <SectionContent>{email}</SectionContent>
        </FlexRow>
        <FlexRow>
          <SectionSubTitle>가입 일자</SectionSubTitle>
          <SectionContent>{created.slice(0, 11)}</SectionContent>
        </FlexRow>
      </Section>
      <Section>
        <SectionTitle>받은 평가</SectionTitle>
        <FlexRow>
          <SectionSubTitle>매칭 횟수</SectionSubTitle>
          <SectionContent>{matchCount}</SectionContent>
        </FlexRow>
        <FlexRow>
          <SectionSubTitle>받은 좋아요</SectionSubTitle>
          <SectionContent>{likeCount}</SectionContent>
        </FlexRow>
        <FlexRow>
          <SectionSubTitle>받은 싫어요</SectionSubTitle>
          <SectionContent>{dislikeCount}</SectionContent>
        </FlexRow>
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
  paddingRight: '12px',
}));

const MenuTitle = styled(MuiTypography)(() => ({
  width: '100%',
  fontSize: '18px',
  fontWeight: '700',
  paddingLeft: '8px',
})) as typeof MuiTypography;

const Section = styled(MuiBox)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '8px 0 8px 8px',
  gap: '8px',
  marginTop: '24px',
  border: '1px solid lightgray',
  borderRadius: '4px',
}));

const SectionTitle = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '8px',
}));

const SectionSubTitle = styled(MuiTypography)(() => ({
  minWidth: '140px',
  fontSize: '16px',
  fontWeight: '500',
  paddingLeft: '8px',
}));

const SectionContent = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '400',
}));

const FlexRow = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
})) as typeof MuiBox;
