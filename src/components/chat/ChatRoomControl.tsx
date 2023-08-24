import { Suspense } from 'react';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';

import { RootState } from 'store';
import { isInParty } from 'functions/commons';
import Circular from 'components/loading/Circular';
import ChatRoom from './ChatRoom';

const ChatRoomControl = () => {
  const { isLogin, oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isLogin &&
        isInParty(currentCard.memberList, oauth2Id) &&
        currentCard.finished !== 'true' && (
          <Suspense
            fallback={<Circular text="채팅방 불러오는 중" height="100%" />}
          >
            <ChatRoomWrapper sx={{ ml: 2 }}>
              <ChatRoom />
            </ChatRoomWrapper>
          </Suspense>
        )}
    </>
  );
};

export default ChatRoomControl;

const ChatRoomWrapper = styled(MuiBox)(() => ({
  ml: 2,
})) as typeof MuiBox;
