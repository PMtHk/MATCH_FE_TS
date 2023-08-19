import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiButton from '@mui/material/Button';

import { RootState } from 'store';
import { refreshActions } from 'store/refresh-slice';
import { snackbarActions } from 'store/snackbar-slice';
import { chatroomActions } from 'store/chatroom-slice';
import { getCurrentGame } from 'functions/commons';
import { GAME_ID } from 'types/games';
import { leaveParty } from 'apis/api/common';

const LeaveBtn = () => {
  const dispatch = useDispatch();

  const currentGame: GAME_ID = getCurrentGame();

  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { chatRoomId, id } = useSelector(
    (state: RootState) => state.card.currentCard,
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleLeaveBtn = async () => {
    try {
      await leaveParty(currentGame, id, chatRoomId, oauth2Id);

      dispatch(chatroomActions.LEAVE_JOINED_CHATROOMS_ID(chatRoomId));
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '파티를 떠났습니다.',
          severity: 'success',
        }),
      );
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
      dispatch(refreshActions.REFRESH_CARD());
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={handleLeaveBtn}
      disabled={isLoading}
    >
      {isLoading ? '파티에서 나가는 중입니다.' : '파티 탈퇴'}
    </Button>
  );
};

export default LeaveBtn;

const Button = styled(MuiButton)(() => ({
  padding: '8px 8px 8px 8px',
  margin: '8px 0 0 0',
  height: 40,
  borderColor: '#CCCCCC',
  color: '#5C5C5C',
  fontWeight: 700,
  '&:hover': {
    borderColor: '#dddddd',
    backgroundColor: '#f3f3f3',
  },
})) as typeof MuiButton;
