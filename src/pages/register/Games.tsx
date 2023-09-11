import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiTypography from '@mui/material/Typography';

import { RootState } from 'store';
import { defaultAxios } from 'apis/utils';
import InputLol from './InputLol';
import InputPubg from './InputPubg';
import InputOverwatch from './InputOverwatch';
import InputValorant from './InputValorant';

const Games = () => {
  const navigate = useNavigate();

  const params = new URL(document.URL).searchParams;
  const rsoAccessCode = params.get('code');

  React.useEffect(() => {
    const sendRsoAcessCode = async () => {
      const response = await defaultAxios.post('/api/valorant/user/exist', {
        code: rsoAccessCode as string,
      });
    };

    if (rsoAccessCode) {
      sendRsoAcessCode();
    }
  }, [rsoAccessCode]);

  const { games } = useSelector((state: RootState) => state.register);
  const atLeastOne =
    Object.values(games).filter((item) => item !== '').length > 0;

  const handleNextBtn = () => {
    navigate({
      pathname: '/kakao/register/favgame',
    });
  };

  return (
    <>
      <Wrapper>
        <Title>플레이하는 게임과 닉네임을 알려주세요.</Title>
        <SubTitle>적어도 하나의 게임정보를 등록해야 합니다.</SubTitle>
        <InputLol />
        <InputPubg />
        <InputOverwatch />
        <InputValorant />
      </Wrapper>
      <NextButton disabled={!atLeastOne} onClick={handleNextBtn}>
        다음
      </NextButton>
    </>
  );
};

export default Games;

const Wrapper = styled(MuiBox)(() => ({
  width: '100%',
  padding: '50px 20px 20px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  overflowY: 'auto',
  height: '100%',
  gap: '4px',
})) as typeof MuiBox;

const Title = styled(MuiTypography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
  [theme.breakpoints.up('sm')]: {
    fontSize: '22px',
  },
})) as typeof MuiTypography;

const SubTitle = styled(MuiTypography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  wordBreak: 'break-word',
  margin: '0 0 30px 0',
  [theme.breakpoints.up('sm')]: {
    fontSize: '16px',
  },
})) as typeof MuiTypography;

const NextButton = styled(MuiButton)(() => ({
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
})) as typeof MuiButton;
