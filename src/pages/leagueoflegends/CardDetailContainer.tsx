import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';

import Close from '@mui/icons-material/Close';

import { RootState } from 'store';

import Timer from 'components/CountDownTimer';
import Circular from 'components/loading/Circular';
import { positionList, queueTypeList, tierList } from './data';

const CardDetailContainer = () => {
  const navigate = useNavigate();
  const { currentCard } = useSelector((state: RootState) => state.card);

  const tier = tierList.find((tier) => tier.value === currentCard?.tier);
  const queueType = queueTypeList.find(
    (queueType) => queueType.value === currentCard?.type,
  );
  const position = positionList.find(
    (lane) => lane.value === currentCard?.position,
  );

  const totalMember = queueType?.maxMember;
  const currentMember = currentCard?.memberList?.length || 0;

  const createdDate = `${currentCard?.created}`;

  if (currentCard) {
    return (
      <>
        <ModalHeader>
          <Title>{currentCard?.name} 님의 파티</Title>
          <MuiIconButton
            size="small"
            onClick={() => navigate('/lol')}
            sx={{ p: 0, m: 0 }}
          >
            <Close />
          </MuiIconButton>
        </ModalHeader>
        <ModalContent>
          <CardInfo>
            <InfoWrapper>
              <SectionWrapper>
                <SectionName>모집 내용</SectionName>
                <SectionContent>{currentCard?.content}</SectionContent>
              </SectionWrapper>
              <SectionWrapper>
                <SectionName>마감일시</SectionName>

                <div>
                  {currentCard?.expire && currentCard?.created && (
                    <Timer
                      expire={currentCard?.expire}
                      created={currentCard?.created || '2000-01-01 00:00:00'}
                    />
                  )}
                </div>
              </SectionWrapper>
            </InfoWrapper>
            <HashTagWrapper>
              <HashTag color={tier?.color}>#{tier?.label}</HashTag>
              <HashTag>#{queueType?.label}</HashTag>
              <HashTag>#{position?.label}구함</HashTag>
              <HashTag>{currentCard?.voice ? '#음성채팅가능' : ''}</HashTag>
            </HashTagWrapper>
            <MemberListWrapper>
              <MemeberListTitle>
                참여자 목록 ( {currentMember} / {totalMember} )
              </MemeberListTitle>
            </MemberListWrapper>
          </CardInfo>
        </ModalContent>
      </>
    );
  }
  return <Circular text="게시글을 불러오는 중입니다." height="500px" />;
};

export default CardDetailContainer;

const ModalHeader = styled(MuiBox)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 0 8px 0',
})) as typeof MuiBox;

const Title = styled(MuiTypography)(() => ({
  fontSize: '24px',
  fontWeight: '700',
})) as typeof MuiTypography;

const ModalContent = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
})) as typeof MuiBox;

const CardInfo = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
})) as typeof MuiBox;

const InfoWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
})) as typeof MuiBox;

const SectionWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '360px',
  padding: '0 40px 0 0 ',
})) as typeof MuiBox;

const SectionName = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '700',
  color: '#878888',
})) as typeof MuiTypography;

const SectionContent = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '400',
})) as typeof MuiTypography;

const HashTagWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '8px 0 0 0',
})) as typeof MuiBox;

const HashTag = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '600',
  padding: '0 16px 0 0',
})) as typeof MuiTypography;

const MemberListWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 0 0 0',
})) as typeof MuiBox;

const MemeberListTitle = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '700',
  color: '#878888',
})) as typeof MuiTypography;
