/* eslint-disable no-restricted-globals */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import MuiImageList from '@mui/material/ImageList';
import MuiToolTip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import NotInterestedIcon from '@mui/icons-material/NotInterested';

import { RootState } from 'store';
import { snackbarActions } from 'store/snackbar-slice';
import { refreshActions } from 'store/refresh-slice';
import Circular from 'components/loading/Circular';
import { kickMemberFromParty } from 'apis/api/common';
import { fetchMemberHistory } from 'apis/api/leagueoflegends';
import { isInParty } from 'functions/commons';
import { followUser } from 'apis/api/user';
import { positionList, tierList } from './data';

interface MemberSlotProps {
  summonerName: string;
  oauth2Id: string;
}

const MemberSlot = ({
  summonerName,
  oauth2Id: MemberOauth2Id,
}: MemberSlotProps) => {
  const dispatch = useDispatch();

  const { oauth2Id, games } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);

  const [memberInfo, setMemberInfo] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // author info
  const mostLane = positionList.find(
    (aPosition) => aPosition.value === memberInfo?.mostLane,
  );

  const tier = tierList.find((aTier) => aTier.value === memberInfo?.tier);

  // 아래 구문은 조금 더 찾아보고 수정할 수 있도록 하겠음. - 6/28 나주엽
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalPlayed = memberInfo?.wins + memberInfo?.losses;
  const winRate = Math.round((memberInfo.wins / totalPlayed) * 100);

  const isAuthor = oauth2Id === currentCard?.oauth2Id;

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
    const getData = async () => {
      try {
        const fetchedSummonerInfo = await fetchMemberHistory(
          summonerName,
          currentCard.type === 'FREE_RANK' ? 'free_rank' : 'duo_rank',
        );

        setMemberInfo(fetchedSummonerInfo);
        setIsLoading(false);
      } catch (error: any) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: `${summonerName}님의 정보를 불러오는 중 문제가 발생했습니다.`,
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
        'lol',
        currentCard?.id,
        currentCard?.chatRoomId,
        summonerName,
      );

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: `${summonerName} 님을 파티에서 제외시켰습니다.`,
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

  const unranked =
    memberInfo?.tier === 'UNRANKED' && memberInfo?.rank === 'UNRANKED';

  const handleFollow = async () => {
    try {
      await followUser(MemberOauth2Id);
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: `${summonerName} 님을 팔로우했습니다.`,
          severity: 'success',
        }),
      );
    } catch (error: any) {
      if (
        error.response.status === 400 &&
        error.response.data.message === '이미 팔로우 하는 사용자입니다.'
      ) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: error.response.data.message,
            severity: 'error',
          }),
        );
      } else {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message:
              '알 수 없는 오류로 작업을 수행할 수 없습니다. 잠시 후 다시 시도해주세요.',
            severity: 'error',
          }),
        );
      }
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
            <SectionTitleInMember>소환사명</SectionTitleInMember>
            <Nickname>{memberInfo?.summonerName}</Nickname>
            <MostLaneInfo>
              {mostLane ? (
                <>
                  <img
                    src={mostLane?.imageUrl}
                    alt="lane_icon"
                    loading="lazy"
                    width="20px"
                    height="20px"
                  />
                  <MostLanteTypo>{mostLane?.label}</MostLanteTypo>
                </>
              ) : (
                <MuiToolTip
                  title="플레이 수가 부족하여 포지션 정보를 불러올 수 없습니다."
                  placement="bottom-start"
                >
                  <MostLanteTypo>포지션: -</MostLanteTypo>
                </MuiToolTip>
              )}
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
                {!unranked ? (
                  <TierTypo sx={{ color: tier?.color }}>
                    {tier?.acronym}
                    {rankRomanToNum(memberInfo.rank)}-{memberInfo?.leaguePoints}
                    LP
                  </TierTypo>
                ) : (
                  <TierTypo>Unranked</TierTypo>
                )}
                {!unranked && (
                  <MatchPlayed>
                    {memberInfo?.wins}승 {memberInfo?.losses}패
                    <WinRate
                      component="span"
                      sx={{ color: winRate >= 50 ? '#d31f45' : '#5383e8' }}
                    >
                      ({winRate}%)
                    </WinRate>
                  </MatchPlayed>
                )}
              </TierWinRateWrapper>
            </FlexRow>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>모스트 챔피언</SectionTitleInMember>
            <MuiImageList sx={{ m: 0, p: 0 }} cols={3} gap={1}>
              {memberInfo &&
                memberInfo.mostChampion?.map(
                  (aChampion: string, index: number) => (
                    <ChampImgWrapper key={`most_${index + 1}_aChampion`}>
                      <img
                        src={
                          aChampion === 'poro'
                            ? 'https://d18ghgbbpc0qi2.cloudfront.net/lol/champions/poro.jpg'
                            : `http://ddragon.leagueoflegends.com/cdn/13.14.1/img/champion/${aChampion}.png`
                        }
                        alt={`most${index}_${aChampion}`}
                        loading="lazy"
                        width="50px"
                        height="50px"
                      />
                    </ChampImgWrapper>
                  ),
                )}
            </MuiImageList>
          </SectionInMember>
          <MemberControlPanel>
            {isAuthor && currentCard?.name !== summonerName && (
              <MuiToolTip title="강제퇴장" placement="right">
                <IconButton
                  onClick={handleKickBtn}
                  disabled={
                    currentCard.expired === true ||
                    currentCard.finished === true
                  }
                >
                  <NotInterestedIcon />
                </IconButton>
              </MuiToolTip>
            )}
            {isInParty(currentCard.memberList, oauth2Id) &&
              oauth2Id !== MemberOauth2Id && (
                <MuiToolTip title="팔로우" placement="right">
                  <IconButton onClick={handleFollow}>
                    <PersonAdd />
                  </IconButton>
                </MuiToolTip>
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
  width: '20px',
})) as typeof MuiBox;

const IconButton = styled(MuiIconButton)(() => ({
  '& .MuiIconButton-root': {
    padding: '0',
  },
}));
