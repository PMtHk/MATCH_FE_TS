import React, { useEffect, useState } from 'react';
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

  const { nickname, imageUrl, oauth2Id } = useSelector(
    (state: RootState) => state.mypage,
  );

  const { email, created, likeCount, dislikeCount, matchCount } = useSelector(
    (state: RootState) => state.mypage,
  );

  const [currentMenu, setCurrentMenu] = useState<string>(menuList[0].value);

  const [title, setTItle] = useState<string>(menuList[0].label);

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
                <Toolbar
                  key={menu.id}
                  disableGutters
                  sx={{
                    backgroundColor:
                      currentMenu === menu.value ? 'lightgray' : 'none',
                    borderRadius: currentMenu === menu.value ? '4px' : 'none',
                    width: '180px',
                  }}
                >
                  <MenuButton
                    disabled={!menu.available}
                    fullWidth
                    onClick={() => {
                      setCurrentMenu(menu.value);
                      setTItle(menu.label);
                    }}
                  >
                    <MenuTypo>{menu.label}</MenuTypo>
                  </MenuButton>
                </Toolbar>
              );
            })}
          </Menubar>
        </UserProfileWrapper>
      </SidebarWrapper>
      <MenuWrapper>
        <MenuTitle>{title}</MenuTitle>
        <MenuContainer>
          {
            {
              myInfo: (
                <MyInfo
                  email={email}
                  created={created}
                  likeCount={likeCount}
                  dislikeCount={dislikeCount}
                  matchCount={matchCount}
                />
              ),
              games: <Games />,
              follow: <Follow />,
              withdrawal: <Withdrawal />,
            }[currentMenu]
          }
        </MenuContainer>
      </MenuWrapper>
    </Container>
  );
};

export default UserInfoContainer;

const Container = styled(MuiBox)(() => ({
  padding: '4px',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const SidebarWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  width: '200px',
  height: '600px',
  flexDirection: 'column',
  backgroundColor: '#eeeeee',
  border: '1px solid lightgray',
  borderRight: 'none',
  borderTopLeftRadius: '8px',
  borderBottomLeftRadius: '8px',
  padding: '32px 0 0 8px',
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
  width: '620px',
  height: '600px',
  flexDirection: 'column',
  backgroundColor: '#eeeeee',
  border: '1px solid lightgray',
  borderLeft: 'none',
  borderTopRightRadius: '8px',
  borderBottomRightRadius: '8px',
  padding: '32px 0 0 8px',
})) as typeof MuiBox;

const MenuTitle = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: '700',
})) as typeof MuiTypography;

const MenuContainer = styled(MuiBox)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '16px',
  paddingRight: '12px',
}));
