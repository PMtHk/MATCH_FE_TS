import { Button } from '@mui/material';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  set,
  update,
} from 'firebase/database';

import { RootState } from 'store';
import { authAxios } from 'apis/utils';
import { removeMemberFromFirebaseDB } from 'apis/api/firebase';
import { refreshActions } from 'store/refresh-slice';
import { snackbarActions } from 'store/snackbar-slice';

const LeaveBtn = () => {
  const dispatch = useDispatch();

  // current game
  const currentGame = window.location.pathname.split('/')[1];

  // redux
  const nickname = useSelector(
    (state: RootState) =>
      state.user.games[`${currentGame as 'overwatch' | 'pubg' | 'lol'}`],
  );
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { chatRoomId, id } = useSelector(
    (state: RootState) => state.card.currentCard,
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  type Member = {
    nickname: string;
    oauth2Id: string;
    notiToken: string;
    isReviewed: boolean;
  };

  const targetMember: Member = {
    nickname,
    oauth2Id,
    notiToken: '',
    isReviewed: false,
  };

  const leaveParty = async () => {
    try {
      setIsLoading(true);
      const chatRoomsRef = ref(getDatabase(), 'chatRooms');
      const messagesRef = ref(getDatabase(), 'messages');

      const response = await authAxios.delete(
        `/api/chat/${currentGame}/${id}/member`,
      );

      if (response.status === 200) {
        await removeMemberFromFirebaseDB(
          targetMember,
          chatRoomId,
          chatRoomsRef,
          messagesRef,
          dispatch,
        );
      }

      dispatch(refreshActions.REFRESH_CARD());
    } catch (error: any) {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message:
            '파티를 나가는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          severity: 'error',
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      sx={{
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
      }}
      onClick={leaveParty}
      disabled={isLoading}
    >
      {isLoading ? '파티에서 나가는 중입니다.' : '파티 탈퇴'}
    </Button>
  );
};

export default LeaveBtn;
