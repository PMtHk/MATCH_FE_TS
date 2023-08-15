import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import {
  fetchSummonerInfo,
  loadSummonerInfoIntoDB,
} from 'apis/api/leagueoflegends';
import {
  checkPUBGUserPlatform,
  fetchPubgPlayerInfo,
  loadPubgPlayerInfoIntoDB,
} from 'apis/api/pubg';
import { fetchPlayerInfo, loadOWPlayerInfoInDB } from 'apis/api/overwatch';
import Circular from 'components/loading/Circular';
import GradeIcon from '@mui/icons-material/Grade';

import { RootState } from 'store';
import { Button, Divider, Tooltip } from '@mui/material';
import GameIcon from 'components/GameIcon';
import { gameList } from 'assets/Games.data';
import { snackbarActions } from 'store/snackbar-slice';

import { userActions } from 'store/user-slice';
import { handleRepresentativeGame } from 'apis/api/user';
import LolInfo from './Games/LolInfo';
import PubgInfo from './Games/PubgInfo';
import OverwatchInfo from './Games/OverwatchInfo';
import AddGame from './Games/AddGame';

type GameFilterProps = {
  selectedGame: string;
  setSelectedGame: Dispatch<SetStateAction<string>>;
  representative: string;
};

const GameFilterBar = ({
  selectedGame,
  setSelectedGame,
  representative,
}: GameFilterProps) => {
  return (
    <>
      <GameSelector>
        {gameList.map((aGame) => {
          return (
            <GameSelectorItem
              key={aGame.id}
              onClick={() => setSelectedGame(aGame.id)}
              selected={selectedGame === aGame.id}
            >
              <GameIcon
                item={aGame.id}
                id={aGame.id}
                size={{
                  width: '24px',
                  height: '22px',
                }}
              />
              <GameTypo selected={selectedGame === aGame.id}>
                {aGame.name_kor}
              </GameTypo>
              {aGame.id === representative && (
                <Tooltip title={`현재 대표게임 : ${representative}`}>
                  <GradeIcon sx={{ color: '#ffc939' }} />
                </Tooltip>
              )}
            </GameSelectorItem>
          );
        })}
      </GameSelector>
      <Divider />
    </>
  );
};

const GameDataUpdateButton = ({ game }: any) => {
  const dispatch = useDispatch();

  const { games } = useSelector((state: RootState) => state.user);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpdate = async () => {
    const nickname = games[game as 'lol' | 'pubg' | 'overwatch'];
    setIsLoading(true);
    if (game === 'lol') await loadSummonerInfoIntoDB(nickname);
    if (game === 'pubg') {
      const response = await checkPUBGUserPlatform(nickname);
      if (response.platform && response.nickname) {
        await loadPubgPlayerInfoIntoDB(response.nickname, response.platform);
      }
    }
    if (game === 'overwatch') {
      const [name, battleTag] = nickname.split('#');
      await loadOWPlayerInfoInDB(name, battleTag);
    }
    setIsLoading(false);
    dispatch(
      snackbarActions.OPEN_SNACKBAR({
        message: '정보 갱신이 완료되었습니다.',
        severity: 'success',
      }),
    );
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      sx={{ marginRight: '12px' }}
      onClick={handleUpdate}
      disabled={isLoading}
    >
      {isLoading ? '갱신중...' : '정보 갱신하기'}
    </Button>
  );
};

const HandleRepresentativeButton = ({ game, representative }: any) => {
  const dispatch = useDispatch();
  const handleRepresentative = async () => {
    const response = await handleRepresentativeGame(game);
    if (response) {
      // 대표게임 변경 성공
      dispatch(userActions.SET_REPRESENTATIVE({ representative: game }));
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '대표게임 변경이 완료되었습니다.',
          severity: 'success',
        }),
      );
    }
    // 대표게임 변경 실패
    else {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '대표게임 변경에 실패하였습니다.',
          severity: 'error',
        }),
      );
    }
  };
  return (
    <UpdateButton
      fullWidth
      onClick={handleRepresentative}
      variant="outlined"
      disabled={game === representative}
    >
      이 게임으로 대표게임을 변경하기
    </UpdateButton>
  );
};

