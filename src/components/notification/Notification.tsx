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
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiTooltip from '@mui/material/Tooltip';
import MuiBadge from '@mui/material/Badge';
import MuiMenu from '@mui/material/Menu';
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import Delete from '@mui/icons-material/Delete';

import { updateLastReads } from 'apis/api/firebase';
import { RootState } from 'store';
import { notificationActions } from 'store/notification-slice';
import { messageActions, Message } from 'store/message-slice';
import { chatroomActions } from 'store/chatroom-slice';
import { CHATROOM } from 'types/chats';
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
  const { badgeNum, timestamps } = useSelector(
    (state: RootState) => state.notification,
  );
  const { currentCard } = useSelector((state: RootState) => state.card);

  // 파이어베이스의 lastRead 래퍼런스
  const lastReadRef = ref(getDatabase(), `lastRead/${oauth2Id}`);

  useEffect(() => {
    const handleBadge = async () => {
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
      joinedChatRoomsId.forEach((aChatRoom: CHATROOM) => {
        if (!detachedListener.includes(aChatRoom.chatRoomId)) {
          onChildAdded(
            child(messagesRef, aChatRoom.chatRoomId),
            (datasnapshot) => {
              const data = {
                chatRoomId: aChatRoom.chatRoomId,
                message: datasnapshot.val(),
              };
              dispatch(messageActions.SET_MESSAGES(data));
            },
          );
          dispatch(chatroomActions.ADD_DETACHEDLISTENER(aChatRoom.chatRoomId));
        }
      });
    };

    addFirebaseListener();
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
        <Badge
          badgeContent={badgeNum}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            handleNotiClick(event);
          }}
          color="warning"
        >
          <NotificationsNone
            sx={{
              color: '#dddddd',
              fontSize: '30px',
              paddingBottom: notiOpen ? '1px' : 'none',
              borderBottom: notiOpen ? '1px solid #dddddd' : 'none',
            }}
          />
        </Badge>
      </MuiTooltip>
      <Menu
        anchorEl={notiAnchorEl}
        id="notification-menu"
        open={notiOpen}
        onClose={handleNotiClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <ChatRoomsWrapper>
          {joinedChatRoomsId &&
            joinedChatRoomsId.map((aChatRoom) => {
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
            })}
        </ChatRoomsWrapper>
        <MenuItem onClick={deleteAllNotiHandler}>
          <Delete sx={{ color: 'orangered' }} />
          <DeleteAllTypo>모든 알림 지우기</DeleteAllTypo>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Notification;

const Badge = styled(MuiBadge)(() => ({
  cursor: 'pointer',
  '& .MuiBadge-dot': {
    width: 12,
    height: 12,
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

const Menu = styled(MuiMenu)(() => ({
  margin: '20px 0 0 0',
})) as typeof MuiMenu;

const MenuItem = styled(MuiMenuItem)(() => ({
  margin: '8px 4px 0 4px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
}));

const DeleteAllTypo = styled(MuiTypography)(() => ({
  fontSize: '12px',
  fontWeight: 'bold',
  color: 'orangered',
})) as typeof MuiTypography;
