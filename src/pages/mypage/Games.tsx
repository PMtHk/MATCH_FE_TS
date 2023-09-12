import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import { Button, Divider, Tooltip } from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import { mypageActions } from 'store/mypage-slice';

import { changeRepresentative } from 'apis/api/user';
import { loadHistory as lolLoadHistory } from 'apis/api/leagueoflegends';
import { getPlatform, loadHistory as pubgLoadHistory } from 'apis/api/pubg';
import { loadHistory as owLoadHistory } from 'apis/api/overwatch';
import { RootState } from 'store';
import { snackbarActions } from 'store/snackbar-slice';
import { userActions } from 'store/user-slice';
import { gameList } from 'assets/Games.data';
import GameIcon from 'components/GameIcon';
import { GAME_ID } from 'types/games';

import LolInfo from './Games/LolInfo';
import PubgInfo from './Games/PubgInfo';
import OverwatchInfo from './Games/OverwatchInfo';
import AddGame from './Games/AddGame';
import Nickname from './Games/Nickname';

interface GameFilterProps {
  selectedGame: string;
  setSelectedGame: Dispatch<SetStateAction<string>>;
  representative: string;
}

const GameFilterBar = ({
  selectedGame,
  setSelectedGame,
  representative,
}: GameFilterProps) => {
  return (
    <GameSelector>
      {gameList.map((aGame) => {
        return (
          aGame.available && (
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
          )
        );
      })}
    </GameSelector>
  );
};

const GameDataUpdateButton = ({ game }: any) => {
  const dispatch = useDispatch();

  const { games } = useSelector((state: RootState) => state.user);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpdate = async () => {
    const nickname = games[game as GAME_ID];
    setIsLoading(true);
    // DB에 전적 갱신하기
    if (game === 'lol') {
      await lolLoadHistory(nickname);
      dispatch(mypageActions.TOGGLE_REFRESH_LOL());
    }

    if (game === 'pubg') {
      const platform = await getPlatform(nickname);
      if (platform) {
        await pubgLoadHistory(nickname, platform);
        dispatch(mypageActions.TOGGLE_REFRESH_PUBG());
      }
    }

    if (game === 'overwatch') {
      await owLoadHistory(nickname);
      dispatch(mypageActions.TOGGLE_REFRESH_OVERWATCH());
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
      {isLoading ? '갱신중...' : '전적 갱신'}
    </Button>
  );
};

const ChangeRepresentativeButton = ({ game, representative }: any) => {
  const dispatch = useDispatch();
  const handleRepresentative = async () => {
    const response = await changeRepresentative(game);
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
      대표 게임으로 설정
    </UpdateButton>
  );
};

const Games = () => {
  const { representative, games } = useSelector(
    (state: RootState) => state.user,
  );

  const {
    lolInfo: lolData,
    pubgInfo: pubgData,
    overwatchInfo: overwatchData,
  } = useSelector((state: RootState) => state.mypage);

  const [selectedGame, setSelectedGame] = useState<string>(representative);

  const gameComponents = {
    lol: <LolInfo data={lolData} />,
    pubg: <PubgInfo data={pubgData} />,
    overwatch: <OverwatchInfo data={overwatchData} />,
    valorant: <div />,
  };

  return (
    <>
      {/* 게임 필터 바 */}
      <GameFilterBar
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        representative={representative}
      />
      {/* 닉네임 */}
      <Nickname
        name={games[selectedGame as GAME_ID]}
        game={selectedGame}
        isNew={!games[selectedGame as GAME_ID]}
      />
      {/* 각 게임 정보 */}
      {games[selectedGame as GAME_ID] ? (
        gameComponents[selectedGame as GAME_ID]
      ) : (
        <AddGame game={selectedGame} />
      )}
      {/* 전적 갱신, 대표게임 변경 버튼 */}
      {games[selectedGame as GAME_ID] && (
        <ButtonSection>
          <GameDataUpdateButton game={selectedGame} />
          <ChangeRepresentativeButton
            game={selectedGame}
            representative={representative}
          />
        </ButtonSection>
      )}
    </>
  );
};
export default Games;

const ButtonSection = styled(MuiBox)(() => ({
  position: 'absolute',
  bottom: '12px',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const UpdateButton = styled(Button)(() => ({
  whiteSpace: 'nowrap',
  marginRight: '12px',
})) as typeof Button;

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

const GameSelector = styled(MuiBox)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  gap: '6px',
  padding: '0 4px 0 4px',
  marginTop: '12px',
})) as typeof MuiBox;
