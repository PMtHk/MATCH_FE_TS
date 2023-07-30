import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiAppbar from '@mui/material/AppBar';
import MuiTypography from '@mui/material/Typography';
import MuiToolbar from '@mui/material/Toolbar';
import MuiButton from '@mui/material/Button';

import { RootState } from 'store';
import { mypageActions } from 'store/mypage-slice';
import MyInfo from './MyInfo';
import Games from './Games';
import Follow from './Follow';
import Withdrawal from './Withdrawal';

const UserInfoContainer = () => {
  const dispatch = useDispatch();

  const [currentMenu, setCurrentMenu] = React.useState<string>('myInfo');

  const { nickname, imageUrl, oauth2Id } = useSelector(
    (state: RootState) => state.mypage,
  );

  useEffect(() => {
    return () => {
      dispatch(mypageActions.RESET_MYPAGE());
    };
  }, []);

  if (!nickname && !oauth2Id) {
    return <div />;
  }

  return (
    <Container>
      <SidebarWrapper>
        <UserProfileWrapper>
          <UserImageWrapper>
            <img
              src={imageUrl}
              alt="profile_image"
              height="100%"
              width="100%"
            />
          </UserImageWrapper>
          <Username>{nickname}</Username>
          <Menubar component="nav" position="relative">
            <Toolbar disableGutters>
              <MenuButton fullWidth onClick={() => setCurrentMenu('myInfo')}>
                <MenuTypo
                  sx={{
                    borderBottom:
                      currentMenu === 'myInfo' ? '2px solid #3d3939' : 'none',
                  }}
                >
                  내 정보
                </MenuTypo>
              </MenuButton>
            </Toolbar>
            <Toolbar disableGutters>
              <MenuButton fullWidth onClick={() => setCurrentMenu('games')}>
                <MenuTypo
                  sx={{
                    borderBottom:
                      currentMenu === 'games' ? '2px solid #3d3939' : 'none',
                  }}
                >
                  연결한 게임
                </MenuTypo>
              </MenuButton>
            </Toolbar>
            <Toolbar disableGutters>
              <MenuButton
                disabled
                fullWidth
                onClick={() => setCurrentMenu('follow')}
              >
                <MenuTypo
                  sx={{
                    borderBottom:
                      currentMenu === 'follow' ? '2px solid #3d3939' : 'none',
                  }}
                >
                  팔로우 목록
                </MenuTypo>
              </MenuButton>
            </Toolbar>
            <Toolbar disableGutters>
              <MenuButton
                fullWidth
                disabled
                onClick={() => setCurrentMenu('withdrawal')}
              >
                <MenuTypo
                  sx={{
                    borderBottom:
                      currentMenu === 'withdrawal'
                        ? '2px solid #3d3939'
                        : 'none',
                  }}
                >
                  서비스 탈퇴
                </MenuTypo>
              </MenuButton>
            </Toolbar>
          </Menubar>
        </UserProfileWrapper>
      </SidebarWrapper>
      {currentMenu === 'myInfo' && (
        <MenuWrapper>
          <MyInfo />
        </MenuWrapper>
      )}
      {currentMenu === 'games' && (
        <MenuWrapper>
          <Games />
        </MenuWrapper>
      )}
      {currentMenu === 'follow' && (
        <MenuWrapper>
          <Follow />
        </MenuWrapper>
      )}
      {currentMenu === 'withdrawal' && (
        <MenuWrapper>
          <Withdrawal />
        </MenuWrapper>
      )}
    </Container>
  );
};

export default UserInfoContainer;

const Container = styled(MuiBox)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const SidebarWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  width: '200px',
  height: '540px',
  flexDirection: 'column',
  backgroundColor: '#eeeeee',
  border: '1px solid #3d3939',
  borderRight: 'none',
  borderTopLeftRadius: '8px',
  borderBottomLeftRadius: '8px',
  padding: '32px 0',
})) as typeof MuiBox;

const UserProfileWrapper = styled(MuiBox)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
})) as typeof MuiBox;

const UserImageWrapper = styled(MuiBox)(() => ({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  overflow: 'hidden',
  '& > img': {
    objectFit: 'cover',
  },
})) as typeof MuiBox;

const Username = styled(MuiTypography)(() => ({
  fontSize: '20px',
  fontWeight: '600',
})) as typeof MuiTypography;

const Menubar = styled(MuiAppbar)(() => ({
  width: '100%',
  backgroundColor: 'inherit',
  boxShadow: 'none',
})) as typeof MuiAppbar;

const Toolbar = styled(MuiToolbar)(() => ({
  borderRadius: 0,
  width: '100%',
  padding: '0 0 0 0 !important',
})) as typeof MuiToolbar;

const MenuButton = styled(MuiButton)(() => ({
  width: '100%',
  height: '100%',
  padding: '0',
  color: 'black',
  fontSize: '16px',
  fontWeight: '600',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
})) as typeof MuiButton;

const MenuTypo = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 0 32px',
  padding: '0 4px',
})) as typeof MuiTypography;

const MenuWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  width: '560px',
  height: '540px',
  flexDirection: 'column',
  backgroundColor: '#eeeeee',
  border: '1px solid #3d3939',
  borderLeft: 'none',
  borderTopRightRadius: '8px',
  borderBottomRightRadius: '8px',
  padding: '32px 0',
})) as typeof MuiBox;
