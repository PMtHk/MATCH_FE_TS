import React from 'react';
import { Link } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiMenuItem from '@mui/material/MenuItem';
import MuiTypography from '@mui/material/Typography';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

interface UserNotiProps {
  nickname: string;
  content: string;
}

const NotificationOfUserAction = ({ nickname, content }: UserNotiProps) => {
  return (
    <UserMenuItem>
      <Username>{nickname}</Username>
      <UserContent>{content}</UserContent>
    </UserMenuItem>
  );
};

interface SystemNotiProps {
  content: string;
}

const NotificationOfSystemAction = ({ content }: SystemNotiProps) => {
  return (
    <SystemMenuItem>
      <InfoOutlined
        sx={{
          marginRight: '4px',
          color: 'gray',
        }}
        fontSize="small"
      />
      <SystemContent noWrap>{content}</SystemContent>
    </SystemMenuItem>
  );
};

interface NotiAccordionDetailProps {
  message: {
    user: {
      nickname: string;
      oauth2Id: string;
    };
    type: string;
    timestamp: number;
    content: string;
  };
  boardId: string;
  game: string;
}

const NotiAccordionDetail = ({
  message,
  boardId,
  game,
}: NotiAccordionDetailProps) => {
  return (
    <Link
      to={`/${game}/${boardId}`}
      style={{ textDecoration: 'none', color: 'black' }}
    >
      {message.type === 'system' ? (
        <NotificationOfSystemAction content={message.content} />
      ) : (
        <NotificationOfUserAction
          nickname={message.user.nickname}
          content={message.content}
        />
      )}
    </Link>
  );
};

export default NotiAccordionDetail;

// notification of user-actions
const UserMenuItem = styled(MuiMenuItem)(() => ({
  display: 'block',
}));

const Username = styled(MuiTypography)(() => ({
  fontWeight: '520',
  fontSize: '16px',
}));

const UserContent = styled(MuiTypography)(() => ({
  fontSize: '14px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));

// notification of system-actions
const SystemMenuItem = styled(MuiMenuItem)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));

const SystemContent = styled(MuiTypography)(() => ({
  fontWeight: '520',
  fontSize: '12px',
  color: 'gray',
}));
