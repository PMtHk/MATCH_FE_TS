import React from 'react';

// mui
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiContainer from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const AdminLogin = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('username'),
      password: data.get('password'),
    });
    // TODO: admin login
  };

  return (
    <Wrapper>
      <Container maxWidth="sm">
        <LogoTitle variant="h1">MatchGG</LogoTitle>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
