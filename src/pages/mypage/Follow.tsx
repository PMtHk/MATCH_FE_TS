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
import { deleteFollowList, getFollowList } from 'apis/api/user';

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
  const [followList, setFollowList] = useState<Follower[]>([]);

  useEffect(() => {
    const initFollowList = async () => {
      const response = await getFollowList();
      setFollowList(response);
    };
    initFollowList();
  }, []);

  const cancelFollow = async () => {
    await deleteFollowList();
  };
  if (followList.length > 0)
    return (
      <Container>
        <MenuTitle>팔로우 목록</MenuTitle>
        <FollowListContainer>
          <TableContainer>
            <Table>
              <TableHead sx={{ display: 'block' }}>
                <TableRow>
                  <TableIndexCell align="center">{'   '}</TableIndexCell>
                  <TableNicknameCell align="center">
                    리그오브레전드
                  </TableNicknameCell>
                  <TableNicknameCell align="center">
                    배틀그라운드
                  </TableNicknameCell>
                  <TableNicknameCell align="center">오버워치</TableNicknameCell>
                  <TableNicknameCell align="center">발로란트</TableNicknameCell>
                  <TableCell>{'  '}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{ display: 'block', overflowY: 'auto', maxHeight: '400px' }}
              >
                {followList?.map((user, idx) => {
                  return (
                    <TableRow
                      // eslint-disable-next-line react/no-array-index-key
                      key={idx}
                      sx={{
                        backgroundColor: idx % 2 === 0 ? '#c8c8c8' : 'none',
                      }}
                    >
                      <TableIndexCell
                        align="center"
                        sx={{ color: idx % 2 === 0 ? 'white' : 'gray' }}
                      >{`#${idx}`}</TableIndexCell>
                      <TableNicknameCell align="center">
                        {user.lol}
                      </TableNicknameCell>
                      <TableNicknameCell align="center">
                        {user.pubg}
                      </TableNicknameCell>
                      <TableNicknameCell align="center">
                        {user.overwatch}
                      </TableNicknameCell>
                      <TableNicknameCell align="center">
                        {user.valorant}
                      </TableNicknameCell>
                      <TableCell
                        align="center"
                        sx={{ padding: '4px', height: '40px' }}
                      >
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
  return <p>팔로우 없음ㅋ</p>;
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

const TableIndexCell = styled(TableCell)(() => ({
  minWidth: '40px',
  maxWidth: '40px',
  padding: '0px',
})) as typeof TableCell;

const TableNicknameCell = styled(TableCell)(() => ({
  minWidth: '110px',
  maxWidth: '110px',
  padding: '0px',
  whiteSpace: 'normal',
  fontSize: '15px',
})) as typeof TableCell;

const TablePubgCell = styled(TableCell)(() => ({
  minWidth: '120px',
  maxWidth: '120px',
  padding: '0px',
  whiteSpace: 'normal',
  fontSize: '15px',
})) as typeof TableCell;
