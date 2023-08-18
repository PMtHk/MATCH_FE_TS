import React, { useEffect, useState } from 'react';

import { getUserInfo } from 'apis/api/user';
import { useDispatch, useSelector } from 'react-redux';

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

import { mypageActions } from 'store/mypage-slice';
import { RootState } from 'store';
import Circular from 'components/loading/Circular';

interface UserInfoFetcherProps {
  children: React.ReactNode;
}

const UserInfoFetcher = ({ children }: UserInfoFetcherProps) => {
  const dispatch = useDispatch();

  const userInfo: any = getUserInfo();

  useEffect(() => {
    dispatch(mypageActions.SET_MYPAGE({ ...userInfo }));
  }, [userInfo, dispatch]);

  const { games } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const getLolData = async () => {
      const duoRankInfo = await fetchSummonerInfo(games.lol, 'DUO_RANK');
      const freeRankInfo = await fetchSummonerInfo(games.lol, 'FREE_RANK');
      dispatch(mypageActions.SET_LOLINFO({ duoRankInfo, freeRankInfo }));
    };

    if (games.lol) {
      getLolData();
    }
  }, [games.lol]);

  useEffect(() => {
    const getPubgData = async () => {
      const { nickname, platform } = await checkPUBGUserPlatform(games.pubg);
      const duoInfo = await fetchPubgPlayerInfo(nickname, platform, 'DUO');
      const squadInfo = await fetchPubgPlayerInfo(nickname, platform, 'SQUAD');
      const rankedSquadInfo = await fetchPubgPlayerInfo(
        nickname,
        platform,
        'RANKED_SQUAD',
      );
      dispatch(
        mypageActions.SET_PUBGINFO({ duoInfo, squadInfo, rankedSquadInfo }),
      );
    };

    if (games.pubg) {
      getPubgData();
    }
  }, [games.pubg]);

  useEffect(() => {
    const getOverwatchData = async () => {
      const [name, battleTag] = games.overwatch.split('#');

      const rankInfo = await fetchPlayerInfo(name, battleTag, 'RANKED');
      const normalInfo = await fetchPlayerInfo(name, battleTag, 'NORMAL');
      dispatch(mypageActions.SET_OVERWATCHINFO({ rankInfo, normalInfo }));
    };

    if (games.overwatch) {
      getOverwatchData();
    }
  }, [games.overwatch]);

  return <div>{children}</div>;
};

export default UserInfoFetcher;
