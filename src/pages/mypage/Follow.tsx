import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';

import { RootState } from 'store';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import PersonOffIcon from '@mui/icons-material/PersonOff';
import { getFollowList } from 'apis/api/user';

const Follow = () => {
  const testArr = [
    { id: 1, lol: '밍꾸라지', pubg: '배그킹', overwatch: '', valorant: '' },
    {
      id: 2,
      lol: '완도수산새우도둑완도수산새우도둑',
      pubg: '완도수산새우도둑완도수산새우도둑',
      overwatch: '완도수산새우도둑완도수산새우도둑',
      valorant: '완도수산새우도둑완도수산새우도둑',
    },
    { id: 3, lol: '수유욱', pubg: '', overwatch: '', valorant: '손 챙' },
    { id: 4, lol: '밍꾸라지', pubg: '배그킹', overwatch: '', valorant: '' },
    {
      id: 5,
      lol: '완도수산새우도둑완도수산새우도둑',
      pubg: '완도수산새우도둑완도수산새우도둑',
      overwatch: '완도수산새우도둑완도수산새우도둑',
      valorant: '완도수산새우도둑완도수산새우도둑',
    },
    { id: 6, lol: '수유욱', pubg: '', overwatch: '', valorant: '손 챙' },
  ];

  type Follower = {
    oauth2Id: string;
    lol: string;
    pubg: string;
    overwatch: string;
    valorant: string;
  };
  const [followList, setFollowList] = useState<Follower[] | null>(null);

  useEffect(() => {
    // const initFollowList = async () => {
    //   const response = await getFollowList();
    //   setFollowList(response);
    // };
    // initFollowList();
  }, []);

  const cancelFollow = () => {
    console.log('cancel');
  };

  return (
    <Container>
      <MenuTitle>팔로우 목록</MenuTitle>
      <FollowListContainer>
        <TableContainer>
          <Table>
            <TableHead sx={{ display: 'block' }}>
              <TableRow>
                <TableCell>{'   '}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '16px' }}>
                  리그오브레전드
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '16px' }}>
                  배틀그라운드
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '16px' }}>
                  오버워치
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '16px' }}>
                  발로란트
                </TableCell>
                <TableCell>{'  '}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{ display: 'block', overflowY: 'auto', maxHeight: '400px' }}
            >
              {testArr.map((user, idx) => {
                return (
                  <TableRow
                    key={user.id}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? '#c8c8c8' : 'none',
                    }}
                  >
                    <TableCell
                      sx={{ color: idx % 2 === 0 ? 'white' : 'gray' }}
                    >{`#${user.id}`}</TableCell>
                    <TableCell>{user.lol}</TableCell>
                    <TableCell>{user.pubg}</TableCell>
                    <TableCell>{user.overwatch}</TableCell>
                    <TableCell>{user.valorant}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={cancelFollow}>
                        <PersonOffIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </FollowListContainer>
    </Container>
  );
};
export default Follow;

const Container = styled(MuiBox)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '16px',
}));

const MenuTitle = styled(MuiTypography)(() => ({
  width: '100%',
  fontSize: '18px',
  fontWeight: '700',
  padding: '0 0 0 8px',
})) as typeof MuiTypography;

const FollowListContainer = styled(MuiBox)(() => ({
  marginRight: '12px',
})) as typeof MuiBox;
