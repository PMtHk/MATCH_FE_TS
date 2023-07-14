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
import MuiImageList from '@mui/material/ImageList';

import Close from '@mui/icons-material/Close';

import { RootState } from 'store';

import Circular from 'components/loading/Circular';
import { positionList, tierList } from './data';

interface MemberSlotProps {
  summonerName: string;
}

const MemberSlot = ({ summonerName }: MemberSlotProps) => {
  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);

  const [memberInfo, setMemberInfo] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // author info
  const mostLane = positionList.find(
    (aPosition) => aPosition.value === memberInfo?.mostLane,
  );

  const tier = tierList.find((aTier) => aTier.value === memberInfo?.tier);

  // 아래 구문은 조금 더 찾아보고 수정할 수 있도록 하겠음. 6/28 나주엽
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalPlayed = memberInfo?.wins + memberInfo?.losses;
  const winRate = Math.round((memberInfo.wins / totalPlayed) * 100);

  const isAuthor = oauth2Id === currentCard?.author?.oauth2Id;

  const rankRomanToNum = (rank: string) => {
    switch (rank) {
      case 'I':
        return 1;
      case 'II':
        return 2;
      case 'III':
        return 3;
      case 'IV':
        return 4;
      default:
        return 4;
    }
  };

  useEffect(() => {
    const fetchSummonerInfo = async () => {
      await defaultAxios
        .get(
          `/api/lol/summoner/${summonerName}/${
            currentCard.type === 'FREE_RANK' ? 'free_rank' : 'duo_rank'
          }`,
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
      .delete(`/api/chat/lol/${currentCard?.id}/ban`)
      .then(async (response) => {
        if (response.status === 200) {
          // Firebase RealtimeDB의 memberList에서 제거 및 banList에 추가
          const chatRoomRef = ref(getDatabase(), 'chatRooms');

          await get(child(chatRoomRef, currentCard?.chatRoomId)).then(
            async (dataSnapshot) => {
              const prevMemberList = [...dataSnapshot.val().memberList];
              const target = prevMemberList.find(
                (member) => member.nickname === summonerName,
              );
              if (!target) {
                return location.reload();
              }
              const prevBannedList = dataSnapshot.val().bannedList
                ? [...dataSnapshot.val().bannedList]
                : [];
              const newMemberList = prevMemberList.filter(
                (member) => member.nickname !== summonerName,
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
            <SectionTitleInMember>소환사명</SectionTitleInMember>
            <Nickname>{memberInfo?.summonerName}</Nickname>
            <MostLaneInfo>
              <img
                src={mostLane?.imageUrl}
                alt="lane_icon"
                loading="lazy"
                width="20px"
                height="20px"
              />
              <MostLanteTypo>{mostLane?.label}</MostLanteTypo>
            </MostLaneInfo>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>티어</SectionTitleInMember>
            <FlexRow>
              <RankEmblemWrapper>
                <img
                  src={tier?.imageUrl}
                  alt="rank"
                  width="32px"
                  height="24px"
                  loading="lazy"
                />
              </RankEmblemWrapper>
              <TierWinRateWrapper>
                <TierTypo sx={{ color: tier?.color }}>
                  {tier?.acronym}
                  {rankRomanToNum(memberInfo.rank)}-{memberInfo?.leaguePoints}LP
                </TierTypo>
                <MatchPlayed>
                  {memberInfo?.wins}승 {memberInfo?.losses}패
                  <WinRate
                    component="span"
                    sx={{ color: winRate >= 50 ? '#d31f45' : '#5383e8' }}
                  >
                    ({winRate}%)
                  </WinRate>
                </MatchPlayed>
              </TierWinRateWrapper>
            </FlexRow>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>모스트 챔피언</SectionTitleInMember>
            <MuiImageList sx={{ m: 0, p: 0 }} cols={3} gap={1}>
              {memberInfo &&
                memberInfo.mostChampion?.map((champion: string) => (
                  <ChampImgWrapper key={champion}>
                    <img
                      src={`https://d18ghgbbpc0qi2.cloudfront.net/lol/champions/${champion.toLowerCase()}.jpg`}
                      alt={champion}
                      loading="lazy"
                      width="40px"
                      height="50px"
                    />
                  </ChampImgWrapper>
                ))}
            </MuiImageList>
          </SectionInMember>
          <MemberControlPanel>
            {isAuthor && currentCard?.name !== summonerName && (
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
  width: '520px',
  height: '80px',
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
  fontSize: '16px',
  fontWeight: '700',
  minWidth: '120px',
  textOverflow: 'ellipsis',
})) as typeof MuiTypography;

const MostLaneInfo = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  '& > img': {
    mixBlendMode: 'exclusion',
  },
})) as typeof MuiBox;

const MostLanteTypo = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 0 4px',
})) as typeof MuiTypography;

const FlexRow = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})) as typeof MuiBox;

const RankEmblemWrapper = styled(MuiBox)(() => ({
  backgroundColor: '#e3e0e0',
  borderRadius: '50%',
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 4px 0 0',
})) as typeof MuiBox;

const TierWinRateWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '0 0 0 4px',
})) as typeof MuiBox;

const TierTypo = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '500',
  color: '#000000',
})) as typeof MuiTypography;

const MatchPlayed = styled(MuiTypography)(() => ({
  fontSize: '12px',
  fontWeight: '500',
  color: '#000000',
})) as typeof MuiTypography;

const WinRate = styled(MuiTypography)(() => ({
  fontSize: '12px',
  fontWeight: '600',
  padding: '0 0 0 2px',
})) as typeof MuiTypography;

const ChampImgWrapper = styled(MuiBox)(() => ({
  borderRadius: '4px',
  '& > img': {
    borderRadius: '4px',
    objectFit: 'cover',
  },
})) as typeof MuiBox;

const MemberControlPanel = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '30px',
})) as typeof MuiBox;
