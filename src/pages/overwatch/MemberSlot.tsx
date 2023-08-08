/* eslint-disable no-restricted-globals */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import MuiDivider from '@mui/material/Divider';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Close from '@mui/icons-material/Close';

import { RootState } from 'store';
import { snackbarActions } from 'store/snackbar-slice';
import { refreshActions } from 'store/refresh-slice';
import Circular from 'components/loading/Circular';
import { kickMemberFromParty } from 'apis/api/common';
import { fetchPlayerInfo } from 'apis/api/overwatch';
import { positionList, tierList } from './data';

interface MemberSlotProps {
  name: string;
}

const MemberSlot = ({ name }: MemberSlotProps) => {
  const dispatch = useDispatch();

  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);

  const [memberInfo, setMemberInfo] = React.useState<any>({
    name: '',
    type: '',
    tank_tier: '',
    tank_rank: '',
    damage_tier: '',
    damage_rank: '',
    support_tier: '',
    support_rank: '',
    wins: 0,
    losses: 0,
    kills: 0,
    deaths: 0,
    mostHero: [],
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  // author info
  const authorNickname = memberInfo.name.split('#')[0];
  const nickAndTag = name.trim().split('#');

  type calcedInfo = {
    value: number;
    color: string;
  };

  const calcKDInfo = (): calcedInfo => {
    const kd: number =
      memberInfo.kills === 0 || memberInfo.deaths === 0
        ? 0
        : Number((memberInfo.kills / memberInfo.deaths).toFixed(2));
    let color = '#000';
    if (kd >= 4) {
      color = 'red';
    } else if (kd >= 2.5) {
      color = 'orange';
    } else {
      color = '#000';
    }
    return {
      value: kd,
      color,
    };
  };

  const tank =
    memberInfo.tank_tier === 'none'
      ? 'UNRANKED'
      : memberInfo.tank_tier.toUpperCase();
  const damage =
    memberInfo.damage_tier === 'none'
      ? 'UNRANKED'
      : memberInfo.damage_tier.toUpperCase();
  const support =
    memberInfo.support_tier === 'none'
      ? 'UNRANKED'
      : memberInfo.support_tier.toUpperCase();

  const authorTankTier = tierList.find((aTier) => aTier.value === tank);
  const authorDamageTier = tierList.find((aTier) => aTier.value === damage);
  const authorSupportTier = tierList.find((aTier) => aTier.value === support);
  const totalPlayed = memberInfo.wins + memberInfo.losses;
  const winRate = Math.round((memberInfo.wins / totalPlayed) * 100);
  const authorKDTypo = (memberInfo.kills / memberInfo.deaths).toFixed(2);

  const isAuthor = oauth2Id === currentCard?.oauth2Id;

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedPlayerInfo = await fetchPlayerInfo(
          nickAndTag[0],
          nickAndTag[1],
          currentCard.type,
        );

        setMemberInfo(fetchedPlayerInfo);
        setIsLoading(false);
      } catch (error: any) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: `${authorNickname}님의 정보를 불러오는 중 문제가 발생했습니다.`,
            severity: 'error',
          }),
        );
      }
    };

    getData();
  }, []);

  const handleKickBtn = async () => {
    const userCheck = window.confirm(
      '강제퇴장 당한 사용자는 다시 입장할 수 없습니다.\n그래도 진행하시겠습니까?',
    );

    if (userCheck) {
      await handleKick();
    }
    return null;
  };

  const handleKick = async () => {
    try {
      await kickMemberFromParty(
        currentCard?.id,
        currentCard?.chatRoomId,
        `${nickAndTag[0]}%23${nickAndTag[1]}`,
        'overwatch',
      );

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: `${name} 님을 파티에서 제외시켰습니다.`,
          severity: 'success',
        }),
      );
      dispatch(refreshActions.REFRESH_CARD());
    } catch (error: any) {
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: '문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
          severity: 'error',
        }),
      );
    }
  };
  return (
    <>
      {isLoading && (
        <Member>
          <Circular text="" height="100%" />
        </Member>
      )}
      {!isLoading && (
        <Member>
          <SectionInMember>
            <SectionTitleInMember>닉네임</SectionTitleInMember>
            <Nickname>{authorNickname}</Nickname>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>승률</SectionTitleInMember>
            <WinRateSection>
              <WinRate
                component="span"
                sx={{ color: winRate >= 50 ? '#d31f45' : '#5383e8' }}
              >
                {winRate}%
              </WinRate>
              <MatchPlayed>
                {memberInfo.wins}승 {memberInfo.losses}패
              </MatchPlayed>
            </WinRateSection>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>K/D</SectionTitleInMember>
            <KDSection>
              <KDTypo sx={{ color: calcKDInfo().color }}>{authorKDTypo}</KDTypo>
            </KDSection>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>티어</SectionTitleInMember>
            <TierSection>
              <PositionRankSection>
                <PositionEmblemWrapper>
                  <img
                    src={positionList[1].imageUrl}
                    alt={positionList[1]?.value}
                    width="8px"
                    height="8px"
                  />
                </PositionEmblemWrapper>
                <RankEmblemWrapper>
                  <img
                    src={authorTankTier?.imageUrl}
                    alt={authorTankTier?.value}
                    width={
                      authorTankTier?.value === 'GRANDMASTER' ||
                      authorTankTier?.value === 'MASTER'
                        ? '30px'
                        : '36px'
                    }
                    height={
                      authorTankTier?.value === 'GRANDMASTER' ||
                      authorTankTier?.value === 'MASTER'
                        ? '30px'
                        : '36px'
                    }
                  />
                </RankEmblemWrapper>
                <Tier sx={{ color: authorTankTier?.color }}>
                  {authorTankTier?.acronym}
                  {memberInfo.tank_rank === 'none' ? '' : memberInfo.tank_rank}
                </Tier>
              </PositionRankSection>
              <MuiDivider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <PositionRankSection>
                <PositionEmblemWrapper>
                  <img
                    src={positionList[2].imageUrl}
                    alt={positionList[2]?.value}
                    width="8px"
                    height="8px"
                  />
                </PositionEmblemWrapper>
                <RankEmblemWrapper>
                  <img
                    src={authorDamageTier?.imageUrl}
                    alt={authorDamageTier?.value}
                    width={
                      authorDamageTier?.value === 'GRANDMASTER' ||
                      authorDamageTier?.value === 'MASTER'
                        ? '30px'
                        : '36px'
                    }
                    height={
                      authorDamageTier?.value === 'GRANDMASTER' ||
                      authorDamageTier?.value === 'MASTER'
                        ? '30px'
                        : '36px'
                    }
                  />
                </RankEmblemWrapper>
                <Tier sx={{ color: authorDamageTier?.color }}>
                  {authorDamageTier?.acronym}
                  {memberInfo.damage_rank === 'none'
                    ? ''
                    : memberInfo.damage_rank}
                </Tier>
              </PositionRankSection>
              <MuiDivider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <PositionRankSection>
                <PositionEmblemWrapper>
                  <img
                    src={positionList[3].imageUrl}
                    alt={positionList[3]?.value}
                    width="8px"
                    height="8px"
                  />
                </PositionEmblemWrapper>
                <RankEmblemWrapper>
                  <img
                    src={authorSupportTier?.imageUrl}
                    alt={authorSupportTier?.value}
                    width={
                      authorSupportTier?.value === 'GRANDMASTER' ||
                      authorSupportTier?.value === 'MASTER'
                        ? '30px'
                        : '36px'
                    }
                    height={
                      authorSupportTier?.value === 'GRANDMASTER' ||
                      authorSupportTier?.value === 'MASTER'
                        ? '30px'
                        : '36px'
                    }
                  />
                </RankEmblemWrapper>
                <Tier sx={{ color: authorSupportTier?.color }}>
                  {authorSupportTier?.acronym}
                  {memberInfo.support_rank === 'none'
                    ? ''
                    : memberInfo.support_rank}
                </Tier>
              </PositionRankSection>
            </TierSection>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>모스트 영웅</SectionTitleInMember>
            <ImageList
              sx={{ m: '4px 0 0 0', p: 0, height: '50px' }}
              cols={3}
              gap={4}
            >
              {memberInfo?.mostHero.map((aHero: string, _index: number) => {
                return (
                  <ImageListItem
                    key={aHero}
                    sx={{
                      width: '44px',
                      height: '44px',
                      gap: 1,
                      border: '2px solid black',
                    }}
                  >
                    <img
                      src={`https://d18ghgbbpc0qi2.cloudfront.net/overwatch/heroes/${aHero.toLowerCase()}.png`}
                      alt={aHero}
                      loading="lazy"
                    />
                  </ImageListItem>
                );
              })}
            </ImageList>
          </SectionInMember>
          <MemberControlPanel>
            {isAuthor && currentCard?.author.name !== name && (
              <MuiIconButton
                size="small"
                onClick={handleKickBtn}
                // disabled={
                //   currentCard.expired === 'true' ||
                //   currentCard.finished === 'true'
                // }
                // 강퇴 api 서버 오류로 인한 disabled
                disabled
              >
                <Close />
              </MuiIconButton>
            )}
          </MemberControlPanel>
        </Member>
      )}
    </>
  );
};

