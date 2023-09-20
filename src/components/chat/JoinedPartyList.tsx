import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import MuiMenu from '@mui/material/Menu';
import MuiTooltip from '@mui/material/Tooltip';
import ReorderIcon from '@mui/icons-material/Reorder';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';

import { RootState } from 'store';
import GameIcon from 'components/GameIcon';
import { GAME_ID } from 'types/games';
import { gameList } from 'assets/Games.data';
import { CHATROOM } from 'types/chats';
import JoinedParty from './JoinedParty';

interface JoinedPartyListProps {
  partyListAnchorEl: HTMLElement | null;
  partyListOpen: boolean;
  handlePartyListOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handlePartyListClose: () => void;
}

const JoinedPartyList = ({
  partyListAnchorEl,
  partyListOpen,
  handlePartyListOpen,
  handlePartyListClose,
}: JoinedPartyListProps) => {
  const dispatch = useDispatch();
  const { representative } = useSelector((state: RootState) => state.user);
  const [selectedGame, setSelectedGame] =
    React.useState<GAME_ID>(representative);

  const { joinedChatRoomsId } = useSelector(
    (state: RootState) => state.chatroom,
  );

  return (
    <>
      <MuiTooltip title="참가한 파티 목록">
        <IconButton
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            handlePartyListOpen(event);
          }}
        >
          <ViewAgendaIcon
            sx={{
              color: '#dddddd',
              fontSize: '30px',
            }}
          />
        </IconButton>
      </MuiTooltip>
      <Menu
        anchorEl={partyListAnchorEl}
        id="joinedParyList-menu"
        open={partyListOpen}
        onClose={handlePartyListClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <HeaderTypo component="span">참여한 파티 목록</HeaderTypo>
        <GameSelector>
          {gameList.map((aGame) => {
            if (aGame.available) {
              return (
                <GameSelectorItem
                  key={aGame.id}
                  onClick={() => setSelectedGame(aGame.id)}
                  selected={selectedGame === aGame.id}
                >
                  <GameIcon
                    item={aGame.id}
                    id={aGame.id}
                    size={{
                      width: '24px',
                      height: '22px',
                    }}
                  />
                  <GameTypo selected={selectedGame === aGame.id}>
                    {aGame.name_kor}
                  </GameTypo>
                </GameSelectorItem>
              );
            }
            return null;
          })}
        </GameSelector>
        <PartyListContainer>
          {joinedChatRoomsId.filter(
            (aChatRoom: CHATROOM) => aChatRoom.game === selectedGame,
          ).length !== 0 ? (
            joinedChatRoomsId
              .filter((aChatRoom: CHATROOM) => aChatRoom.game === selectedGame)
              .map((aChatRoom: CHATROOM) => {
                return (
                  <JoinedParty
                    handlePartyListClose={handlePartyListClose}
                    key={aChatRoom.chatRoomId}
                    boardId={aChatRoom.id}
                    game={aChatRoom.game}
                  />
                );
              })
          ) : (
            <NoPartyTypo>참여한 파티가 없습니다.</NoPartyTypo>
          )}
        </PartyListContainer>
      </Menu>
    </>
  );
};

export default JoinedPartyList;

const Menu = styled(MuiMenu)(({ theme }) => ({
  padding: '0',
  margin: '20px 0 0 0',
  '& .MuiMenu-paper': {
    width: '383px',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ececec',
    borderRadius: '4px',
    padding: '0',
    margin: '0',
  },
  '& .MuiList-root': {
    padding: '8px 4px 8px 4px',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
})) as typeof MuiMenu;

const PartyListContainer = styled(MuiBox)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  maxHeight: '50vh',
  overflowY: 'auto',
  overflowX: 'hidden',
  scrollbarWidth: 'thin',
  margin: '8px 0 0 0',
  padding: '4px 0 0 0',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#c2c2c2',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#b7b7b7',
  },
})) as typeof MuiBox;

const GameSelector = styled(MuiBox)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  gap: '6px',
  padding: '0 4px 0 4px',
})) as typeof MuiBox;

interface GameSelectorItem {
  selected: boolean;
}

const GameSelectorItem = styled(MuiBox, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<GameSelectorItem>(({ selected }) => ({
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  '&:hover': {
    cursor: 'pointer',
  },
  '& > img': {
    filter: selected ? '' : 'contrast(10%) opacity(50%)',
    webkitFilter: selected ? '' : 'contrast(10%) opacity(50%)',
  },
}));

const HeaderTypo = styled(MuiTypography)(({ theme }) => ({
  padding: '8px',
  fontSize: '15px',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
})) as typeof MuiTypography;

const NoPartyTypo = styled(MuiTypography)(({ theme }) => ({
  padding: '8px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
})) as typeof MuiTypography;

interface GameTypoProps {
  selected: boolean;
}

const GameTypo = styled(MuiTypography, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<GameTypoProps>(({ selected }) => ({
  fontSize: selected ? '13px' : '12px',
  fontWeight: selected ? '600' : '400',
  color: selected ? '' : 'grey',
}));

const IconButton = styled(MuiIconButton)(({ theme }) => ({
  padding: '0 8px 0 0',
  margin: '0',
  '& .MuiButtonBase-root': {
    padding: '0',
  },
})) as typeof MuiIconButton;
