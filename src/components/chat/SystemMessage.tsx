import React from 'react';

// mui
import styled from '@mui/system/styled';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';

interface SystemMessageProps {
  messageInfo: any;
}

const SystemMessage = ({ messageInfo }: SystemMessageProps) => {
  return (
    <MessageContainer>
      <MessageContent>{messageInfo.content}</MessageContent>
    </MessageContainer>
  );
};

export default SystemMessage;

const MessageContainer = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  color: 'gray',
  margin: '4px',
})) as typeof MuiBox;

const MessageContent = styled(MuiTypography)(() => ({
  fontSize: '12px',
})) as typeof MuiTypography;
