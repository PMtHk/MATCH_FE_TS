import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDatabase,
  ref,
  set,
  child,
  onChildChanged,
  onValue,
  onChildAdded,
} from 'firebase/database';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiTooltip from '@mui/material/Tooltip';
import MuiBadge from '@mui/material/Badge';
import MuiMenu from '@mui/material/Menu';
import MuiIconButton from '@mui/material/Button';
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import Delete from '@mui/icons-material/Delete';

import { updateLastReads } from 'apis/api/firebase';
import { RootState } from 'store';
import { notificationActions } from 'store/notification-slice';
import { messageActions, Message } from 'store/message-slice';
import { chatroomActions } from 'store/chatroom-slice';
import { CHATROOM } from 'types/chats';
import { refreshActions } from 'store/refresh-slice';
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

  const { joinedChatRoomsId, detachedListener } = useSelector(
    (state: RootState) => state.chatroom,
  );
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { messages } = useSelector((state: RootState) => state.message);
  const { badgeNum, timestamps, detachedLastRead } = useSelector(
    (state: RootState) => state.notification,
  );

  // 파이어베이스의 lastRead 래퍼런스
  const lastReadRef = ref(getDatabase(), `lastRead/${oauth2Id}`);

  useEffect(() => {
    const handleBadge = () => {
      let numOfAlarm = 0;

      joinedChatRoomsId.map((aChatRoom: CHATROOM) => {
        if (joinedChatRoomsId && messages[aChatRoom.chatRoomId]) {
          Object.values(messages[aChatRoom.chatRoomId]).map(
            (aMessage: Message) => {
              if (aMessage.timestamp > timestamps[aChatRoom.chatRoomId]) {
                numOfAlarm += 1;
              }
              return null;
            },
          );
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
  }, [messages, dispatch, timestamps]);

  // 모든 채팅방에 lastRead 업데이트

  const deleteAllNotiHandler = async () => {
    await updateLastReads(oauth2Id, joinedChatRoomsId);
    handleNotiClose();
  };

  // 파이어베이스 messagesRef
  const messagesRef = ref(getDatabase(), 'messages');

  useEffect(() => {
    // 메세지 각 채팅방의 메세지 리스너 추가
    const addFirebaseListener = async () => {
      joinedChatRoomsId.forEach((aChatRoom: CHATROOM) => {
        if (!detachedListener.includes(aChatRoom.chatRoomId)) {
          onChildAdded(
            child(messagesRef, aChatRoom.chatRoomId),
            (datasnapshot) => {
              const data = {
                chatRoomId: aChatRoom.chatRoomId,
                message: datasnapshot.val(),
              };
              if (data.message.timestamp > aChatRoom.firstRead) {
                dispatch(messageActions.SET_MESSAGES(data));
              }
              if (data.message.type === 'system') {
                dispatch(refreshActions.REFRESH_CARD());
              }
            },
          );
          dispatch(chatroomActions.ADD_DETACHEDLISTENER(aChatRoom.chatRoomId));
        }
      });
    };

    const addLastReadListener = async () => {
      joinedChatRoomsId.forEach((aChatRoom: CHATROOM) => {
        if (!detachedLastRead.includes(aChatRoom.chatRoomId)) {
          onValue(
            child(lastReadRef, aChatRoom.chatRoomId),
            (datasnapshot: any) => {
              dispatch(
                notificationActions.SET_TIMESTAMPS({
                  chatRoomId: datasnapshot.key,
                  timestamp: datasnapshot.val(),
                }),
              );
            },
          );
          dispatch(
            notificationActions.ADD_DETACHED_LASTREAD(aChatRoom.chatRoomId),
          );
        }
      });
    };

    addFirebaseListener();
    addLastReadListener();
  }, [dispatch, joinedChatRoomsId]);

  // accordion -> 한번에 하나만 열리도록

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleAccordion =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      <MuiTooltip title="알림">
        <IconButton
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            handleNotiClick(event);
          }}
        >
          <Badge badgeContent={badgeNum} color="warning">
            <NotificationsNone
              sx={{
                color: '#dddddd',
                fontSize: '30px',
                p: 0,
              }}
            />
          </Badge>
        </IconButton>
      </MuiTooltip>
      <Menu
        anchorEl={notiAnchorEl}
        id="notification-menu"
        open={notiOpen}
        onClose={handleNotiClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <HeaderTypo>받은 알림</HeaderTypo>
        <ChatRoomsWrapper>
          {joinedChatRoomsId &&
            joinedChatRoomsId.map((aChatRoom) => {
              if (messages[aChatRoom.chatRoomId]) {
                const lastMessages = Object.values(
                  messages[aChatRoom.chatRoomId],
                ).slice(-1)[0];
                if (lastMessages.timestamp > timestamps[aChatRoom.chatRoomId]) {
                  return (
                    <NotiAccordion
                      expanded={expanded === aChatRoom.chatRoomId}
                      expandHandler={handleAccordion}
                      key={aChatRoom.chatRoomId}
                      chatRoomId={aChatRoom.chatRoomId}
                      timestamp={timestamps[aChatRoom.chatRoomId]}
                      handleNotiClose={handleNotiClose}
                    />
                  );
                }
              }
              return null;
            })}
          {badgeNum === 0 ? (
            <NoAlaram>
              <NoAlaramTypo>새로운 알림이 없습니다.</NoAlaramTypo>
            </NoAlaram>
          ) : null}
        </ChatRoomsWrapper>
        {badgeNum !== 0 ? (
          <MenuItem onClick={deleteAllNotiHandler}>
            <Delete sx={{ color: 'orangered' }} />
            <DeleteAllTypo>모든 알림 지우기</DeleteAllTypo>
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
};

export default Notification;

const Badge = styled(MuiBadge)(() => ({
  cursor: 'pointer',
  '& .MuiBadge-dot': {
    borderRadius: '100%',
  },
})) as typeof MuiBadge;

const ChatRoomsWrapper = styled(MuiBox)(() => ({
  width: '360px',
  maxHeight: '60vh',
  overflowY: 'auto',
  overflowX: 'hidden',
  gap: '4px',
})) as typeof MuiBox;

const Menu = styled(MuiMenu)(({ theme }) => ({
  padding: '0',
  margin: '20px 0 0 0',
  '& .MuiMenu-paper': {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ececec',
    borderRadius: '4px',
    padding: '0',
    margin: '0',
  },
  '& .MuiList-root': {
    padding: '0',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
})) as typeof MuiMenu;

const MenuItem = styled(MuiMenuItem)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
}));

const DeleteAllTypo = styled(MuiTypography)(() => ({
  fontSize: '12px',
  fontWeight: 'bold',
  color: 'orangered',
  padding: '8px 0 8px 0',
})) as typeof MuiTypography;

const NoAlaram = styled(MuiBox)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  padding: '40px 0',
})) as typeof MuiBox;

const NoAlaramTypo = styled(MuiTypography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
})) as typeof MuiTypography;

const HeaderTypo = styled(MuiTypography)(({ theme }) => ({
  fontSize: '15px',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  padding: '8px',
})) as typeof MuiTypography;

const IconButton = styled(MuiIconButton)(({ theme }) => ({
  padding: '0',
  margin: '0',
  '& .MuiButtonBase-root': {
    padding: '0',
  },
})) as typeof MuiIconButton;
