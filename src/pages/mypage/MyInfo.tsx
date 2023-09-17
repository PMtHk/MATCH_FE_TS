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

const MemoizedContent = React.memo(Content);

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

const MyInfo = ({
  email,
  created,
  likeCount,
  dislikeCount,
  matchCount,
}: {
  email: string;
  created: string;
  likeCount: number;
  dislikeCount: number;
  matchCount: number;
}) => {
  return (
    <>
      <Info title="이메일 및 가입 일자">
        <MemoizedContent title="이메일" content={email} />
        <MemoizedContent title="가입 일자" content={created.slice(0, 11)} />
      </Info>

      <Info title="받은 평가">
        <MemoizedContent title="매칭 횟수" content={matchCount} />
        <MemoizedContent title="받은 좋아요" content={likeCount} />
        <MemoizedContent title="받은 싫어요" content={dislikeCount} />
      </Info>
    </>
  );
};

const MemoizedMyInfo = React.memo(MyInfo);

export default MemoizedMyInfo;

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
