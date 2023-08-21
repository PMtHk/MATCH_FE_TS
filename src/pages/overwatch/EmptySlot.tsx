import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import { Button, OutlinedInput, CircularProgress } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { RootState } from 'store';
import { refreshActions } from 'store/refresh-slice';
import { snackbarActions } from 'store/snackbar-slice';
import { addPartyMemberWithName } from 'apis/api/common';
import { loadHistory, verifyNickname } from 'apis/api/overwatch';

// 방장이 아닌 사용자의 경우
const DefaultEmptySlot = () => {
  return (
    <EmptySlotWrapper>
      <ErrorOutlineIcon />
      <EmptySlotTypo>모집 중</EmptySlotTypo>
    </EmptySlotWrapper>
  );
};

// 방장의 경우
const EmptySlotForAuthor = () => {
  const dispatch = useDispatch();

  const { currentCard } = useSelector((state: RootState) => state.card);
  // 추가하기 버튼과 닉네임 입력창을 전환할 state
  const [isEntering, setIsEntering] = useState(false);

  // 추가할 사용자의 nickname, 핸들러 함수
  const [name, setName] = useState('');

  const handleName = (e: any) => {
    setName(e.target.value);
  };

  // 닉네임 인증 요청시 인증중(loading) 상태를 관리하는 state
  const [isLoading, setIsLoading] = useState(false);

  // 추가할 멤버의 닉네임 입력 후 추가하기 버튼 클릭시 호출할 함수
  const hanldeAddPartyMember = async () => {
    const newMember = {
      nickname: name,
      oauth2Id: '',
      notiToken: '',
      isReviewed: false,
    };
    try {
      setIsLoading(true);
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '사용자 정보를 불러오는 중입니다. 잠시만 기다려 주세요.',
          severity: 'info',
        }),
      );

      // 닉네임 인증
      const isExist = await verifyNickname(name.trim());
      if (isExist && currentCard.banList.includes(name.trim())) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '파티에서 강제퇴장 당한 사용자입니다.',
            severity: 'warning',
          }),
        );
        return;
      }
      if (currentCard.memberList.includes(name.trim())) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '이미 파티에 참여한 사용자입니다.',
            severity: 'warning',
          }),
        );
        return;
      }
      // 전적 받아오기 -> DB
      await loadHistory(name.trim());
      // 파티에 해당 멤버 추가
      await addPartyMemberWithName(
        'overwatch',
        currentCard?.id,
        currentCard.chatRoomId,
        name.trim(),
      );

      dispatch(refreshActions.REFRESH_CARD());

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: `파티에 "${name.trim()}" 님을 추가했습니다.`,
          severity: 'success',
        }),
      );
    } catch (error: any) {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: error.response.data.message,
          severity: 'error',
        }),
      );
    } finally {
      setIsLoading(false);
      setName('');
      setIsEntering(false);
    }
  };

  return (
    <EmptySlotWrapper
      sx={{
        backgroundColor: isEntering ? '#fff' : '#ececec',
      }}
    >
      {isEntering ? (
        <OutlinedInput
          placeholder="닉네임과 배틀태그를 입력하세요"
          autoFocus
          sx={{
            width: '100%',
            height: '100%',
          }}
          value={name}
          onChange={handleName}
          disabled={!!isLoading}
          endAdornment={
            isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Button size="small" onClick={hanldeAddPartyMember}>
                추가하기
              </Button>
            )
          }
        />
      ) : (
        <Button
          sx={{
            width: '100%',
            height: '100%',
          }}
          onClick={() => setIsEntering(true)}
        >
          파티원 추가하기
        </Button>
      )}
    </EmptySlotWrapper>
  );
};

const EmptySlot = () => {
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);
  const isAuthor = oauth2Id === currentCard.oauth2Id;

  return isAuthor ? <EmptySlotForAuthor /> : <DefaultEmptySlot />;
};

export default EmptySlot;

const EmptySlotWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 90,
  width: 625,
  backgroundColor: '#d8d8d8c8',
  color: '#5C5C5C',
  border: '1px solid #CCCCCC',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 4px 0',
})) as typeof MuiBox;

const EmptySlotTypo = styled(MuiTypography)(() => ({
  fontSize: 16,
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  margin: '0 0 0 8px',
})) as typeof MuiTypography;
