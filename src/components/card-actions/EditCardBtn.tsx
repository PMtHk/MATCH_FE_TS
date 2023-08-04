import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// mui
import styled from '@emotion/styled';
import MuiButton from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const EditCardBtn = () => {
  const currentGame = window.location.pathname.split('/')[1];

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
