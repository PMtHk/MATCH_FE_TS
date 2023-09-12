import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { unfollowUser, getFollowList } from 'apis/api/user';
import { snackbarActions } from 'store/snackbar-slice';

import { GAME_ID } from 'types/games';
import { gameList } from './data';

const Follow = () => {
  const dispatch = useDispatch();

  type Follower = {
    oauth2Id: string;
    lol: string;
    pubg: string;
    overwatch: string;
    valorant: string;
  };
  const [followList, setFollowList] = useState<Follower[]>([]);

  const initFollowList = async () => {
    const followers = await getFollowList();
    setFollowList(followers);
  };

  useEffect(() => {
    initFollowList();
  }, []);

  const cancelFollow = async (oauth2Id: string) => {
    if (window.confirm('해당 유저의 팔로우를 취소하기겠습니까?')) {
      await unfollowUser(oauth2Id);
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '팔로우 취소가 완료되었습니다.',
          severity: 'info',
        }),
      );
      initFollowList();
    }
  };

  return (
    <>
      {followList.length > 0 ? (
        <FollowListContainer>
          <TableContainer>
            <Table>
              <TableHead sx={{ display: 'block' }}>
                <TableRow>
                  <TableIndexCell align="center">{'   '}</TableIndexCell>
                  {gameList.map((game) => (
                    <TableGameCell align="center" key={game.id}>
                      {game.label}
                    </TableGameCell>
                  ))}
                  <TableCell>{'  '}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  display: 'block',
                  overflowY: 'auto',
                  maxHeight: '400px',
                }}
              >
                {followList?.map((user, idx) => {
                  return (
                    <TableRow
                      // eslint-disable-next-line react/no-array-index-key
                      key={idx + 1}
                      sx={{
                        backgroundColor: idx % 2 === 0 ? '#c8c8c8' : 'none',
                      }}
                    >
                      <TableIndexCell
                        align="center"
                        sx={{
                          color: idx % 2 === 0 ? 'white' : 'gray',
                        }}
                      >{`#${idx + 1}`}</TableIndexCell>
                      {gameList.map((game) => (
                        <TableGameCell align="center" key={game.id}>
                          {user[game.value as GAME_ID]}
                        </TableGameCell>
                      ))}
                      <TableCell
                        align="center"
                        sx={{ padding: '4px', height: '40px' }}
                      >
                        <IconButton onClick={() => cancelFollow(user.oauth2Id)}>
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
      ) : (
        <NoFollowerSection>
          <InfoOutlinedIcon
            sx={{
              fontSize: '27px',
              marginRight: '4px',
              marginBottom: '99px',
              color: 'gray',
            }}
          />
          <NoFollowerTypo>팔로우중인 사용자가 없습니다.</NoFollowerTypo>
        </NoFollowerSection>
      )}
      <div />
    </>
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
  // gap: '16px',
}));

const MenuTitle = styled(Typography)(() => ({
  width: '100%',
  fontSize: '18px',
  fontWeight: '700',
  padding: '0 0 0 8px',
  marginBottom: '12px',
})) as typeof Typography;

const FollowListContainer = styled(MuiBox)(() => ({
  marginTop: '20px',
})) as typeof MuiBox;

const TableIndexCell = styled(TableCell)(() => ({
  minWidth: '40px',
  maxWidth: '40px',
  padding: '0px',
})) as typeof TableCell;

const TableGameCell = styled(TableCell)(() => ({
  minWidth: '130px',
  maxWidth: '130px',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '15px',
})) as typeof TableCell;

const NoFollowerSection = styled(MuiBox)(() => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}));

const NoFollowerTypo = styled(Typography)(() => ({
  fontWeight: '600',
  fontSize: '18px',
  marginBottom: '100px',
  color: 'gray',
})) as typeof Typography;
