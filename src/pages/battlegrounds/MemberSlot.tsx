import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
import { snackbarActions } from 'store/snackbar-slice';
import { kickMemberFromParty } from 'apis/api/common';
import { platformList, tierList, rankImage } from './data';

interface MemberSlotProps {
  name: string;
}

const MemberSlot = ({ name }: MemberSlotProps) => {
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
    const str: string = memberInfo.tier.toUpperCase() + memberInfo.subTier;
    const imageUrl = rankImage[str];
    const value = str;
    return {
      imageUrl,
      value,
    };
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
          console.log(error);
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
        currentCard?.id,
        currentCard?.chatRoomId,
        name,
        'pubg',
      );

      dispatch(
        snackbarActions.OPEN_SNACKBAR({
          message: `${name} 님을 파티에서 제외시켰습니다.`,
          severity: 'success',
        }),
      );

      window.location.reload();
    } catch (error: any) {
      console.log(error);
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
                '정보 없음'
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
                  <SectionContentText sx={{ color: authorTier?.darkColor }}>
                    {getRank().value}
                  </SectionContentText>
                </>
              )}
            </MemberInfoBox>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>K/D</SectionTitleInMember>
            <MemberInfoTypo>
              {memberInfo.kills === 0 || memberInfo.deaths === 0
                ? 0
                : (memberInfo.kills / memberInfo.deaths).toFixed(1)}
            </MemberInfoTypo>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>평균 데미지</SectionTitleInMember>
            <MemberInfoTypo>
              {Math.ceil(memberInfo.avgDmg) === 0
                ? 0
                : Math.ceil(memberInfo.avgDmg)}
            </MemberInfoTypo>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>Top 1</SectionTitleInMember>
            <MemberInfoTypo>{memberInfo.wins}</MemberInfoTypo>
          </SectionInMember>
          <SectionInMember>
            <SectionTitleInMember>Top 10</SectionTitleInMember>
            <MemberInfoTypo>{memberInfo.top10}</MemberInfoTypo>
          </SectionInMember>
          <MemberControlPanel>
            {isAuthor && currentCard?.name !== name && (
              <MuiIconButton onClick={handleKickBtn}>
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
})) as typeof MuiBox;

const SectionContentText = styled(MuiTypography)(() => ({
  display: 'flex',
  fontSize: '12px',
  fontWeight: '600',
  color: '#000000',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})) as typeof MuiTypography;
