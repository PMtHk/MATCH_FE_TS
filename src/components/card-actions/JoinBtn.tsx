import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ref, getDatabase } from 'firebase/database';

// mui
import styled from '@emotion/styled';
import MuiButton from '@mui/material/Button';

import { addMemberToFirebaseDB, isBanned } from 'apis/api/firebase';
import { authAxios } from 'apis/utils';
import { snackbarActions } from 'store/snackbar-slice';
import { RootState } from '../../store';
import { chatroomActions } from '../../store/chatroom-slice';

const JoinBtn = () => {
  const dispatch = useDispatch();

  // current game
  const currentGame = window.location.pathname.split('/')[1];

  const { notiToken } = useSelector((state: RootState) => state.notification);
  const nickname = useSelector(
    (state: RootState) =>
      state.user.games[`${currentGame as 'overwatch' | 'pubg' | 'lol'}`],
  );
  const { oauth2Id, isLogin } = useSelector((state: RootState) => state.user);

  const { chatRoomId, id } = useSelector(
    (state: RootState) => state.card.currentCard,
  );

  type Member = {
    nickname: string;
    oauth2Id: string;
    notiToken: string;
  };

  // 채팅방에 참여할 사용자 객체
  const newMember: Member = {
    nickname,
    oauth2Id,
    notiToken: notiToken || '',
  };

  // 파티 참가 함수
  const joinParty = async () => {
    const chatRoomRef = ref(getDatabase(), 'chatRooms');
    const messagesRef = ref(getDatabase(), 'messages');

    // 1. 밴 당한 사용자인지 확인
    if (await isBanned(chatRoomId, oauth2Id, chatRoomRef)) {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          severity: 'error',
          message: '이전의 강제퇴장으로 인해 참여하실 수 없습니다.',
        }),
      );
      dispatch(chatroomActions.LEAVE_JOINED_CHATROOMS_ID(chatRoomId));
      return;
    }

    // 2. 서버에 파티 참가 전송
    const response = await authAxios.post(
      `/api/chat/${currentGame}/${id}/member`,
    );

    if (response.status === 200) {
      await addMemberToFirebaseDB(
        newMember,
        chatRoomId,
        oauth2Id,
        nickname,
        chatRoomRef,
        messagesRef,
        dispatch,
      );
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={joinParty}
      disabled={!isLogin}
    >
      {!isLogin ? '로그인 후 참가하실 수 있습니다.' : '파티 참가'}
    </Button>
  );
};

export default JoinBtn;

const Button = styled(MuiButton)(() => ({
  p: 1,
  mt: 1,
  height: 40,
  borderColor: '#CCCCCC',
  color: '#5C5C5C',
  fontWeight: 700,
  ':hover': {
    borderColor: '#dddddd',
    backgroundColor: '#f3f3f3',
  },
})) as typeof MuiButton;
