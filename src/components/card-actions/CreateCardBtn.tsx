import React from 'react';
import { Link } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiButton from '@mui/material/Button';

import { GAME_ID } from 'types/games';
import { getCurrentGame } from 'functions/commons';

const CreateCardBtn = () => {
  const currentGame: GAME_ID = getCurrentGame();

  return (
    <Link to="new" state={{ background: `/${currentGame}` }}>
      <Button variant="outlined">글 작성하기</Button>
    </Link>
  );
};

export default CreateCardBtn;

const Button = styled(MuiButton)(({ theme }) => ({
  height: '40px',
  width: '100%',
  borderColor: '#dddddd',
  color: 'black',
  '&:hover': {
    borderColor: '#dddddd',
    color: 'black',
    backgroundColor: '#f3f3f3',
  },
}));
