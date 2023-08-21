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
import { menuList } from './data';

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
            {menuList.map((menu) => {
              return (
                <Toolbar key={menu.id} disableGutters>
                  <MenuButton
                    disabled={!menu.available}
                    fullWidth
                    onClick={() => setCurrentMenu(menu.value)}
                  >
                    <MenuTypo
                      sx={{
                        borderBottom:
                          currentMenu === menu.value
                            ? '2px solid #3d3939'
                            : 'none',
                      }}
                    >
                      {menu.label}
                    </MenuTypo>
                  </MenuButton>
                </Toolbar>
              );
            })}
          </Menubar>
        </UserProfileWrapper>
      </SidebarWrapper>
      <MenuWrapper>
        {
          {
            myInfo: <MyInfo />,
            games: <Games />,
            follow: <Follow />,
            withdrawal: <Withdrawal />,
          }[currentMenu]
        }
      </MenuWrapper>
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
