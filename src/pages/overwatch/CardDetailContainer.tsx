/* eslint-disable no-nested-ternary */
import React, { lazy, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';

import { RootState } from 'store';
import { cardActions } from 'store/card-slice';
import Timer from 'components/CountDownTimer';
import Circular from 'components/loading/Circular';
import { MEMBER_FROM_SERVER } from 'types/commons';
import CardControlPanel from 'components/card-actions/CardControlPanel';
import ChatRoomControl from 'components/chat/ChatRoomControl';
import { positionList, queueTypeList, tierList } from './data';
import MemberSlot from './MemberSlot';
import EmptySlot from './EmptySlot';

const ChatRoom = lazy(() => import('components/chat/ChatRoom'));

const CardDetailContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // redux
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard, isReviewed } = useSelector(
    (state: RootState) => state.card,
  );

  const authorNickname = useMemo(
    () => currentCard?.author.name.split('#')[0],
    [currentCard?.author.name],
  );

  const tier = useMemo(
    () => tierList.find((tier) => tier.value === currentCard?.tier),
    [currentCard?.tier],
  );

  const queueType = useMemo(
    () =>
      queueTypeList.find((queueType) => queueType.value === currentCard?.type),
    [currentCard?.type],
  );

  const position = useMemo(
    () =>
      positionList.find((position) => position.value === currentCard?.position),
    [currentCard?.position],
  );

  const totalMember = useMemo(() => queueType?.maxMember || 5, [queueType]);
  const currentMember = useMemo(
    () => currentCard?.memberList?.length || 1,
    [currentCard?.memberList],
  );

  const arrayForEmptySlot = new Array(totalMember - currentMember)
    .fill(0)
    .map((value, i) => `memberSlot_${i}`);

  if (currentCard) {
    return (
      <>
        <ModalHeader>
          <Title>{authorNickname} 님의 파티</Title>
          <MuiIconButton
            size="small"
            onClick={() => {
              dispatch(cardActions.SET_CURRENT_CARD(null));
              navigate('/overwatch');
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
              <HashTag>
                {currentCard?.voice === 'Y' ? '#음성채팅가능' : ''}
              </HashTag>
            </HashTagWrapper>
            <MemberListWrapper>
              <MemeberListTitle>
                참여자 목록 ( {currentMember} / {totalMember} )
              </MemeberListTitle>
              <MemberList>
                {currentCard &&
                  currentCard?.memberList?.map((member: MEMBER_FROM_SERVER) => {
                    return (
                      <MemberSlot
                        key={member.nickname}
                        name={member.nickname}
                        oauth2Id={member.oauth2Id}
                      />
                    );
                  })}
                {currentCard.finished === 'false' &&
                  arrayForEmptySlot.map((value, index) => (
                    <EmptySlot key={value} />
                  ))}
              </MemberList>
            </MemberListWrapper>
            <CardControlPanel />
          </CardInfo>
          <ChatRoomControl />
        </ModalContent>
      </>
    );
  }
  return (
    <LoadingWrapper>
      <Circular text="게시글을 불러오는 중입니다." height="100%" />
    </LoadingWrapper>
  );
};

export default CardDetailContainer;

const LoadingWrapper = styled(MuiBox)(() => ({
  width: '520px',
  height: '360px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})) as typeof MuiBox;

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
  height: '80px',
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
  minWidth: 600,
  minHeight: '480px',
  maxHeight: '480px',
  overflowY: 'auto',
  overflowX: 'hidden',
})) as typeof MuiBox;
