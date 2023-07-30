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

  const [memberInfo, setMemberInfo] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // author info
  const mostHero = ['genji', 'reinhardt', 'soldier76'];

  // 아래 구문은 조금 더 찾아보고 수정할 수 있도록 하겠음. 6/28 나주엽
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalPlayed = memberInfo?.wins + memberInfo?.losses;
  // const winRate = Math.round((memberInfo.wins / totalPlayed) * 100);
  const winRate = '58';

  const isAuthor = oauth2Id === currentCard?.author?.oauth2Id;

  useEffect(() => {
    const fetchSummonerInfo = async () => {
      await defaultAxios
        .get(
          `/api/overwatch/player/${name}/${currentCard.position}/${currentCard.type}`,
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
            <Nickname>Carpe</Nickname>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>승률</SectionTitleInMember>
            <WinRateSection>
              <WinRate
                component="span"
                // sx={{ color: winRate >= 50 ? '#d31f45' : '#5383e8' }}
              >
                {winRate}%
              </WinRate>
              <MatchPlayed>18승 / 9패</MatchPlayed>
            </WinRateSection>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>K/D</SectionTitleInMember>
            <WinRateSection>
              <KDTypo
              // sx={{
              //   color:
              //     item.author.kills / item.author.deaths > 2.5
              //       ? 'orange'
              //       : 'black',
              // }}
              >
                2.5
              </KDTypo>
              <KillsAndDeaths>154 / 78</KillsAndDeaths>
            </WinRateSection>
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
                    src={tierList[8]?.imageUrl}
                    alt={tierList[8]?.value}
                    width="36px"
                    height="36px"
                  />
                </RankEmblemWrapper>
                <Tier sx={{ color: tierList[8]?.color }}>
                  {tierList[8]?.acronym}
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
                    src={tierList[1]?.imageUrl}
                    alt={tierList[1]?.value}
                    width="36px"
                    height="36px"
                  />
                </RankEmblemWrapper>
                <Tier sx={{ color: tierList[1]?.color }}>
                  {tierList[1]?.acronym}
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
                    src={tierList[6]?.imageUrl}
                    alt={tierList[6]?.value}
                    width="36px"
                    height="36px"
                  />
                </RankEmblemWrapper>
                <Tier sx={{ color: tierList[6]?.color }}>
                  {tierList[6]?.acronym}4
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
              {mostHero.map((aHero, index) => {
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
                      src={`https://d18ghgbbpc0qi2.cloudfront.net/overwatch/heroes/${aHero}.png`}
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
  fontSize: '16px',
  fontWeight: '700',
  minWidth: '120px',
  lineHeight: '54px',
  textOverflow: 'ellipsis',
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
  fontSize: '8px',
  fontWeight: '600',
  textAlign: 'center',
})) as typeof MuiTypography;

const WinRateSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minWidth: '70px',
  minHeight: '54px',
})) as typeof MuiBox;

const WinRate = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '700',
})) as typeof MuiTypography;

const MatchPlayed = styled(MuiTypography)(() => ({
  fontSize: '8px',
  fontWeight: '500',
  color: '#000000',
})) as typeof MuiTypography;

const KDTypo = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '700',
})) as typeof MuiTypography;

const KillsAndDeaths = styled(MuiTypography)(() => ({
  fontSize: '8px',
  fontWeight: '500',
})) as typeof MuiTypography;

const MemberControlPanel = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '30px',
})) as typeof MuiBox;
