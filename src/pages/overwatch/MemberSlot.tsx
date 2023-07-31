/* eslint-disable no-restricted-globals */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ref, getDatabase, get, update, child } from 'firebase/database';

import { authAxios, defaultAxios } from 'apis/utils';

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

import Circular from 'components/loading/Circular';
import { positionList, tierList } from './data';

interface MemberSlotProps {
  name: string;
}

const MemberSlot = ({ name }: MemberSlotProps) => {
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
  const authorNickname = memberInfo.name.substring(
    0,
    memberInfo.name.indexOf('#'),
  );

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

  const isAuthor = oauth2Id === currentCard?.author?.oauth2Id;

  useEffect(() => {
    const fetchSummonerInfo = async () => {
      const nickAndTag = name.trim().split('#');

      await defaultAxios
        .get(
          `/api/overwatch/player/${nickAndTag[0]}%23${nickAndTag[1]}/${currentCard.type}`,
        )
        .then((res) => {
          setMemberInfo(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    };

    fetchSummonerInfo();
  }, []);

  const kickMember = async () => {
    await authAxios
      .delete(`/api/chat/overwatch/${currentCard?.id}/ban`)
      .then(async (response) => {
        if (response.status === 200) {
          // Firebase RealtimeDB의 memberList에서 제거 및 banList에 추가
          const chatRoomRef = ref(getDatabase(), 'chatRooms');

          await get(child(chatRoomRef, currentCard?.chatRoomId)).then(
            async (dataSnapshot) => {
              const prevMemberList = [...dataSnapshot.val().memberList];
              const target = prevMemberList.find(
                (member) => member.nickname === name,
              );
              if (!target) {
                return location.reload();
              }
              const prevBannedList = dataSnapshot.val().bannedList
                ? [...dataSnapshot.val().bannedList]
                : [];
              const newMemberList = prevMemberList.filter(
                (member) => member.nickname !== name,
              );
              const newBannedList = [...prevBannedList, target];
              await update(
                ref(getDatabase(), `chatRooms/${currentCard?.chatRoomId}`),
                {
                  memberList: newMemberList,
                  bannedList: newBannedList,
                },
              ).then(() => {
                location.reload();
              });
              return null;
            },
          );
        }
      });
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
              {memberInfo?.mostHero.map((aHero, index) => {
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
            {isAuthor && currentCard?.name !== name && (
              <MuiIconButton
                onClick={() => {
                  //
                }}
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
  width: '600px',
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