const Games = () => {
  const { representative } = useSelector((state: RootState) => state.user);
  const [selectedGame, setSelectedGame] = useState<string>(representative);

  const { games } = useSelector((state: RootState) => state.user);

  const [lolData, setLolData] = useState<object | null>(null);
  const [pubgData, setPubgData] = useState<object | null>(null);
  const [overwatchData, setOverwatchData] = useState<object | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const getDatas = async () => {
      if (games.lol) {
        const duoRankInfo = await fetchSummonerInfo(games.lol, 'DUO_RANK');
        const freeRankInfo = await fetchSummonerInfo(games.lol, 'FREE_RANK');
        setLolData({ duoRankInfo, freeRankInfo });
      }
      if (games.pubg) {
        const { nickname, platform } = await checkPUBGUserPlatform(games.pubg);

        const duoInfo = await fetchPubgPlayerInfo(nickname, platform, 'DUO');
        const squadInfo = await fetchPubgPlayerInfo(
          nickname,
          platform,
          'SQUAD',
        );
        const rankedSquadInfo = await fetchPubgPlayerInfo(
          nickname,
          platform,
          'RANKED_SQUAD',
        );
        setPubgData({ duoInfo, squadInfo, rankedSquadInfo });
      }
      if (games.overwatch) {
        const [name, battleTag] = games.overwatch.split('#');

        const rankInfo = await fetchPlayerInfo(name, battleTag, 'RANKED');
        const normalInfo = await fetchPlayerInfo(name, battleTag, 'NORMAL');
        setOverwatchData({ rankInfo, normalInfo });
      }
      setIsLoading(false);
    };
    getDatas();
  }, [games]);

  if (!isLoading) {
    return (
      <Container sx={{ height: '100%' }}>
        <MenuTitle>연결한 게임</MenuTitle>
        <GameFilterBar
          selectedGame={selectedGame}
          setSelectedGame={setSelectedGame}
          representative={representative}
        />
        {
          {
            lol: games.lol ? (
              <LolInfo data={lolData} />
            ) : (
              <AddGame game="lol" />
            ),
            pubg: games.pubg ? (
              <PubgInfo data={pubgData} />
            ) : (
              <AddGame game="pubg" />
            ),
            overwatch: games.overwatch ? (
              <OverwatchInfo data={overwatchData} />
            ) : (
              <AddGame game="overwatch" />
            ),
          }[selectedGame]
        }
        {games[selectedGame as 'lol' | 'pubg' | 'overwatch'] && (
          <ButtonSection>
            <GameDataUpdateButton game={selectedGame} />
            <HandleRepresentativeButton
              game={selectedGame}
              representative={representative}
            />
          </ButtonSection>
        )}
      </Container>
    );
  }
  return <Circular height="500px" text="게임 정보를 가져오는 중입니다." />;
};
export default Games;

const Container = styled(MuiBox)(() => ({
  height: '100%',
})) as typeof MuiBox;

const ButtonSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const UpdateButton = styled(Button)(() => ({
  whiteSpace: 'nowrap',
  marginRight: '12px',
})) as typeof Button;

const GameSelector = styled(MuiBox)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  gap: '6px',
  padding: '0 4px 0 4px',
  marginTop: '12px',
})) as typeof MuiBox;

interface GameSelectorItem {
  selected: boolean;
}

const GameSelectorItem = styled(MuiBox, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<GameSelectorItem>(({ selected }) => ({
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  '&:hover': {
    cursor: 'pointer',
  },
  '& > img': {
    filter: selected ? '' : 'contrast(10%) opacity(50%)',
    webkitFilter: selected ? '' : 'contrast(10%) opacity(50%)',
  },
}));

interface GameTypoProps {
  selected: boolean;
}

const GameTypo = styled(MuiTypography, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<GameTypoProps>(({ selected }) => ({
  fontSize: selected ? '13px' : '12px',
  fontWeight: selected ? '600' : '400',
  color: selected ? '' : 'grey',
}));

const MenuTitle = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: 'bold',
}));
