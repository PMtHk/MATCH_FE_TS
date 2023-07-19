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

const DeleteCardBtn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { chatRoomId, id } = useSelector(
    (state: RootState) => state.card.currentCard,
  );

  const currentGame = window.location.pathname.split('/')[1];

  // 서버에 알리기
  const deleteParty = async () => {
    await authAxios
      .delete(`/api/${currentGame}/board/${id}`)
      .then(async (response) => {
        if (response.status === 200) {
          // Firebase Realtime DB의 isDeleted 를 true로 설정
          await update(ref(getDatabase(), `chatRooms/${chatRoomId}`), {
            isDeleted: true,
          })
            .then(() => {
              dispatch(chatroomActions.LEAVE_JOINED_CHATROOMS_ID(chatRoomId));
            })
            .then(() => {
              navigate(`/${currentGame}`, { replace: true });
              window.location.reload();
            })
            .catch((error) => console.log(error));
        }
      });
  };

  return (
    <Button
      variant="outlined"
      size="small"
      color="warning"
      onClick={deleteParty}
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
