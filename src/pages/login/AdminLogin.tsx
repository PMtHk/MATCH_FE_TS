import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiContainer from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { loginForAdmin } from 'apis/api/admin';
import { getUserGameInfo } from 'apis/api/user';
import { snackbarActions } from 'store/snackbar-slice';
import { tokenActions } from 'store/token-slice';
import { userActions } from 'store/user-slice';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    try {
      const {
        accessToken,
        refreshToken,
        nickname,
        oauth2Id,
        profileImage,
        representative,
      } = await loginForAdmin(
        data.get('username') as string,
        data.get('password') as string,
      );

      dispatch(tokenActions.SET_TOKEN({ accessToken }));
      localStorage.setItem('matchGG_refreshToken', refreshToken);

      dispatch(
        userActions.SET_USER({
          nickname,
          oauth2Id,
          profileImage,
          representative,
          isAdmin: true,
        }),
      );

      const { lol, pubg, overwatch, valorant } = await getUserGameInfo();

      const games = { lol, pubg, overwatch, valorant };

      dispatch(userActions.SET_GAMES({ games }));

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '로그인에 성공했습니다. (Signed in successfully)',
          severity: 'success',
        }),
      );

      navigate(`/${representative}`);
    } catch (error: any) {
      console.log(error.response);
      if (error.response.status === 404) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '존재하지 않는 회원입니다. (User NotFound)',
            severity: 'error',
          }),
        );
      } else if (error.response.status === 500) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '비밀번호가 일치하지 않습니다. (Invalid Password)',
            severity: 'error',
          }),
        );
      } else {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '로그인에 실패했습니다. (Login Failed)',
            severity: 'error',
          }),
        );
      }
    }
  };

  return (
    <Wrapper>
      <Container maxWidth="sm">
        <LogoTitle variant="h1">
          MatchGG
          <Typography component="span" sx={{ ml: 1 }}>
            for Admin
          </Typography>
        </LogoTitle>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, pb: 6 }}
        >
          <Typography variant="h6" sx={{ mt: 1, mb: 3 }}>
            관리자 로그인 | Admin SignIn
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            name="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
        <CopyRight>© 2023 MatchGG. All rights reserved.</CopyRight>
      </Container>
    </Wrapper>
  );
};

export default AdminLogin;

const Wrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#dddddd',
  [theme.breakpoints.up('md')]: {
    backgroundColor: '#3d3939',
  },
})) as typeof Box;

const Container = styled(MuiContainer)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px',
  backgroundColor: '#dddddd',
  [theme.breakpoints.up('md')]: {
    height: 'calc(100vh - 200px)',
    minHeight: '560px',
    border: '1px solid #dddddd',
    borderRadius: '8px',
    padding: '40px 40px 10px',
  },
})) as typeof MuiContainer;

const LogoTitle = styled(Typography)(({ theme }) => ({
  fontSize: '38px',
  padding: '0 0 40px 0',
  fontStyle: 'italic',
  fontWeight: 700,
  [theme.breakpoints.up('sm')]: {
    fontSize: '44px',
  },
})) as typeof Typography;

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

const CopyRight = styled(Typography)(() => ({
  fontSize: '16px',
  fontWeight: 500,
})) as typeof Typography;
function navigate(arg0: string) {
  throw new Error('Function not implemented.');
}

function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
