import { Button } from '@mui/material';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';

import { RootState } from 'store';
import { authAxios } from 'apis/utils';
import { removeMemberFromFirebaseDB } from 'apis/api/firebase';

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

  type Member = {
    nickname: string;
    oauth2Id: string;
    notiToken: string;
  };

  const targetMember: Member = {
    nickname,
    oauth2Id,
    notiToken: '',
  };

  const leaveParty = async () => {
    try {
      const chatRoomRef = ref(getDatabase(), 'chatRooms');
      const messagesRef = ref(getDatabase(), 'messages');

      const response = await authAxios.delete(
        `/api/chat/${currentGame}/${id}/member`,
      );

      if (response.status === 200) {
        await removeMemberFromFirebaseDB(
          targetMember,
          chatRoomId,
          chatRoomRef,
          messagesRef,
          dispatch,
        );
      }

      window.location.reload();
    } catch (error) {
      console.log(error);
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
    >
      파티 탈퇴
    </Button>
  );
};

export default LeaveBtn;
