import React from 'react';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';

import MuiMenu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';

// mui-icons
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

// gameList
import { gameList, GAME } from 'pages/register/Games.data';

interface GameMenuProps {
  currentGame: 'lol' | 'pubg';
}

const GameMenu = ({ currentGame }: GameMenuProps) => {
  const navigate = useNavigate();

  const gameInfo: GAME = gameList.find(
    (game) => game.id === currentGame,
  ) as GAME;

  const [gameMenuAnchor, setGameMenuAnchor] =
    React.useState<null | HTMLElement>(null);

  const isGameMenuOpen = Boolean(gameMenuAnchor);

  const openGameMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setGameMenuAnchor(event.currentTarget);
  };

  const closeUserMenu = () => {
    setGameMenuAnchor(null);
  };

  return (
    <GameMenuContainer>
      <GameMenuBtn id="game_menu" onClick={openGameMenu}>
        {gameInfo.name_kor}
        <KeyboardArrowDown />
      </GameMenuBtn>
      <MuiMenu
        id="game_menu"
        anchorEl={gameMenuAnchor}
        open={isGameMenuOpen}
        onClose={closeUserMenu}
        PaperProps={{
          style: {
            width: '140px',
          },
        }}
      >
        {gameList.map((aGame, _) => {
          if (aGame.id !== currentGame) {
            return (
              <MuiMenuItem
                key={aGame.id}
                onClick={() => {
                  navigate(`/${aGame.id}`);
                }}
              >
                {aGame.name_kor}
              </MuiMenuItem>
            );
          }
          return null;
        })}
      </MuiMenu>
      <TextMenuBtn>파티찾기</TextMenuBtn>
      <TextMenuBtn>자유게시판</TextMenuBtn>
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
