import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDatabase,
  ref,
  set,
  child,
  onChildChanged,
  onChildAdded,
} from 'firebase/database';

// mui
import { Tooltip, Badge, Menu, Box, MenuItem, Typography } from '@mui/material';
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import Delete from '@mui/icons-material/Delete';

import { notificationActions } from 'store/notification-slice';
import { RootState } from 'store';
import { updateLastReads } from 'apis/api/firebase';
import { messageActions, Message } from 'store/message-slice';
import { getUserChatRooms } from 'apis/api/user';
import { chatroomActions } from 'store/chatroom-slice';
import NotiAccordion from './NotiAccordion';

interface NotificationProps {
  notiAnchorEl: HTMLElement | null;
  notiOpen: boolean;
  handleNotiClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleNotiClose: () => void;
}

const Notification = ({
  notiAnchorEl,
  notiOpen,
  handleNotiClick,
  handleNotiClose,
}: NotificationProps) => {
  const dispatch = useDispatch();

  const { joinedChatRoomsId } = useSelector(
    (state: RootState) => state.chatroom,
  );
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { messages } = useSelector((state: RootState) => state.message);
  const { badgeNum, timestamps } = useSelector(
    (state: RootState) => state.notification,
  );

  // 파이어베이스의 lastRead 래퍼런스
  const lastReadRef = ref(getDatabase(), `lastRead/${oauth2Id}`);

  useEffect(() => {
    const handleBadge = async () => {
      let numOfAlarm = 0;

      joinedChatRoomsId.map((aChatRoomId: string) => {
        if (joinedChatRoomsId && messages[aChatRoomId]) {
          Object.values(messages[aChatRoomId]).map((aMessage: Message) => {
            if (aMessage.timestamp > timestamps[aChatRoomId]) {
              numOfAlarm += 1;
            }
            return null;
          });
          return null;
        }
        return null;
      });

      if (numOfAlarm > 0) {
        dispatch(notificationActions.SET_BADGE_NUM(numOfAlarm));
      } else {
        dispatch(notificationActions.SET_BADGE_NUM(0));
      }
    };
    handleBadge();
  }, [messages, joinedChatRoomsId, dispatch, timestamps]);

  // 모든 채팅방에 lastRead 업데이트

  const deleteAllNotiHandler = async () => {
    await updateLastReads(oauth2Id, joinedChatRoomsId);
    handleNotiClose();
  };

  useEffect(() => {
    // chatRoom의 마지막 접근시간을 받는 리스너 함수
    const addLastReadListener = async () => {
      onChildChanged(lastReadRef, (datasnapshot) => {
        dispatch(
          notificationActions.SET_TIMESTAMPS({
            chatRoomId: datasnapshot.key,
            timestamp: datasnapshot.val(),
          }),
        );
      });
    };

    addLastReadListener();
  }, []);

  // 파이어베이스 messagesRef
  const messagesRef = ref(getDatabase(), 'messages');

  useEffect(() => {
    // 메세지 각 채팅방의 메세지 리스너 추가
    const addFirebaseListener = async () => {
      joinedChatRoomsId.forEach((chatRoomId) => {
        onChildAdded(child(messagesRef, chatRoomId), (datasnapshot) => {
          const data = {
            chatRoomId,
            message: datasnapshot.val(),
          };
          // 각 채팅방의 메세지를 리덕스에 저장
          dispatch(messageActions.SET_MESSAGES(data));
        });
      });
    };

    addFirebaseListener();
  }, [dispatch]);

  return (
    <>
      <Tooltip title="알림">
        <Badge
          badgeContent={badgeNum}
          sx={{
            cursor: 'pointer',
            '& .MuiBadge-dot': {
              width: 12,
              height: 12,
              borderRadius: '100%',
            },
          }}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            handleNotiClick(event);
          }}
          color="warning"
        >
          <NotificationsNone sx={{ color: '#dddddd', fontSize: '24px' }} />
        </Badge>
      </Tooltip>
      <Menu
        anchorEl={notiAnchorEl}
        id="notification-menu"
        open={notiOpen}
        onClose={handleNotiClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box
          sx={{
            width: '360px',
            maxHeight: '50vh',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {joinedChatRoomsId &&
            joinedChatRoomsId.map((chatRoomId) => {
              return (
                <NotiAccordion
                  key={chatRoomId}
                  chatRoomId={chatRoomId}
                  timestamp={timestamps[chatRoomId]}
                />
              );
            })}
        </Box>
        <MenuItem
          onClick={deleteAllNotiHandler}
          sx={{
            borderTop: '1px solid gray',
            marginRight: '4px',
            marginLeft: '4px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Delete sx={{ color: 'orangered' }} />
          <Typography
            sx={{
              fontWeight: 'bold',
              color: 'orangered',
            }}
          >
            모두 지우기
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Notification;
