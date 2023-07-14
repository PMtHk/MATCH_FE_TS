import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { child, get, getDatabase, ref, set } from 'firebase/database';

// mui
import { styled } from '@mui/system';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiMenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NotificationsActiveRounded from '@mui/icons-material/NotificationsActiveRounded';

import { RootState } from 'store';
import { getAChatRoomInfo, updateALastRead } from 'apis/api/firebase';
import NotiAccordionDetail from './NotiAccordionDetail';

type Member = {
  nickname: string;
  oauth2Id: string;
  notiToken: string | null;
};

type TChatRoomInfo = {
  content: string;
  createdBy: string;
  game: 'lol' | 'pubg' | 'overwatch';
  isDeleted: boolean;
  key: string;
  maxMember: number;
  members: Member[];
  roomId: string;
  timestamp: number | Date;
};

interface NotiAccordionProps {
  chatRoomId: string;
  timestamp: number;
}

const NotiAccordion = ({ chatRoomId, timestamp }: NotiAccordionProps) => {
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const currentChatRoomMessages = useSelector(
    (state: RootState) => state.message.messages[chatRoomId],
  );

  // 파이어베이스에서 채팅방 정보 가져오는 로딩
  const [isLoading, setIsLoading] = useState(true);
  // 파이어베이스에서 가져온 chatRoomInfo의 state
  const [chatRoomInfo, setChatRoomInfo] = useState<TChatRoomInfo>();

  // firebase
  const chatRoomsRef = ref(getDatabase(), 'chatRooms');

  // 채팅방 정보 가져오기
  useEffect(() => {
    const getChatRoomInfo = async () => {
      setIsLoading(true);

      try {
        const fetchedChatRoomInfo = await getAChatRoomInfo(
          chatRoomId,
          chatRoomsRef,
        );
        setChatRoomInfo(fetchedChatRoomInfo);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getChatRoomInfo();
  }, []);

  const deleteNotification = async () => {
    await updateALastRead(oauth2Id, chatRoomId, Date.now());
  };

  if (chatRoomInfo) {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <AccordionSummaryContent>
            <AccordionSummaryHeader>
              <MuiTypography
                noWrap
                sx={{
                  fontWeight: '560',
                }}
              >
                {`[${chatRoomInfo?.createdBy}] 님의 파티`}
              </MuiTypography>
              {currentChatRoomMessages?.length > 0 &&
                isLoading === false &&
                currentChatRoomMessages[currentChatRoomMessages.length - 1]
                  .timestamp > timestamp && (
                  <NotificationsActiveRounded
                    sx={{ color: 'orange', marginLeft: '4px' }}
                  />
                )}
            </AccordionSummaryHeader>
            <MuiTypography noWrap>{chatRoomInfo?.content}</MuiTypography>
          </AccordionSummaryContent>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: '240px', overflow: 'auto' }}>
          {currentChatRoomMessages &&
            [...currentChatRoomMessages].reverse().map((message) => {
              if (message.timestamp < timestamp) return null;
              return (
                <NotiAccordionDetail
                  key={message.timestamp}
                  message={message}
                  boardId={chatRoomInfo.roomId}
                />
              );
            })}
          <MenuItem
            onClick={() => {
              deleteNotification();
            }}
            sx={{}}
          >
            <DeleteTypo>지우기</DeleteTypo>
          </MenuItem>
        </AccordionDetails>
      </Accordion>
    );
  }
  return <Skeleton variant="rectangular" sx={{ margin: '4px' }} height={40} />;
};

export default NotiAccordion;

const AccordionSummaryContent = styled(MuiBox)(() => ({
  display: 'block',
  maxWidth: '280px',
})) as typeof MuiBox;

const AccordionSummaryHeader = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
})) as typeof MuiBox;

const MenuItem = styled(MuiMenuItem)(() => ({
  border: '1px solid lightgray',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
})) as typeof MuiMenuItem;

const DeleteTypo = styled(MuiTypography)(() => ({
  fontWeight: 'bold',
  color: 'orangered',
})) as typeof MuiTypography;
