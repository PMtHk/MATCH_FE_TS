/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import MuiImageList from '@mui/material/ImageList';
import MuiToolTip, {
  TooltipProps,
  tooltipClasses,
} from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import NotInterestedIcon from '@mui/icons-material/NotInterested';

import { RootState } from 'store';
import { snackbarActions } from 'store/snackbar-slice';
import { refreshActions } from 'store/refresh-slice';
import Circular from 'components/loading/Circular';
import { kickMemberFromParty } from 'apis/api/common';
import { fetchMemberHistory } from 'apis/api/valorant';
import { isInParty } from 'functions/commons';
import { followUser, getEvaluationInfo } from 'apis/api/user';
import { positionList, tierList } from './data';

interface MemberSlotProps {
  agentName: string;
  oauth2Id: string;
}

const MemberSlot = ({
  agentName,
  oauth2Id: MemberOauth2Id,
}: MemberSlotProps) => {
  const dispatch = useDispatch();

  const { oauth2Id, games } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);

  const [memberInfo, setMemberInfo] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isFollowed, setIsFollowed] = React.useState<boolean>(false);

  // author info
  const tier = tierList[memberInfo?.tier];

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

  const calcAvgDmgInfo = (): calcedInfo => {
    const avgDmg = Math.ceil(memberInfo.avgDmg);
    let color = '#000';
    if (avgDmg >= 500) {
      color = 'red';
    } else if (avgDmg >= 300) {
      color = 'orange';
    } else {
      color = '#000';
    }
    return {
      value: avgDmg,
      color,
    };
  };

  const calcHeadShotInfo = (): calcedInfo => {
    const heads: number =
      memberInfo.heads === 0 || memberInfo.shots === 0
        ? 0
        : Number((memberInfo.shots / memberInfo.heads).toFixed(1));
    let color = '#000';
    if (heads >= 30) {
      color = 'red';
    } else if (heads >= 20) {
      color = 'orange';
    } else {
      color = '#000';
    }
    return {
      value: heads,
      color,
    };
  };

  // Tooltip
  const [tooltipText, setTooltipText] = useState<string>('');

  const calcMatchCount = (count: number) => {
    if (count < 10) return '10-';
    if (count < 100) return `${Math.floor(count / 10) * 10}+`;
    if (count < 1000) return `${Math.floor(count / 100) * 100}+`;
    return '1000+';
  };

  const calcLikePercentage = (likeCount: number, dislikeCount: number) => {
    return Math.round((likeCount / (likeCount + dislikeCount)) * 100);
  };

  useEffect(() => {
    const getTooltipData = async () => {
      if (MemberOauth2Id.includes('guest')) {
        setTooltipText('MatchGG를 이용하는 유저가 아닙니다.');
        return;
      }

      const { matchCount, likeCount, dislikeCount } = await getEvaluationInfo(
        MemberOauth2Id,
      );

      if (matchCount === 0) {
        setTooltipText('이전 매칭 기록이 없는 유저입니다.');
      } else {
        setTooltipText(
          `총 ${calcMatchCount(matchCount)} 번의 매칭에서 ${calcLikePercentage(
            likeCount,
            dislikeCount,
          )}%의 긍정적인 평가를 받은 유저입니다.`,
        );
      }
    };

    getTooltipData();
  }, []);

  // 아래 구문은 조금 더 찾아보고 수정할 수 있도록 하겠음. - 6/28 나주엽
  // eslint-disable-next-line no-unsafe-optional-chaining
  const totalPlayed = memberInfo?.wins + memberInfo?.losses;
  const winRate = Math.round((memberInfo.wins / totalPlayed) * 100) || 0;

  const isAuthor = oauth2Id === currentCard?.oauth2Id;

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedSummonerInfo = await fetchMemberHistory(
          agentName,
          currentCard.gameMode.toLowerCase(),
        );

        setMemberInfo(fetchedSummonerInfo);
        setIsLoading(false);
      } catch (error: any) {
        dispatch(
          snackbarActions.OPEN_SNACKBAR({
            message: `${agentName}님의 정보를 불러오는 중 문제가 발생했습니다.`,
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
        'valorant',
        currentCard?.id,
        currentCard?.chatRoomId,
        agentName,
      );

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: `${agentName} 님을 파티에서 제외시켰습니다.`,
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

  const handleFollow = async () => {
    try {
      await followUser(MemberOauth2Id);
      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: `${agentName} 님을 팔로우했습니다.`,
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
        setIsFollowed(true);
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
        <EvaluationTooltip title={tooltipText} followCursor>
          <Member>
            <SectionInMember>
              <SectionTitleInMember>요원명</SectionTitleInMember>
              <Nickname>{memberInfo?.name}</Nickname>
            </SectionInMember>
            <SectionInMember>
              <SectionTitleInMember>티어</SectionTitleInMember>
              <FlexRow>
                <img
                  src={tier?.imageUrl}
                  alt="rank"
                  width="36px"
                  height="36px"
                  loading="lazy"
                />
                <TierWinRateWrapper>
                  <TierTypo sx={{ color: tier?.color }}>{tier?.label}</TierTypo>
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
              <SectionTitleInMember>K/D</SectionTitleInMember>
              <InfoSection>
                {memberInfo.kills + memberInfo.deaths === 0 ? (
                  <InfoTypo sx={{ fontSize: '14px' }}>정보없음</InfoTypo>
                ) : (
                  <InfoTypo sx={{ color: calcKDInfo().color }}>
                    {calcKDInfo().value}
                  </InfoTypo>
                )}
              </InfoSection>
            </SectionInMember>
            <SectionInMember>
              <SectionTitleInMember>평균데미지</SectionTitleInMember>
              <InfoSection>
                <InfoTypo sx={{ color: calcAvgDmgInfo().color }}>
                  {calcAvgDmgInfo().value}
                </InfoTypo>
              </InfoSection>
            </SectionInMember>
            <SectionInMember>
              <SectionTitleInMember>헤드샷</SectionTitleInMember>
              <InfoSection>
                <InfoTypo sx={{ color: calcHeadShotInfo().color }}>
                  {calcHeadShotInfo().value}%
                </InfoTypo>
              </InfoSection>
            </SectionInMember>
            <SectionInMember>
              <SectionTitleInMember>모스트 요원</SectionTitleInMember>
              <MuiImageList sx={{ m: 0, p: 0 }} cols={3} gap={1}>
                {memberInfo &&
                  memberInfo.mostAgent?.map((aAgent: string, index: number) => (
                    <ChampImgWrapper key={`most_${index + 1}_aChampion`}>
                      <img
                        src={`https://cdn.match-gg.kr/valorant/agents/${aAgent}.png?w=48&h=48`}
                        alt={`most${index}_${aAgent}`}
                        loading="lazy"
                        width="48x"
                        height="48px"
                      />
                    </ChampImgWrapper>
                  ))}
              </MuiImageList>
            </SectionInMember>
            <MemberControlPanel>
              {isAuthor && currentCard?.name !== agentName && (
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
              {!isFollowed &&
                isInParty(currentCard.memberList, oauth2Id) &&
                oauth2Id !== MemberOauth2Id && (
                  <MuiToolTip title="팔로우" placement="right">
                    <IconButton onClick={handleFollow}>
                      <PersonAdd />
                    </IconButton>
                  </MuiToolTip>
                )}
            </MemberControlPanel>
          </Member>
        </EvaluationTooltip>
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
  width: '650px',
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
  lineHeight: '53px',
  textOverflow: 'ellipsis',
})) as typeof MuiTypography;

const FlexRow = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})) as typeof MuiBox;

const TierWinRateWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '0 0 0 4px',
  minHeight: '53px',
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

const InfoSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minWidth: '60px',
  minHeight: '53px',
})) as typeof MuiBox;

const InfoTypo = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '700',
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

const EvaluationTooltip = styled(({ className, ...props }: TooltipProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <MuiToolTip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
    backgroundColor: '#3d3939',
    color: 'white',
    fontWeight: '500',
    fontSize: '13px',
  },
});
