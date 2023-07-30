/* eslint-disable no-nested-ternary */
import React, { lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import MuiStack from '@mui/material/Stack';

import { RootState } from 'store';
import Timer from 'components/CountDownTimer';
import { cardActions } from 'store/card-slice';
import EditCardBtn from 'components/card-actions/EditCardBtn';
import LeaveBtn from 'components/card-actions/LeaveBtn';
import JoinBtn from 'components/card-actions/JoinBtn';
import DeleteCardBtn from 'components/card-actions/DeleteCardBtn';
import Circular from 'components/loading/Circular';
import { positionList, queueTypeList, tierList } from './data';
import MemberSlot from './MemberSlot';
import EmptySlot from './EmptySlot';

const ChatRoom = lazy(() => import('components/chat/ChatRoom'));

const CardDetailContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // redux
  const { oauth2Id, isLogin } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);
  const { joinedChatRoomsId } = useSelector(
    (state: RootState) => state.chatroom,
  );

  const tier = tierList.find((tier) => tier.value === currentCard?.tier);
  const queueType = queueTypeList.find(
    (queueType) => queueType.value === currentCard?.type,
  );
  const position = positionList.find(
    (lane) => lane.value === currentCard?.position,
  );

  const totalMember = queueType?.maxMember || 5;
  const currentMember = currentCard?.memberList?.length || 0;

  const arrayForEmptySlot = new Array(totalMember - currentMember)
    .fill(0)
    .map((value, i) => `memberSlot_${i}`);

  if (currentCard) {
    return (
      <>
        <ModalHeader>
          <Title>{currentCard?.author.name} 님의 파티</Title>
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
              <HashTag>{currentCard?.voice ? '#음성채팅가능' : ''}</HashTag>
            </HashTagWrapper>
            <MemberListWrapper>
              <MemeberListTitle>
                참여자 목록 ( {currentMember} / {totalMember} )
              </MemeberListTitle>
              <MemberList>
                {currentCard &&
                  currentCard?.memberList?.map((member: string) => {
                    return <MemberSlot key={member} name={member} />;
                  })}
                {arrayForEmptySlot.map((value, index) => (
                  <EmptySlot key={value} />
                ))}
              </MemberList>
            </MemberListWrapper>
            {isLogin && joinedChatRoomsId.includes(currentCard.chatRoomId) ? (
              oauth2Id === currentCard.oauth2Id ? (
                <MuiStack direction="row" spacing={2} mt={1}>
                  <DeleteCardBtn />
                  <EditCardBtn />
                </MuiStack>
              ) : (
                <LeaveBtn />
              )
            ) : currentCard.expired === 'true' ? (
              <div />
            ) : (
              <JoinBtn />
            )}
          </CardInfo>
          {isLogin && joinedChatRoomsId.includes(currentCard.chatRoomId) && (
            <Suspense
              fallback={<Circular text="채팅방 불러오는 중" height="100%" />}
            >
              <MuiBox sx={{ ml: 2 }}>
                <ChatRoom />
              </MuiBox>
            </Suspense>
          )}
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
  height: '42px',
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
  minHeight: '470px',
  maxHeight: '470px',
  overflow: 'auto',
})) as typeof MuiBox;
