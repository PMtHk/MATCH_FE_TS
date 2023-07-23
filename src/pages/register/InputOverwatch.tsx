import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import MuiTypography from '@mui/material/Typography';

import { RootState } from 'store';
import { verifyOWNickname } from 'apis/api/overwatch';
import { registerActions } from 'store/register-slice';
import { snackbarActions } from 'store/snackbar-slice';
import { gameList, GAME } from '../../assets/Games.data';

const InputOverwatch = () => {
  const { games } = useSelector((state: RootState) => state.register);
  const dispatch = useDispatch();

  const [nickname, setNickname] = React.useState<string>('');
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
      const exactNickname = await verifyOWNickname(nickname);
      dispatch(
        registerActions.SET_GAMES_WITH_ID({
          id: 'overwatch',
          value: exactNickname as string,
        }),
      );
      setWarning(false);
    } catch (error) {
      setWarning(true);
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '닉네임을 확인할 수 없습니다.',
          severity: 'error',
        }),
      );
    } finally {
      setIsPending(false);
      //  defaultAxios.get(`/api/overwatch/user/${games.overwatch}`);
      //  여기서 인증 이후 사용자에게 따로 표시 이후 DB에 사용자 랭크정보를 저장하는 API 호출
      //  추가 작업 필요
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