export default MemberSlot;

const Member = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '625px',
  height: '90px',
  border: '1px solid #cccccc',
  borderRadius: '8px',
  padding: '8px',
  margin: '0 0 4px 0',
})) as typeof MuiBox;

const SectionInMember = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
})) as typeof MuiBox;

const SectionTitleInMember = styled(MuiTypography)(() => ({
  color: '#878888',
  fontSize: '12px',
  fontWeight: '700',
})) as typeof MuiTypography;

const Nickname = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: '700',
  minWidth: '120px',
  lineHeight: '57px',
  textOverflow: 'ellipsis',
})) as typeof MuiTypography;

const WinRateSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minWidth: '80px',
  minHeight: '57px',
})) as typeof MuiBox;

const WinRate = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: '700',
})) as typeof MuiTypography;

const MatchPlayed = styled(MuiTypography)(() => ({
  fontSize: '12px',
  fontWeight: '500',
  color: '#000000',
})) as typeof MuiTypography;

const KDSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minWidth: '60px',
  minHeight: '57px',
})) as typeof MuiBox;

const KDTypo = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: '700',
})) as typeof MuiTypography;

const TierSection = styled(MuiBox)(() => ({
  width: '150px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})) as typeof MuiBox;

const PositionRankSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})) as typeof MuiBox;

const RankEmblemWrapper = styled(MuiBox)(() => ({
  width: '40px',
  height: '25px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
})) as typeof MuiBox;

const PositionEmblemWrapper = styled(MuiBox)(() => ({
  backgroundColor: '#d8d8d8c8',
  borderRadius: '50%',
  width: '14px',
  height: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const Tier = styled(MuiTypography)(() => ({
  width: '100%',
  fontSize: '12px',
  fontWeight: '600',
  textAlign: 'center',
})) as typeof MuiTypography;

const MemberControlPanel = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '30px',
})) as typeof MuiBox;
