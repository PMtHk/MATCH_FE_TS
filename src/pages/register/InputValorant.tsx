import React from 'react';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';

import { gameList } from 'assets/Games.data';
import { GAME } from 'types/games';

const ValorantSignButton = () => {
  const gameResult: GAME | undefined = gameList.find(
    (game) => game.id === 'valorant',
  );

  const gameInfo = gameResult as GAME;

  return (
    <GameWrapper key={gameInfo.id}>
      <ImgWrapper>
        <img src={gameInfo.image_url} alt={gameInfo.name} />
      </ImgWrapper>
      <ButtonWrapper>
        <Button
          href={`https://auth.riotgames.com/authorize?client_id=${process.env.REACT_APP_RIOT_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_RIOT_REDIRECT_URI}&response_type=code&scope=openid+offline_access`}
        >
          <img
            src="https://d18ghgbbpc0qi2.cloudfront.net/assets/riot_games_icon.png"
            alt="riot_games_symbol"
            width="24px"
            height="24px"
          />
          <span>라이엇 로그인</span>
        </Button>
      </ButtonWrapper>
    </GameWrapper>
  );
};

export default ValorantSignButton;

const GameWrapper = styled(MuiBox)(() => ({
  width: '100%',
  minHeight: '60px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  padding: '0 0 20px 0',
})) as typeof MuiBox;

const ImgWrapper = styled(MuiBox)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& > img': {
    width: '40px',
    height: '40px',
  },
  margin: '0 10px 0 0',
  [theme.breakpoints.up('md')]: {
    '& > img': {
      width: '60px',
      height: '60px',
    },
  },
})) as typeof MuiBox;

const ButtonWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  margin: '0 0 0  10px',
})) as typeof MuiBox;

const Button = styled(MuiButton)(() => ({
  width: '100%',
  maxWidth: '400px',
  height: '56px',
  backgroundColor: '#E84057',
  color: '#f4f4f4',
  fontSize: '16px',
  fontWeight: 700,
  gap: '8px',
  '& > img': {
    filter: 'brightness(0) invert(1)',
  },
  '&:hover': {
    color: '#E84057',
    border: '1px solid #E84057',
    '& > img': {
      filter:
        'invert(45%) sepia(43%) saturate(7074%) hue-rotate(330deg) brightness(95%) contrast(91%)',
    },
  },
})) as typeof MuiButton;
