import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ref, getDatabase, child, get, set, push } from 'firebase/database';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import MuiTextField from '@mui/material/TextField';
import Send from '@mui/icons-material/Send';

import { RootState } from 'store';
import { updateALastRead } from 'apis/api/firebase';
import { chatroomActions } from 'store/chatroom-slice';
import { refreshActions } from 'store/refresh-slice';
import { snackbarActions } from 'store/snackbar-slice';
import { getCurrentGame } from 'functions/commons';
import { GAME_ID } from 'types/games';
import ChatMessage from './ChatMessage';
import SystemMessage from './SystemMessage';

const ChatRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentGame: GAME_ID = getCurrentGame();

  const nickname = useSelector(
    (state: RootState) =>
      state.user.games[`${currentGame as 'overwatch' | 'pubg' | 'lol'}`],
  );
  const oauth2Id = useSelector((state: RootState) => state.user.oauth2Id);
  const { id, chatRoomId } = useSelector(
    (state: RootState) => state.card.currentCard,
  );
  const currentChatRoomMessages: any[] = useSelector(
    (state: RootState) => state.message.messages[chatRoomId],
  );

  // 메세지 전송중 state (true이면 전송중)
  const [messageSending, setMessageSending] = useState(false);

  // 메세지 인풋 state, 핸들러 함수
  const [content, setContent] = useState('');
  const handleContent = (e: any) => {
    setContent(e.target.value);
  };

  // 메세지 인풋에 포커스 되도록 Ref
  const inputRef = useRef<HTMLInputElement>(null);

  // 파이어베이스로 전송할 메세지 객체 생성 함수
  const createMessage = (timestamp: any) => {
    const message = {
      type: 'chat',
      timestamp,
      user: {
        nickname,
        oauth2Id,
      },
      content,
    };
    return message;
  };

  // 파이어베이스 Ref
  const chatRoomRef = ref(getDatabase(), 'chatRooms');
  const messagesRef = ref(getDatabase(), 'messages');

  // 메세지 전송 함수
  const postMessage = async () => {
    setMessageSending(true);
    // 메세지가 없으면 return
    if (!content) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.querySelector('input')?.focus();
        }
      }, 1000);
      setMessageSending(false);
      return;
    }

    // 종료된 파티인지 확인
    await get(child(chatRoomRef, chatRoomId)).then(async (datasnapshot) => {
      if (datasnapshot.val().isDeleted) {
        alert('종료된 파티입니다.');
        navigate(`${currentGame}`);
        return;
      }

      //  종료된 채팅방이 아닌 경우 (정상적인 프로세스)
      const members = [...datasnapshot.val().memberList];
      const oauth2IdList = members.map((member) => member.oauth2Id);
      const timestamp = Date.now();

      // oauth2Id를 통해 파티에 가입되어 있는지 확인
      if (oauth2IdList.includes(oauth2Id)) {
        // 해당 파티에 가입되어있는 정상적인 사용자
        // await updateLastRead(timestamp);
        await set(
          push(child(messagesRef, chatRoomId)),
          createMessage(timestamp),
        )
          .then(async () => {
            setContent('');
            setMessageSending(false);
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.querySelector('input')?.focus();
              }
            }, 0);
          })
          .catch((error) => {
            dispatch(
              snackbarActions.OPEN_SNACKBAR({
                message: '비정상적인 접근입니다.',
                severity: 'error',
              }),
            );
          });
      } else {
        // 가입되어있지 않은 사용자 (탈퇴되었거나 스스로 나간 경우)
        alert('유효하지 않은 사용자 입니다.');
        dispatch(chatroomActions.LEAVE_JOINED_CHATROOMS_ID(chatRoomId));
        dispatch(refreshActions.REFRESH_CARD());
      }
    });
  };

  // 엔터키 입력 시 메세지 전송
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      postMessage();
    }
  };
  // 자동으로 채팅창의 하당으로 스크롤 되도록 Ref
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      updateALastRead(oauth2Id, chatRoomId);
    }
  }, [currentChatRoomMessages]);

  return (
    <ChatRoomWrapper>
      <ChatRoomHeader>파티 전용 채팅</ChatRoomHeader>
      <ChatMessageWrapper ref={scrollRef}>
        {currentChatRoomMessages &&
          currentChatRoomMessages.map((message, idx) => {
            const msgBySameSender =
              message.user.nickname ===
              currentChatRoomMessages[idx - 1]?.user.nickname;
            if (message.type === 'chat') {
              return (
                <ChatMessage
                  key={message.timestamp}
                  messageInfo={message}
                  msgBySameSender={msgBySameSender}
                />
              );
            }
            return (
              <SystemMessage
                key={message.timestamp + Math.random() * 10000}
                messageInfo={message}
              />
            );
          })}
      </ChatMessageWrapper>
      <InputWrapper>
        <TextField
          placeholder="메세지를 입력하세요."
          disabled={messageSending}
          value={content}
          onChange={handleContent}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoFocus
          ref={inputRef}
          InputProps={{
            endAdornment: (
              <MuiIconButton size="small" onClick={postMessage}>
                <Send />
              </MuiIconButton>
            ),
          }}
        />
      </InputWrapper>
    </ChatRoomWrapper>
  );
};

export default ChatRoom;

const ChatRoomWrapper = styled(MuiBox)(() => ({
  width: '100%',
  height: '100%',
})) as typeof MuiBox;

const ChatRoomHeader = styled(MuiTypography)(() => ({
  color: 'grey',
  fontSize: 14,
  fontWeight: 600,
  padding: '0 0 0 0',
})) as typeof MuiTypography;

const ChatMessageWrapper = styled(MuiBox)(() => ({
  backgroundColor: 'rgba(236, 236, 236, 0.5)',
  width: 400,
  height: '0px',
  minHeight: 'calc(100% - 67.5px)',
  maxHeight: 'calc(100% - 67.5px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  borderRadius: '4px',
  padding: '8px',
  overflowX: 'hidden',
  overflowY: 'auto',
})) as typeof MuiBox;

const InputWrapper = styled(MuiBox)(() => ({
  width: '100%',
  height: 40,
}));

const TextField = styled(MuiTextField)(() => ({
  width: '100%',
  height: 40,
  margin: '6px 0 0 0 ',
  '& .MuiInputBase-root': {
    height: 40,
  },
  '& .MuiInputBase-input': {
    padding: 'auto',
  },
}));
