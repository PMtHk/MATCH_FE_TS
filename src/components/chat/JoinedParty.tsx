import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiSkeleton from '@mui/material/Skeleton';

import { fetchBoardInfo } from 'apis/api/common';
import { snackbarActions } from 'store/snackbar-slice';
import { GAME_ID } from 'types/games';

import LolCard from 'pages/leagueoflegends/Card';
import PubgCard from 'pages/battlegrounds/Card';
import OverwatchCard from 'pages/overwatch/Card';

interface JoinedPartyProps {
  boardId: number;
  game: GAME_ID;
  handlePartyListClose: () => void;
}

const JoinedParty = ({
  boardId,
  game,
  handlePartyListClose,
}: JoinedPartyProps) => {
  const dispatch = useDispatch();

  const [chatRoomInfo, setChatRoomInfo] = React.useState<any>();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const fetchedInfo = await fetchBoardInfo(game, boardId);
        setChatRoomInfo(fetchedInfo);
      } catch (error: any) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: '게시글 정보를 가져오는 중 문제가 발생했습니다.',
            severity: 'error',
          }),
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  if (!isLoading && chatRoomInfo) {
    switch (game) {
      case 'lol':
        return (
          <Link
            to={
              chatRoomInfo.finished === 'true'
                ? `/${game}/${boardId}/review`
                : `/${game}/${boardId}`
            }
            state={{ background: `/${game}` }}
            style={{ textDecoration: 'none' }}
            onClick={() => {
              handlePartyListClose();
            }}
          >
            <CardWrapper>
              <LolCard
                item={chatRoomInfo}
                expired={chatRoomInfo.expired === 'true'}
              />
            </CardWrapper>
          </Link>
        );
      case 'pubg':
        return (
          <Link
            to={
              chatRoomInfo.finished === 'true'
                ? `/${game}/${boardId}/review`
                : `/${game}/${boardId}`
            }
            state={{ background: `/${game}` }}
            style={{ textDecoration: 'none' }}
            onClick={() => {
              handlePartyListClose();
            }}
          >
            <CardWrapper>
              <PubgCard
                item={chatRoomInfo}
                expired={chatRoomInfo.expired === 'true'}
              />
            </CardWrapper>
          </Link>
        );
      case 'overwatch':
        return (
          <Link
            to={
              chatRoomInfo.finished === 'true'
                ? `/${game}/${boardId}/review`
                : `/${game}/${boardId}`
            }
            state={{ background: `/${game}` }}
            style={{ textDecoration: 'none' }}
            onClick={() => {
              handlePartyListClose();
            }}
          >
            <CardWrapper>
              <OverwatchCard
                item={chatRoomInfo}
                expired={chatRoomInfo.expired === 'true'}
              />
            </CardWrapper>
          </Link>
        );
      default:
        return <p>게임 정보가 없습니다.</p>;
    }
  }

  return <p>게임 정보가 없습니다.</p>;
};

export default JoinedParty;

const CardWrapper = styled(MuiBox)(() => ({
  margin: '0 0 6px 0',
}));
