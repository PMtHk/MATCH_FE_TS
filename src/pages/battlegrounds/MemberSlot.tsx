import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { defaultAxios } from 'apis/utils';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiIconButton from '@mui/material/IconButton';
import MuiImageList from '@mui/material/ImageList';
import MuiToolTip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import NotInterestedIcon from '@mui/icons-material/NotInterested';

import Close from '@mui/icons-material/Close';

import { RootState } from 'store';

import Circular from 'components/loading/Circular';
import { snackbarActions } from 'store/snackbar-slice';
import { refreshActions } from 'store/refresh-slice';
import { kickMemberFromParty } from 'apis/api/common';
import { isInParty } from 'functions/commons';
import { platformList, tierList, rankImage } from './data';

interface MemberSlotProps {
  name: string;
  oauth2Id: string;
}

const MemberSlot = ({ name, oauth2Id: MemberOauth2Id }: MemberSlotProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { oauth2Id } = useSelector((state: RootState) => state.user);
  const { currentCard } = useSelector((state: RootState) => state.card);

  const [memberInfo, setMemberInfo] = React.useState<any>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // author info
  const authorTier = tierList.find((aTier) => aTier.value === memberInfo.tier);

  const isAuthor = oauth2Id === currentCard?.oauth2Id;

  type TierInfo = {
    imageUrl: string;
    value: string;
  };

  const getRank = (): TierInfo => {
    const str: string =
      memberInfo.tier === 'Master'
        ? 'MASTER'
        : memberInfo.tier.toUpperCase() + memberInfo.subTier;
    const imageUrl = rankImage[str];
    const value = str;
    const rankInfo: TierInfo = {
      imageUrl,
      value,
    };
    return rankInfo;
  };

  type calcedInfo = {
    value: number;
    color: string;
  };

  const calcKDInfo = (): calcedInfo => {
    const kd: number =
      memberInfo.kills === 0 || memberInfo.deaths === 0
        ? 0
        : Number((memberInfo.kills / memberInfo.deaths).toFixed(1));
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

  const calcTop1Info = (): string => {
    const { totalPlayed, wins } = memberInfo;
    if (totalPlayed === 0 || wins === 0) {
      return '0';
    }
    return ((wins / totalPlayed) * 100).toFixed(1);
  };

  const calcTop10Info = (): string => {
    const { totalPlayed, top10 } = memberInfo;
    if (totalPlayed === 0 || top10 === 0) {
      return '0';
    }
    return ((top10 / totalPlayed) * 100).toFixed(1);
  };

  useEffect(() => {
    const fetchPubgPlayerInfo = async () => {
      await defaultAxios
        .get(
          `/api/pubg/player/${name}/${currentCard.platform}/${currentCard.type}`,
        )
        .then((res) => {
          setMemberInfo(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          snackbarActions.OPEN_SNACKBAR({
            message:
              '플레이어 정보를 확인하는 중 문제가 발생했습니다. 새로고침 후 다시 시도해주세요.',
            severity: 'error',
          });
          setIsLoading(false);
        });
    };

    fetchPubgPlayerInfo();
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
        'pubg',
        currentCard?.id,
        currentCard?.chatRoomId,
        name,
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
            <Nickname>{memberInfo?.name}</Nickname>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>RP</SectionTitleInMember>
            <MemberInfoBox>
              {memberInfo.type !== 'RANKED_SQUAD' ||
              (memberInfo.type === 'RANKED_SQUAD' &&
                memberInfo.currentRankPoint === 0) ? (
                <span style={{ color: 'gray' }}>정보 없음</span>
              ) : (
                <>
                  <RankEmblemWrapper>
                    <img
                      src={getRank().imageUrl}
                      alt={getRank().value}
                      width="24px"
                      height="24px"
                    />
                  </RankEmblemWrapper>
                  <SectionContentText
                    sx={{ color: authorTier?.darkColor, paddingTop: '4px' }}
                  >
                    {getRank().value}
                  </SectionContentText>
                </>
              )}
            </MemberInfoBox>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>K/D</SectionTitleInMember>
            <MemberInfoTypo sx={{ color: calcKDInfo().color }}>
              {calcKDInfo().value}
            </MemberInfoTypo>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>평균 데미지</SectionTitleInMember>
            <MemberInfoTypo sx={{ color: calcAvgDmgInfo().color }}>
              {calcAvgDmgInfo().value}
            </MemberInfoTypo>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>Top 1</SectionTitleInMember>
            <MemberInfoTypo>{`${calcTop1Info()}%`}</MemberInfoTypo>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>Top 10</SectionTitleInMember>
            <MemberInfoTypo>{`${calcTop10Info()}%`}</MemberInfoTypo>
          </SectionInMember>
          <MemberControlPanel>
            {isAuthor && currentCard?.name !== name && (
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
                  <IconButton>
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

const FlexRow = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})) as typeof MuiBox;

const MemberControlPanel = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '30px',
})) as typeof MuiBox;

const MemberInfoTypo = styled(MuiTypography)(() => ({
  display: 'flex',
  fontWeight: ' bold',
}));

const MemberInfoBox = styled(MuiBox)(() => ({
  display: 'flex',
  fontWeight: ' bold',
}));

const RankEmblemWrapper = styled(MuiBox)(() => ({
  backgroundColor: '#eeeeee',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '4px',
})) as typeof MuiBox;

const SectionContentText = styled(MuiTypography)(() => ({
  display: 'flex',
  fontSize: '12px',
  fontWeight: '600',
  color: '#000000',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})) as typeof MuiTypography;

const IconButton = styled(MuiIconButton)(() => ({
  '& .MuiIconButton-root': {
    padding: '0',
  },
}));
