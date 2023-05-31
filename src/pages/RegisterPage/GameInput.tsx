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

// import types
import { Typography } from '@mui/material';
import { verifyingNickname } from 'apis/api/user';
import { GAME } from './Games.data';

const GameWrapper = styled(Box)(() => ({
  width: '100%',
  height: '100px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
})) as typeof Box;

const InputNickname = styled(TextField)(() => ({
  margin: '0 0 0 20px',
})) as typeof TextField;

type GameInputProps = {
  item: GAME;
};

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

  const verifyNickname = async () => {
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
      return <CircularProgress color="inherit" size={20} />;
    }
    if (games[item.id] === nickname && nickname !== '') {
      return <CheckIcon color="primary" />;
    }
    return (
      <Button onClick={verifyNickname} disabled={nickname.length < 3}>
        <Typography fontSize={12}>인증하기</Typography>
      </Button>
    );
  };

  return (
    <GameWrapper key={item.id}>
      <img
        src={item.image_url}
        alt={item.name_kor}
        width="60px"
        height="60px"
      />
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
          endAdornment: item.available && endAdornment(),
        }}
      />
    </GameWrapper>
  );
};

export default GameInput;
