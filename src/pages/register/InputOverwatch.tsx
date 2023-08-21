import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import MuiTypography from '@mui/material/Typography';

import { verifyNickname, loadHistory } from 'apis/api/overwatch';
import { RootState } from 'store';
import { registerActions } from 'store/register-slice';
import { snackbarActions } from 'store/snackbar-slice';
import { gameList } from 'assets/Games.data';
import { GAME } from 'types/games';

const InputOverwatch = () => {
  const { games } = useSelector((state: RootState) => state.register);
  const dispatch = useDispatch();

  const [nickname, setNickname] = React.useState<string>(games.overwatch || '');
  const [warning, setWarning] = React.useState<boolean>(false);
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const gameResult: GAME | undefined = gameList.find(
    (game) => game.id === 'overwatch',
  );

  const gameInfo = gameResult as GAME;

  const handleVerify = async () => {
    try {
      setIsPending(true);
      dispatch(
        registerActions.SET_GAMES_WITH_ID({ id: 'overwatch', value: '' }),
      );

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '플레이어 정보를 확인하는 중입니다.',
          severity: 'info',
        }),
      );

      await verifyNickname(nickname.trim());

      await loadHistory(nickname.trim());

      dispatch(
        registerActions.SET_GAMES_WITH_ID({
          id: 'overwatch',
          value: nickname.trim(),
        }),
      );

      dispatch(snackbarActions.CLOSE_SNACKBAR());

      setNickname(nickname.trim());
      setWarning(false);
      setIsPending(false);
    } catch (error: any) {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: error.response.data.message,
          severity: 'error',
        }),
      );
      setNickname('');
      setWarning(true);
      setIsPending(false);
    }
  };

  const endAdornment: () => React.ReactNode = () => {
    if (isPending) {
      return <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />;
    }
    if (games[gameInfo.id] === nickname && nickname !== '') {
      return <CheckIcon color="primary" sx={{ mr: 1 }} />;
    }
    return (
      <Button onClick={handleVerify} disabled={nickname.length < 3}>
        <MuiTypography fontSize={12}>인증하기</MuiTypography>
      </Button>
    );
  };

  return (
    <GameWrapper key={gameInfo.id}>
      <ImgWrapper>
        <img src={gameInfo.image_url} alt={gameInfo.name} />
      </ImgWrapper>
      <InputWrapper>
        <InputNickname
          id="overwatch_nickname"
          disabled={!gameInfo.available}
          fullWidth
          label={
            !gameInfo.available ? '곧 지원할 예정입니다.' : gameInfo.labelText
          }
          error={warning}
          helperText={warning && gameInfo.helperText}
          onChange={handleInput}
          focused={games[gameInfo.id] === nickname && nickname !== ''}
          value={nickname}
          InputProps={{
            endAdornment:
              gameInfo.available && nickname !== '' && endAdornment(),
          }}
        />
      </InputWrapper>
    </GameWrapper>
  );
};

export default InputOverwatch;

const GameWrapper = styled(Box)(() => ({
  width: '100%',
  minHeight: '60px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  padding: '0 0 20px 0',
})) as typeof Box;

const ImgWrapper = styled(Box)(({ theme }) => ({
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
})) as typeof Box;

const InputWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  margin: '0 0 0  10px',
})) as typeof Box;

const InputNickname = styled(TextField)(() => ({
  maxWidth: '400px',
  fontSize: '8px',
})) as typeof TextField;
