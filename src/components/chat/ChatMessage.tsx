import React from 'react';
import { useSelector } from 'react-redux';

// mui
import styled from '@mui/system/styled';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';

import { RootState } from 'store';

interface ChatMessageProps {
  messageInfo: any;
  msgBySameSender: boolean;
}

const ChatMessage = ({ messageInfo, msgBySameSender }: ChatMessageProps) => {
  const { oauth2Id } = useSelector((state: RootState) => state.user);

  // 내 메세지인지 확인해주는 함수
  const isMessageMine = (messageInfo: any, oauth2Id: string) => {
    return messageInfo.user.oauth2Id === oauth2Id;
  };

  const date = new Date(messageInfo.timestamp);

  return (
    <MessageContainer
      sx={{
        alignItems: isMessageMine(messageInfo, oauth2Id)
          ? 'flex-end'
          : 'flex-start',
      }}
    >
      <Author sx={{ textAlign: 'center', mt: !msgBySameSender ? 1 : 0 }}>
        {!isMessageMine(messageInfo, oauth2Id) && !msgBySameSender && (
          <strong>{messageInfo.user.nickname}</strong>
        )}
      </Author>
      <MessagePositionDecider
        sx={{
          flexDirection: isMessageMine(messageInfo, oauth2Id)
            ? 'row-reverse'
            : 'row',
        }}
      >
        <MessageContent
          sx={{
            mt: !msgBySameSender ? 1 : 0.25,
            ml: isMessageMine(messageInfo, oauth2Id) ? '0px' : '4px',
            backgroundColor: isMessageMine(messageInfo, oauth2Id)
              ? 'white'
              : '#e2e2e2',
          }}
        >
          <MuiTypography>{messageInfo.content}</MuiTypography>
        </MessageContent>
        {date && (
          <DateWrapper>
            <DateTypo sx={{ color: 'grey', fontSize: 10 }}>
              {date.toTimeString().split(' ')[0].slice(0, 5)}
            </DateTypo>
          </DateWrapper>
        )}
      </MessagePositionDecider>
    </MessageContainer>
  );
};

export default ChatMessage;

const MessageContainer = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})) as typeof MuiBox;

const Author = styled(MuiTypography)(() => ({})) as typeof MuiTypography;

const MessagePositionDecider = styled(MuiBox)(() => ({
  display: 'flex',
})) as typeof MuiBox;

const MessageContent = styled(MuiBox)(() => ({
  width: 'fit-content',
  padding: '4px 8px 4px 8px',
  display: 'flex',
  flexDirection: 'row',
  maxWidth: '280px',
  borderRadius: '4px',
  boxShadow: '0 0 1px 1px #ececec',
})) as typeof MuiBox;

const DateWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'flex-end',
  padding: '0 4px 0 4px',
})) as typeof MuiBox;

const DateTypo = styled(MuiTypography)(() => ({
  color: 'grey',
  fontSize: 10,
})) as typeof MuiTypography;
