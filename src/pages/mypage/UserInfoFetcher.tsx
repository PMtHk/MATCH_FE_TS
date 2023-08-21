import React, { useEffect, useState } from 'react';

import { getUserInfo } from 'apis/api/user';
import { useDispatch, useSelector } from 'react-redux';

import { fetchMemberHistory as getSummonerInfo } from 'apis/api/leagueoflegends';
import {
  fetchMemberHistory as getPubgPlayerInfo,
  getPlatform,
} from 'apis/api/pubg';
import { fetchMemberHistory as getOWPlayerInfo } from 'apis/api/overwatch';

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
      const duoRankInfo = await getSummonerInfo(games.lol, 'DUO_RANK');
      const freeRankInfo = await getSummonerInfo(games.lol, 'FREE_RANK');
      dispatch(mypageActions.SET_LOLINFO({ duoRankInfo, freeRankInfo }));
    };

    if (games.lol) {
      getLolData();
    }
  }, [games.lol]);

  useEffect(() => {
    const getPubgData = async () => {
      const platform = await getPlatform(games.pubg);
      const duoInfo = await getPubgPlayerInfo(games.pubg, platform, 'DUO');
      const squadInfo = await getPubgPlayerInfo(games.pubg, platform, 'SQUAD');
      const rankedSquadInfo = await getPubgPlayerInfo(
        games.pubg,
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
      const rankInfo = await getOWPlayerInfo(games.overwatch, 'RANKED');
      const normalInfo = await getOWPlayerInfo(games.overwatch, 'NORMAL');
      dispatch(mypageActions.SET_OVERWATCHINFO({ rankInfo, normalInfo }));
    };

    if (games.overwatch) {
      getOverwatchData();
    }
  }, [games.overwatch]);

  return <div>{children}</div>;
};

export default UserInfoFetcher;
