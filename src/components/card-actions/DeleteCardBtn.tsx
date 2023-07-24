import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ref, getDatabase, update } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

// mui
import styled from '@emotion/styled';
import MuiButton from '@mui/material/Button';

import { authAxios } from 'apis/utils';
import { RootState } from 'store';
import { chatroomActions } from 'store/chatroom-slice';
import { snackbarActions } from 'store/snackbar-slice';
import { deleteCard } from 'apis/api/common';

const DeleteCardBtn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { chatRoomId, id } = useSelector(
    (state: RootState) => state.card.currentCard,
  );

  const currentGame = window.location.pathname.split('/')[1];

  const deleteBtnHandler = async () => {
    try {
      await deleteCard(currentGame, id, chatRoomId);
      dispatch(chatroomActions.LEAVE_JOINED_CHATROOMS_ID(chatRoomId));
      navigate(`/${currentGame}`);
      navigate(0);
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '게시글이 삭제되었습니다.',
          severity: 'success',
        }),
      );
    } catch (error) {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '게시글 삭제에 실패했습니다. 잠시 후, 다시 시도해주세요.',
          severity: 'error',
        }),
      );
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      color="warning"
      onClick={deleteBtnHandler}
    >
      게시글 삭제
    </Button>
  );
};

export default DeleteCardBtn;

const Button = styled(MuiButton)(() => ({
  width: '100%',
  p: 1,
  height: 40,
  borderColor: '#CCCCCC',
  fontWeight: 700,
  ':hover': {
    borderColor: '#dddddd',
    backgroundColor: '#f3f3f3',
  },
})) as typeof MuiButton;
