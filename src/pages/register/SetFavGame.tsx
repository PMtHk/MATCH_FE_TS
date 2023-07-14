import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { RootState } from 'store';
import { registerActions } from 'store/register-slice';
import GameIcon from 'components/GameIcon';
import { signup } from 'apis/api/user';
import { GAME, GAME_ID, gameList } from '../../assets/Games.data';

const SetFavGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const params = new URL(document.URL).searchParams;
  const code = params.get('code');

  const { games, representative } = useSelector(
    (state: RootState) => state.register,
  );

  const [warning, setWarning] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const setRepresentative = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.target instanceof Element) {
      if (games[event.target.id as GAME_ID] === '') {
        setWarning(true);
      } else {
        setWarning(false);
        dispatch(
          registerActions.SET_REPRESENTATIVE({
            representative: event.target.id as GAME_ID,
          }),
        );
      }
    }
  };

  // size of img
  const gameIconSize = {
    width: '100%',
    height: '100%',
  };

  const handleNextBtn = () => {
    setIsPending(true);
    if (code) {
      signup(code, navigate, dispatch);
    }
  };

  return (
    <>
      <Wrapper>
        <Title>대표게임을 설정해 주세요.</Title>
        <SubTitle textAlign="center">
          앞에서 등록한 게임 중 하나를 대표게임으로 설정할 수 있습니다.
          <br />
          (회원가입 이후에 마이페이지에서 변경할 수 있습니다.)
          <Typography color="error">
            {warning &&
              '게임정보를 입력한 게임만 대표게임으로 설정할 수 있습니다.'}
          </Typography>
        </SubTitle>
        <GameWrapper>
          {gameList.map((game: GAME) => {
            return (
              <GameIconWrapper
                key={game.id}
                sx={{
                  borderBottom:
                    representative === game.id ? '2px solid #494b4e' : 'none',
                  transition: 'all 0.3s ease-in-out',
                  transform: representative === game.id ? 'scale(1.3)' : '',
                }}
              >
                <Button onClick={setRepresentative}>
                  <GameIcon
                    id={game.id}
                    item={game.name.toLowerCase().split(' ').join('')}
                    size={gameIconSize}
                  />
                </Button>
              </GameIconWrapper>
            );
          })}
        </GameWrapper>
      </Wrapper>
      {isPending && (
        <PendingMessage textAlign="center">
          <CircularProgress color="inherit" />
          <br />
          <br />
          사용자 게임 별 전적을 조회하는 중입니다.
          <br />곧 회원가입이 완료됩니다.
        </PendingMessage>
      )}
      <NextButton
        disabled={representative === '' || isPending}
        onClick={handleNextBtn}
      >
        다음
      </NextButton>
    </>
  );
};

export default SetFavGame;

const Wrapper = styled(Box)(() => ({
  width: '100%',
  padding: '50px 20px 20px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  overflowY: 'auto',
  height: '100%',
})) as typeof Box;

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  [theme.breakpoints.up('sm')]: {
    fontSize: '22px',
  },
})) as typeof Typography;

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  wordBreak: 'break-word',
  margin: '0 0 30px 0',
  [theme.breakpoints.up('sm')]: {
    fontSize: '16px',
  },
})) as typeof Typography;

const GameWrapper = styled(Box)(() => ({
  margin: '120px 0 0 0',
  width: '100%',
  height: '120px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '15px',
})) as typeof Box;

const GameIconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '55px',
  [theme.breakpoints.up('sm')]: {
    width: '75px',
  },
})) as typeof Box;

const NextButton = styled(Button)(() => ({
  position: 'relative',
  bottom: '0',
  width: '95%',
  height: '60px',
  borderRadius: '4px',
  backgroundColor: '#494b4e',
  fontSize: '18px',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#7f8287',
  },
  '&.Mui-disabled': {
    backgroundColor: '#d1d4db',
  },
})) as typeof Button;

const PendingMessage = styled(Typography)(() => ({
  position: 'absolute',
  bottom: '150px',
  fontSize: '18px',
  fontWeight: 600,
})) as typeof Typography;
