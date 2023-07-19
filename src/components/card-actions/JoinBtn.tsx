import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ref, getDatabase } from 'firebase/database';

// mui
import styled from '@emotion/styled';
import MuiButton from '@mui/material/Button';

import { addMemberToFirebaseDB, isBanned } from 'apis/api/firebase';
import { authAxios } from 'apis/utils';
import { snackbarActions } from 'store/snackbar-slice';
import { joinParty } from 'apis/api/user';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { chatroomActions } from '../../store/chatroom-slice';

const JoinBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const JoinBtnHandler = async () => {
    const banned = await isBanned(chatRoomId, oauth2Id);
    if (!banned) {
      try {
        await joinParty(currentGame, id, chatRoomId, newMember, dispatch);
        navigate(0);
      } catch (error) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '파티 참가에 실패했습니다. 잠시 후 다시 시도해주세요.',
            severity: 'error',
          }),
        );
      }
    } else {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '차단된 사용자입니다.',
          severity: 'warning',
        }),
      );
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={JoinBtnHandler}
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
