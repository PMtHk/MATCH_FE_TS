import React from 'react';

// mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Divider from 'components/Divider';

// mui styled components
import { styled } from '@mui/material/styles';

const Wrapper = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '100vh',
  padding: '40px 0 10px',
  [theme.breakpoints.up('md')]: {
    margin: '100px auto',
    height: 'calc(100vh - 200px)',
    minHeight: '560px',
    border: '1px solid #dddddd',
    borderRadius: '8px',
  },
})) as typeof Container;

const LogoTitle = styled(Typography)(({ theme }) => ({
  fontSize: '32px',
  fontStyle: 'italic',
  fontWeight: 700,
  [theme.breakpoints.up('sm')]: {
    fontSize: '44px',
  },
})) as typeof Typography;

const ButtonWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 20,
})) as typeof Box;

const Typo = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 500,
  [theme.breakpoints.up('sm')]: {
    fontSize: '22px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '26px',
  },
})) as typeof Typography;

const KakaoLoginBtn = styled(Button)(({ theme }) => ({
  width: '300px',
  height: '44px',
  backgroundColor: '#FEE500',
  color: '#000000',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 600,
  gap: 10,
  [theme.breakpoints.up('sm')]: {
    fontSize: '18px',
    width: '340px',
    height: '46px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '20px',
    width: '380px',
    height: '48px',
  },
  '&: hover': {
    backgroundColor: '#e3cd07',
  },
})) as typeof Button;

const RegisterBtn = styled(Button)(({ theme }) => ({
  width: '300px',
  height: '44px',
  backgroundColor: '#dbdbdb',
  color: '#000000',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 600,
  gap: 10,
  textTransform: 'none',
  [theme.breakpoints.up('sm')]: {
    fontSize: '18px',
    width: '340px',
    height: '46px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '20px',
    width: '380px',
    height: '48px',
  },
})) as typeof Button;

const CopyRight = styled(Typography)(() => ({
  fontSize: '16px',
  fontWeight: 500,
})) as typeof Typography;

const Login = () => {
  return (
    <Wrapper maxWidth="sm">
      <LogoTitle variant="h1">MatchGG</LogoTitle>
      <ButtonWrapper>
        <Typo>
          이미 <i>MatchGG</i> 의 회원이라면
        </Typo>
        <KakaoLoginBtn
          href={`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI_LOGIN}&response_type=code`}
        >
          <img
            src="https://d18ghgbbpc0qi2.cloudfront.net/assets/kakao_login_symbol.png"
            alt="kakao_login_symbol"
            width="20px"
          />
          카카오 로그인
        </KakaoLoginBtn>
        <Divider>or</Divider>
        <Typo>
          아직 <i>MatchGG</i> 의 회원이 아니라면
        </Typo>
        <RegisterBtn
          href={`https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI_REGISTER}&response_type=code`}
        >
          <i>MatchGG</i> 회원가입
        </RegisterBtn>
      </ButtonWrapper>
      <CopyRight>© 2023 MatchGG. All rights reserved.</CopyRight>
    </Wrapper>
  );
};

export default Login;
