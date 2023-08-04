import React from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  Link as RouterLink,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiLink from '@mui/material/Link';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiMenu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

import GameIcon from 'components/GameIcon';
import { RootState } from 'store';
import { cardActions } from 'store/card-slice';
import { gameList, GAME, GAME_ID } from '../../assets/Games.data';

const GameMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const currentGame = window.location.pathname.split('/')[1];

  const isMyPage = location.pathname === '/mypage';

  return (
    <GameMenuContainer>
      {gameList.map((game: GAME) => {
        if (game.available === false) return null;
        return (
          <Link
            component={RouterLink}
            key={game.id}
            underline="none"
            to={`/${game.id}`}
            color="white"
            onClick={() => {
              dispatch(cardActions.SET_CURRENT_PAGE(0));
            }}
            sx={{
              borderBottom:
                currentGame === game.id ? '2px solid white' : 'none',
            }}
          >
            {game.name_kor}
          </Link>
        );
      })}
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

const Link = styled(MuiLink)(() => ({
  margin: '0 16px 0 0 ',
  padding: '0 0 4px 0',

  '&:hover': {
    transform: 'translateY(-1px) scale(1.02)',
    borderBottom: '1px solid #dddddd',
  },
})) as typeof MuiLink;
