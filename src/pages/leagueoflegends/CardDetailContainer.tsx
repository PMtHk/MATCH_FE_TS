import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import MuiImageList from '@mui/material/ImageList';
import MuiImageListItem from '@mui/material/ImageListItem';

import Close from '@mui/icons-material/Close';

import { RootState } from 'store';

import Timer from 'components/CountDownTimer';

import { cardActions } from 'store/card-slice';
import { Button } from '@mui/material';
import { positionList, queueTypeList, tierList } from './data';

import MemberSlot from './MemberSlot';
import EmptySlot from './EmptySlot';

const CardDetailContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);

  const tier = tierList.find((tier) => tier.value === currentCard?.tier);
  const queueType = queueTypeList.find(
    (queueType) => queueType.value === currentCard?.type,
  );
  const position = positionList.find(
    (lane) => lane.value === currentCard?.position,
  );

  const totalMember = queueType?.maxMember || 5;
  const currentMember = currentCard?.memberList?.length || 0;

  if (currentCard) {
    return (
      <>
        <ModalHeader>
          <Title>{currentCard?.name} 님의 파티</Title>
          <MuiIconButton
            size="small"
            onClick={() => {
              dispatch(cardActions.SET_CURRENT_CARD(null));
              navigate('/lol');
            }}
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
              <MemberList>
                {currentCard &&
                  currentCard?.memberList?.map((member: string) => {
                    return <MemberSlot key={member} summonerName={member} />;
                  })}
                {Array(totalMember - currentMember).fill(<EmptySlot />)}
              </MemberList>
            </MemberListWrapper>
            <Button onClick={() => navigate('edit')}>test</Button>
          </CardInfo>
        </ModalContent>
      </>
    );
  }
  return <div />;
};

export default CardDetailContainer;

const ModalHeader = styled(MuiBox)(() => ({
  width: '100%',
  minWidth: '368px',
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
  maxWidth: '400px',
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
  wordBreak: 'break-all',
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

const MemberList = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  minWidth: 520,
  minHeight: 440,
  overflow: 'auto',
})) as typeof MuiBox;

const Member = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '520px',
  height: '80px',
  border: '1px solid #cccccc',
  borderRadius: '8px',
  padding: '8px',
  margin: '0 0 4px 0',
})) as typeof MuiBox;

const SectionInMember = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
})) as typeof MuiBox;

const SectionTitleInMember = styled(MuiTypography)(() => ({
  color: '#878888',
  fontSize: '12px',
  fontWeight: '700',
})) as typeof MuiTypography;

const Nickname = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '700',
})) as typeof MuiTypography;

const MostLaneInfo = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  '& > img': {
    mixBlendMode: 'exclusion',
  },
})) as typeof MuiBox;

const MostLanteTypo = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 0 4px',
})) as typeof MuiTypography;

const FlexRow = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})) as typeof MuiBox;

const RankEmblemWrapper = styled(MuiBox)(() => ({
  backgroundColor: '#e3e0e0',
  borderRadius: '50%',
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 4px 0 0',
})) as typeof MuiBox;

const TierWinRateWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '0 0 0 4px',
})) as typeof MuiBox;

const TierTypo = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '500',
  color: '#000000',
})) as typeof MuiTypography;

const MatchPlayed = styled(MuiTypography)(() => ({
  fontSize: '12px',
  fontWeight: '500',
  color: '#000000',
})) as typeof MuiTypography;

const WinRate = styled(MuiTypography)(() => ({
  fontSize: '12px',
  fontWeight: '600',
  padding: '0 0 0 2px',
})) as typeof MuiTypography;
