import React from 'react';

// mui
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// mui styled components
import { styled } from '@mui/system';

interface NavbarProps {
  isTop: boolean;
}

const Navbar = styled(AppBar)<NavbarProps>(({ isTop }) => ({
  position: 'fixed',
  height: 60,
  backgroundColor: '#ffffff',
  justifyContent: 'center',
  boxShadow: isTop ? 'none' : '0px 0px 10px 0px rgba(0,0,0,0.3)',
}));

const MenuWrapper = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})) as typeof Box;

const LogoTypo = styled(Typography)(() => ({
  flexGrow: 1,
  color: '#3d3939',
  fontSize: 20,
  fontWeight: 700,
  fontStyle: 'italic',
  textDecoration: 'none',
})) as typeof Typography;

const MenuTypo = styled(Typography)(() => ({
  color: '#686d72',
  fontSize: 14,
  fontWeight: 600,
  '&:hover': {
    borderBottom: '3px solid #686d72',
  },
})) as typeof Typography;

const Header = ({ isTop }: NavbarProps) => {
  return (
    <Navbar isTop={isTop}>
      <Container maxWidth="lg">
        <Toolbar>
          <MenuWrapper>
            <Link href="/" underline="none">
              <LogoTypo>MatchGG</LogoTypo>
            </Link>
            <Stack direction="row" spacing={3}>
              {/* <Link href="/" underline="none">
                <MenuTypo>Teams</MenuTypo>
              </Link>
              <Link href="/" underline="none">
                <MenuTypo>GitHub</MenuTypo>
              </Link> */}
              <Link href="/login" underline="none">
                <MenuTypo>SignIn / SignUp</MenuTypo>
              </Link>
            </Stack>
          </MenuWrapper>
        </Toolbar>
      </Container>
    </Navbar>
  );
};

export default Header;
