import React, { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';

// mui styled
import { styled } from '@mui/material/styles';

import { RootState } from 'store';
import { Typography } from '@mui/material';
import { verifyingNickname } from '../../apis/api/user';

// import types

import { GAME } from '../../assets/Games.data';

const GameWrapper = styled(Box)(() => ({
  width: '100%',
  height: '100px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
})) as typeof Box;

const ImgWrapper = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  margin: '0 10px 0 0',
  [theme.breakpoints.up('md')]: {
    width: '60px',
    height: '60px',
  },
})) as typeof Box;

const InputNickname = styled(TextField)(() => ({
  margin: '0 0 0 10px',
  maxWidth: '400px',
  fontSize: '8px',
})) as typeof TextField;

interface GameInputProps {
  item: GAME;
}

const GameInput = ({ item }: GameInputProps) => {
  const { games } = useSelector((state: RootState) => state.register);
  const dispatch = useDispatch();

  const [nickname, setNickname] = React.useState('');
  const [warning, setWarning] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  // 사용자 입력 -> nickname
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const verifyBtnHandler = async () => {
    setIsPending(true);
    try {
      const exactNickname = await verifyingNickname(
        nickname,
        item.id,
        dispatch,
      );
      setNickname(exactNickname);
      setWarning(false);
    } catch (e) {
      setWarning(true);
    } finally {
      setIsPending(false);
    }
  };

  const endAdornment: () => ReactNode = () => {
    if (isPending) {
      return <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />;
    }
    if (games[item.id] === nickname && nickname !== '') {
      return <CheckIcon color="primary" sx={{ mr: 1 }} />;
    }
    return (
      <Button onClick={verifyBtnHandler} disabled={nickname.length < 3}>
        <Typography fontSize={12}>인증하기</Typography>
      </Button>
    );
  };

  return (
    <GameWrapper key={item.id}>
      <ImgWrapper>
        <img
          src={item.image_url}
          alt={item.name_kor}
          width="100%"
          height="100%"
        />
      </ImgWrapper>
      <InputNickname
        id={item.id}
        disabled={!item.available}
        fullWidth
        label={!item.available ? '곧 지원할 예정입니다.' : item.labelText}
        error={warning}
        helperText={warning && item.helperText}
        onChange={handleInput}
        focused={games[item.id] === nickname && nickname !== ''}
        value={nickname}
        InputProps={{
          endAdornment: item.available && nickname !== '' && endAdornment(),
        }}
      />
    </GameWrapper>
  );
};

export default GameInput;
