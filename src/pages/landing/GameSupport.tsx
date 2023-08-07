import React from 'react';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import GameIcon from 'components/GameIcon';
import { gameList } from 'assets/Games.data';
import { GAME } from 'types/games';

const GameSupport = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Text>지원게임 목록</Text>
      <GameList>
        {gameList.map((game: GAME) => {
          if (game.available) {
            return (
              <Button key={game.id} onClick={() => navigate(`/${game.id}`)}>
                <GameIcon
                  id={game.id}
                  item={game.name}
                  size={{ width: '100px', height: '100px' }}
                />
              </Button>
            );
          }
          return null;
        })}
      </GameList>
    </Wrapper>
  );
};

export default GameSupport;

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: '300px',
  color: '#5e6064',
  fontSize: 20,
  [theme.breakpoints.up('md')]: {
    fontSize: 30,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 40,
  },
  fontWeight: 600,
  '&:hover': {},
})) as typeof Box;

const Text = styled(Typography)(({ theme }) => ({
  color: '#5e6064',
  fontSize: 20,
  [theme.breakpoints.up('md')]: {
    fontSize: 30,
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 40,
  },
  fontWeight: 600,
})) as typeof Typography;

const GameList = styled(Box)(() => ({
  marginTop: '50px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
})) as typeof Box;
