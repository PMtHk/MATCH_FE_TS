import React from 'react';
import { useNavigate } from 'react-router-dom';

// mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// own-components
import GameIcon from 'components/GameIcon';

// mui styled components
import { styled } from '@mui/system';

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
})) as typeof Box;

const GameSupport = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Text>지원게임 목록</Text>
      <GameList>
        <Button onClick={() => navigate('/lol')}>
          <GameIcon
            id="lol"
            item="leagueoflegends"
            size={{ width: '100px', height: '100px' }}
          />
        </Button>
      </GameList>
    </Wrapper>
  );
};

export default GameSupport;
