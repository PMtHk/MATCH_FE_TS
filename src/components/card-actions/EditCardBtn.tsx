import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiButton from '@mui/material/Button';

import { RootState } from 'store';
import { getCurrentGame } from 'functions/commons';
import { GAME_ID } from 'types/games';

const EditCardBtn = () => {
  const currentGame: GAME_ID = getCurrentGame();

  const { currentCard } = useSelector((state: RootState) => state.card);
  const { expired, finished } = currentCard;

  return (
    <Link
      to="edit"
      style={{ width: '32%' }}
      state={{ background: `/${currentGame}` }}
    >
      <Button
        disabled={expired === 'true' || finished === 'true'}
        fullWidth
        variant="outlined"
        size="small"
        color="primary"
      >
        게시글 수정
      </Button>
    </Link>
  );
};

export default EditCardBtn;

const Button = styled(MuiButton)(() => ({
  p: 1,
  height: 40,
  borderColor: '#CCCCCC',
  fontWeight: 700,
  ':hover': {
    borderColor: '#dddddd',
    backgroundColor: '#f3f3f3',
  },
})) as typeof MuiButton;
