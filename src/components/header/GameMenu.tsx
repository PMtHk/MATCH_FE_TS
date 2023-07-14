import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiMenu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

import GameIcon from 'components/GameIcon';
import { RootState } from 'store';
import { gameList, GAME, GAME_ID } from '../../assets/Games.data';

interface GameMenuProps {
  currentGame: GAME_ID | null;
}

const GameMenu = ({ currentGame }: GameMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { representative } = useSelector((state: RootState) => state.user);

  let gameInfo: GAME;
  if (currentGame) {
    gameInfo = gameList.find((game) => game.id === currentGame) as GAME;
  } else {
    gameInfo = gameList.find((game) => game.id === representative) as GAME;
  }

  const [gameMenuAnchor, setGameMenuAnchor] =
    React.useState<null | HTMLElement>(null);

  const isGameMenuOpen = Boolean(gameMenuAnchor);

  const openGameMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setGameMenuAnchor(event.currentTarget);
  };

  const closeUserMenu = () => {
    setGameMenuAnchor(null);
  };

  const isMyPage = location.pathname === '/mypage';

  return (
    <GameMenuContainer>
      <GameMenuBtn id="game_menu" onClick={openGameMenu}>
        {isMyPage ? '지원하는 게임 목록' : gameInfo.name_kor}
        <KeyboardArrowDown />
      </GameMenuBtn>

      <MuiMenu
        id="game_menu"
        anchorEl={gameMenuAnchor}
        open={isGameMenuOpen}
        onClose={closeUserMenu}
        PaperProps={{
          style: { width: '160px' },
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {gameList.map((aGame, _) => {
          return (
            <MuiMenuItem
              key={aGame.id}
              onClick={() => {
                navigate(`/${aGame.id}`);
              }}
              sx={{ gap: '10px' }}
            >
              <GameIcon
                id={aGame.id}
                item={aGame.name.toLowerCase().split(' ').join('')}
                size={{ width: '20px', height: '20px' }}
              />
              {aGame.name_kor}
            </MuiMenuItem>
          );
        })}
      </MuiMenu>
      {/* <TextMenuBtn>파티찾기</TextMenuBtn>
      <TextMenuBtn>자유게시판</TextMenuBtn> */}
    </GameMenuContainer>
  );
};

export default GameMenu;

const GameMenuContainer = styled(MuiBox)(({ theme }) => ({
  height: '100%',
  flexGrow: 1,
  display: 'none',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
})) as typeof MuiBox;

const GameMenuBtn = styled(MuiButton)(() => ({
  margin: '0',
  padding: '0 8px',
  fontSize: '16px',
  fontWeight: '600',
  color: '#ffffff',
})) as typeof MuiButton;

const TextMenuBtn = styled(MuiButton)(() => ({
  margin: '0 8px',
  padding: '0 8px',
  fontSize: '16px',
  fontWeight: '600',
  color: '#ffffff',
})) as typeof MuiButton;
