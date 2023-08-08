import React, { useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiAppBar from '@mui/material/AppBar';
import MuiContainer from '@mui/material/Container';
import MuiToolbar from '@mui/material/Toolbar';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiSwipeableDrawer from '@mui/material/SwipeableDrawer';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import { RootState } from 'store';

import GameIcon from 'components/GameIcon';
import Notification from 'components/notification/Notification';
import ChatRoomListFetcher from 'components/notification/ChatRoomListFetcher';
import { getCurrentGame } from 'functions/commons';
import { GAME_ID } from 'types/games';
import JoinedPartyList from 'components/chat/JoinedPartyList';
import UserMenu from './UserMenu';
import GameMenu from './GameMenu';

const Header = () => {
  const navigate = useNavigate();

  const currentGame: GAME_ID = getCurrentGame();

  const { isLogin, representative } = useSelector(
    (state: RootState) => state.user,
  );
  const { joinedChatRoomsId } = useSelector(
    (state: RootState) => state.chatroom,
  );

  const [isMobileViewMenuOpen, setIsMobileViewMenuOpen] = React.useState(false);

  const openMobileViewMenu = () => {
    setIsMobileViewMenuOpen(true);
  };

  const closeMobileViewMenu = () => {
    setIsMobileViewMenuOpen(false);
  };

  // notification
  const [notiAnchorEl, setNotiAnchorEl] = useState<any>(null);
  const notiOpen = Boolean(notiAnchorEl);
  const handleNotiClick = (e: any) => {
    setNotiAnchorEl(e.currentTarget);
  };
  const handleNotiClose = () => {
    setNotiAnchorEl(null);
  };

  // joinedParyList
  const [partyListAnchorEl, setPartyListAnchorEl] = useState<any>(null);
  const partyListOpen = Boolean(partyListAnchorEl);
  const handlePartyListOpen = (e: any) => {
    setPartyListAnchorEl(e.currentTarget);
  };
  const handlePartyListClose = () => {
    setPartyListAnchorEl(null);
  };

  return (
    <AppBar component="nav" position="fixed">
      <MuiContainer maxWidth="lg">
        <Toolbar disableGutters>
          <MVMenuBtn onClick={openMobileViewMenu}>
            <MenuIcon sx={{ color: '#f3f3f3', m: 0, p: 0 }} />
          </MVMenuBtn>
          <MVMenu
            anchor="left"
            open={isMobileViewMenuOpen}
            onClose={closeMobileViewMenu}
            onOpen={openMobileViewMenu}
          >
            <MvMenuContainer>
              <MVMenuHeader>
                <MVLogoText>Match.GG</MVLogoText>
                <MVMenuCloseBtn onClick={closeMobileViewMenu}>
                  <CloseIcon sx={{ color: '#3d3939' }} />
                </MVMenuCloseBtn>
              </MVMenuHeader>
              <MVMenuBody>
                <GameContainer
                  onClick={() => {
                    closeMobileViewMenu();
                    navigate('/lol');
                  }}
                >
                  <GameIcon
                    id="lol"
                    item="leagueoflegends"
                    size={{ width: '30px', height: '30px' }}
                  />
                  <GameTitle>리그오브레전드</GameTitle>
                </GameContainer>
              </MVMenuBody>
              <MVMenuFooter>
                {!isLogin ? (
                  <MVLoginBtn
                    onClick={() => {
                      navigate('/login');
                    }}
                  >
                    <LoginIcon sx={{ color: '#3d3939' }} />
                    <MVFooterText>로그인</MVFooterText>
                  </MVLoginBtn>
                ) : (
                  <MVLogoutBtn>
                    <LogoutIcon sx={{ color: '#3d3939' }} />
                    <MVFooterText>로그아웃</MVFooterText>
                  </MVLogoutBtn>
                )}
                <MVLogoText>Match.GG</MVLogoText>
              </MVMenuFooter>
            </MvMenuContainer>
          </MVMenu>
          {/* 위는 모바일 뷰를 위한 슬라이더 아래는 웹뷰 */}
          <MuiButton
            type="submit"
            onClick={() => navigate(`/${representative.toLowerCase()}`)}
            sx={{ textTransform: 'none' }}
          >
            <MatchGGLogo>MatchGG</MatchGGLogo>
          </MuiButton>
          <GameMenu />
          {isLogin && (
            <ChatRoomListFetcher>
              {joinedChatRoomsId && (
                <Notification
                  handleNotiClick={handleNotiClick}
                  notiAnchorEl={notiAnchorEl}
                  notiOpen={notiOpen}
                  handleNotiClose={handleNotiClose}
                />
              )}
            </ChatRoomListFetcher>
          )}
          {isLogin && joinedChatRoomsId && (
            <JoinedPartyList
              partyListAnchorEl={partyListAnchorEl}
              partyListOpen={partyListOpen}
              handlePartyListOpen={handlePartyListOpen}
              handlePartyListClose={handlePartyListClose}
            />
          )}
          {isLogin && <UserMenu />}
          {!isLogin && (
            <LoginBtnWrapper
              onClick={() => {
                navigate('/login');
              }}
              sx={{
                textDecoration: 'none',
              }}
            >
              <LoginIcon sx={{ color: '#f3f3f3' }} />
              <LoginText>로그인 / 회원가입</LoginText>
            </LoginBtnWrapper>
          )}
        </Toolbar>
      </MuiContainer>
    </AppBar>
  );
};

export default Header;

const AppBar = styled(MuiAppBar)(() => ({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '#3d3939',
  color: '#ffffff',
  height: '60px',
})) as typeof MuiAppBar;

const Toolbar = styled(MuiToolbar)(() => ({
  display: 'flex',
  height: '100%',
})) as typeof MuiToolbar;

const MVMenuBtn = styled(MuiButton)(({ theme }) => ({
  display: 'inine-block',
  minHeight: '0',
  minWidth: '0',
  padding: '0',
  margin: '0 4px 0 4px',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
})) as typeof MuiButton;

const MVMenu = styled(MuiSwipeableDrawer)(
  () => ({}),
) as typeof MuiSwipeableDrawer;

const MvMenuContainer = styled(MuiBox)(() => ({
  minWidth: '300px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
})) as typeof MuiBox;

const MVMenuHeader = styled(MuiBox)(() => ({
  width: '100%',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  borderBottom: '1px solid #7d7c7c',
})) as typeof MuiBox;

const MVLogoText = styled(MuiTypography)(() => ({
  color: '#3d3939',
  fontSize: '18px',
  fontWeight: '700',
  fontStyle: 'italic',
})) as typeof MuiTypography;

const MVMenuCloseBtn = styled(MuiButton)(() => ({
  display: 'inine-block',
  minHeight: '0',
  minWidth: '0',
  padding: '0',
  margin: '0 4px 0 0',
})) as typeof MuiButton;

const MVMenuBody = styled(MuiBox)(() => ({
  width: '100%',
  height: 'calc(100vh - 300px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'start',
  padding: '32px 0 0 16px',
})) as typeof MuiBox;

const GameContainer = styled(MuiButton)(() => ({
  width: '100%',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  textDecoration: 'none',
})) as typeof MuiButton;

const GameTitle = styled(MuiTypography)(() => ({
  color: '#3d3939',
  fontSize: '18px',
  fontWeight: '600',
  padding: '0 0 0 16px',
})) as typeof MuiTypography;

const MVMenuFooter = styled(MuiBox)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 16px',
  borderTop: '1px solid #7d7c7c',
})) as typeof MuiBox;

const MVLoginBtn = styled(MuiButton)(() => ({
  width: '100%',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
})) as typeof MuiButton;

const MVLogoutBtn = styled(MuiButton)(() => ({
  width: '100%',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
})) as typeof MuiButton;

const MVFooterText = styled(MuiTypography)(() => ({
  color: '#3d3939',
  fontSize: '16px',
  fontWeight: '600',
  padding: '0 0 0 16px',
})) as typeof MuiTypography;

const MatchGGLogo = styled(MuiTypography)(({ theme }) => ({
  fontSize: '22px',
  fontStyle: 'italic',
  fontWeight: '700',
  color: '#f3f3f3',
  flexGrow: 1,
  [theme.breakpoints.up('md')]: {
    flexGrow: 0,
  },
})) as typeof MuiTypography;

const LoginBtnWrapper = styled(MuiIconButton)(
  () => ({}),
) as typeof MuiIconButton;

const LoginText = styled(MuiTypography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: '600',
  color: '#f3f3f3',
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'flex',
  },
  padding: '0 0 0 8px',
})) as typeof MuiTypography;
