import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { authAxios, defaultAxios } from 'apis/utils';
import { RootState } from 'store';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import { Button, OutlinedInput, CircularProgress } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { snackbarActions } from 'store/snackbar-slice';
import { verifyPUBGNickname, loadPubgPlayerInfoIntoDB } from 'apis/api/pubg';
import { addPartyMemberWithName } from 'apis/api/common';
import { addMemberToFirebaseDB } from 'apis/api/firebase';

// 방장이 아닌 유저
const DefaultEmptySlot = () => {
  return (
    <EmptySlotWrapper>
      <ErrorOutlineIcon />
      <EmptySlotTypo>모집 중</EmptySlotTypo>
    </EmptySlotWrapper>
  );
};

// 방장
const EmptySlotForAuthor = ({ platform }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentCard } = useSelector((state: RootState) => state.card);

  // 추가하기 버튼과 닉네임 입력창을 전환할 state
  const [isEntering, setIsEntering] = useState(false);

  // 추가할 사용자의 nickname, 핸들러 함수
  const [name, setName] = useState('');

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // 닉네임 인증 요청시 인증중(loading) 상태를 관리하는 state
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPartyMember = async () => {
    const newMember = {
      nickname: name,
      oauth2Id: '',
      notiToken: '',
    };

    try {
      setIsLoading(true);
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '플레이어 정보를 불러오는 중입니다. 잠시만 기다려 주세요.',
          severity: 'info',
        }),
      );

      // 닉네임 인증
      const exactNickname = await verifyPUBGNickname(
        name.trim(),
        currentCard.platform,
      );
      if (currentCard.banList.includes(exactNickname)) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '파티에서 강제퇴장 당한 사용자입니다.',
            severity: 'warning',
          }),
        );
        return;
      }
      if (currentCard.memberList.includes(name)) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '이미 파티에 참여한 사용자입니다.',
            severity: 'warning',
          }),
        );
        return;
      }
      // 전적 받아오기 -> DB
      await loadPubgPlayerInfoIntoDB(name, currentCard.platform);
      // 파티에 해당 멤버 추가
      // (Server)
      await addPartyMemberWithName(currentCard?.id, name, 'pubg');
      // FB
      await addMemberToFirebaseDB(newMember, currentCard.chatRoomId, dispatch);

      await window.location.reload();

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: `파티에 ${name} 님을 추가했습니다.`,
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
    }
  };

  return (
    <EmptySlotWrapper sx={{ backgroundColor: isEntering ? '#FFF' : '#ECECEC' }}>
      {isEntering ? (
        <OutlinedInput
          placeholder="플레이어 이름을 입력해주세요."
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
              <Button size="small" onClick={handleAddPartyMember}>
                추가하기
              </Button>
            )
          }
        />
      ) : (
        <Button
          sx={{ width: '100%', height: '100%' }}
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
  minHeight: 80,
  width: 520,
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
