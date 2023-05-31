import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RootState } from 'store';
import GameInput from './GameInput';
import { gameList } from './Games.data';

const Wrapper = styled(Box)(() => ({
  width: '100%',
  padding: '50px 20px 20px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  overflowY: 'auto',
  height: '100%',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  [theme.breakpoints.up('sm')]: {
    fontSize: '22px',
  },
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  wordBreak: 'break-word',
  margin: '0 0 30px 0',
  [theme.breakpoints.up('sm')]: {
    fontSize: '16px',
  },
}));

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
}));

const Games = () => {
  const navigate = useNavigate();

  const params = new URL(document.URL).searchParams;
  const code = params.get('code');

  const { games } = useSelector((state: RootState) => state.register);
  const atLeastOne =
    Object.values(games).filter((item) => item !== '').length > 0;

  const hanldeNextBtn = () => {
    navigate({
      pathname: '/kakao/register/favgame',
      search: `?code=${code}`,
    });
  };

  return (
    <>
      <Wrapper>
        <Title>플레이하는 게임과 닉네임을 알려주세요.</Title>
        <SubTitle>적어도 하나의 게임정보를 등록해야 합니다.</SubTitle>
        {gameList.map((item) => {
          return <GameInput item={item} key={item.id} />;
        })}
      </Wrapper>
      <NextButton disabled={!atLeastOne} onClick={hanldeNextBtn}>
        다음
      </NextButton>
    </>
  );
};

export default Games;
