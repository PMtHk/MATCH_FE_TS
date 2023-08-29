import React from 'react';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';

import { RootState } from 'store';

type ContentProps = {
  title: string;
  content: string | number;
};

const Content = ({ title, content }: ContentProps) => {
  return (
    <FlexRow>
      <SectionSubTitle>{title}</SectionSubTitle>
      <SectionContent>{content}</SectionContent>
    </FlexRow>
  );
};

type InfoProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

const Info = ({ title, children }: InfoProps) => {
  return (
    <Section>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </Section>
  );
};

const MyInfo = () => {
  const { email, created, likeCount, dislikeCount, matchCount } = useSelector(
    (state: RootState) => state.mypage,
  );

  return (
    <>
      <Info title="이메일 및 가입 일자">
        <Content title="이메일" content={email} />
        <Content title="가입 일자" content={created.slice(0, 11)} />
      </Info>

      <Info title="받은 평가">
        <Content title="매칭 횟수" content={matchCount} />
        <Content title="받은 좋아요" content={likeCount} />
        <Content title="받은 싫어요" content={dislikeCount} />
      </Info>
    </>
  );
};
export default MyInfo;

const Container = styled(MuiBox)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '16px',
  paddingRight: '12px',
}));

const Section = styled(MuiBox)(() => ({
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
