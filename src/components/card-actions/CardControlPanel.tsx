import { useSelector } from 'react-redux';

// mui
import MuiStack from '@mui/material/Stack';

import { RootState } from 'store';
import { isInParty, getIsJoined } from 'functions/commons';
import DeleteCardBtn from './DeleteCardBtn';
import EditCardBtn from './EditCardBtn';
import FinishBtn from './FinishBtn';
import JoinBtn from './JoinBtn';
import LeaveBtn from './LeaveBtn';

const CardControlPanel = () => {
  const { isLogin, oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);

  return (
    <>
      {isLogin && oauth2Id === currentCard.oauth2Id && (
        <MuiStack direction="row" spacing="2%" mt={1}>
          <DeleteCardBtn />
          <EditCardBtn />
          <FinishBtn />
        </MuiStack>
      )}
      {isLogin &&
        oauth2Id !== currentCard.oauth2Id &&
        isInParty(currentCard.memberList, oauth2Id) &&
        currentCard.expired === 'false' &&
        currentCard.finished === 'false' && <LeaveBtn />}
      {isLogin &&
        oauth2Id !== currentCard.oauth2Id &&
        !isInParty(currentCard.memberList, oauth2Id) &&
        currentCard.expired === 'false' &&
        currentCard.finished === 'false' && <JoinBtn />}
      {!isLogin && <JoinBtn />}
    </>
  );
};

export default CardControlPanel;
