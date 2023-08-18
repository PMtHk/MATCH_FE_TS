import React from 'react';
import { Box, Typography } from '@mui/material';
import Circular from 'components/loading/Circular';
import { styled } from '@mui/system';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { rankImage, tierList } from 'pages/battlegrounds/data';

import Nickname from './Nickname';

const Info = ({ data }: any) => {
  const getTypeLabel = () => {
    switch (data.type) {
      case 'DUO':
        return '듀오';
      case 'SQUAD':
        return '스쿼드';
      default:
        return '경쟁전(스쿼드)';
    }
  };

  const calcKD = () => {
    let kd = 0;
    if (data.kills === 0) kd = 0;
    else if (data.deaths === 0) kd = 100;
    else kd = Number((data.kills / data.deaths).toFixed(1));

    let color = '#000';
    if (kd >= 4) {
      color = 'red';
    } else if (kd >= 2.5) {
      color = 'orange';
    } else {
      color = '#000';
    }
    return {
      kd,
      color,
    };
  };

  const calcAvgDmg = () => {
    const avgDmg = Math.ceil(data.avgDmg);

    let color = '#000';
    if (avgDmg >= 500) {
      color = 'red';
    } else if (avgDmg >= 300) {
      color = 'orange';
    } else {
      color = '#000';
    }

    return {
      avgDmg,
      color,
    };
  };

  const getRank = () => {
    const str =
      data.tier === 'Master'
        ? 'MASTER'
        : data.tier.toUpperCase() + data.subTier;
    const imageUrl = rankImage[str];
    const value = str;
    const rankInfo = {
      imageUrl,
      value,
    };
    return rankInfo;
  };

  const calcTierColor = () => {
    const targetTier = tierList.find(
      (tier) => tier.value === data.tier.toUpperCase(),
    );
    return targetTier?.darkColor;
  };

  return (
    <InfoContainer>
      <EachInfo sx={{ minWidth: '90px' }}>
        <TitleTypo>타입</TitleTypo>
        <SubTitleTypo>{getTypeLabel()}</SubTitleTypo>
      </EachInfo>
      {data.totalPlayed !== 0 && (
        <>
          <EachInfo>
            <TitleTypo>K/D</TitleTypo>
            <SubTitleTypo sx={{ color: calcKD().color }}>
              {calcKD().kd}
            </SubTitleTypo>
          </EachInfo>
          <EachInfo>
            <TitleTypo>평균 데미지</TitleTypo>
            <SubTitleTypo sx={{ color: calcAvgDmg().color }}>
              {calcAvgDmg().avgDmg}
            </SubTitleTypo>
          </EachInfo>
          <EachInfo>
            <TitleTypo>Top 1</TitleTypo>
            <SubTitleTypo>
              {data.wins === 0
                ? 0
                : `${((data.wins / data.totalPlayed) * 100).toFixed(1)}%`}
            </SubTitleTypo>
          </EachInfo>
          <EachInfo>
            <TitleTypo>Top 10</TitleTypo>
            <SubTitleTypo>
              {data.top10 === 0
                ? 0
                : `${((data.top10 / data.totalPlayed) * 100).toFixed(1)}%`}
            </SubTitleTypo>
          </EachInfo>
        </>
      )}
      {data.totalPlayed === 0 && (
        <>
          <InfoOutlinedIcon
            sx={{ color: 'gray', fontSize: '18px', marginRight: '8px' }}
          />
          <TitleTypo>{`아직 ${getTypeLabel()} 경기에 대한 정보가 없습니다.`}</TitleTypo>
        </>
      )}
      {data.type === 'RANKED_SQUAD' && data.totalPlayed !== 0 && (
        <EachInfo>
          <TitleTypo>랭크</TitleTypo>
          <FlexRow sx={{ alignItems: 'flex-end' }}>
            <img
              alt={getRank().value}
              src={getRank().imageUrl}
              width="28px"
              height="28px"
            />
            <SubTitleTypo sx={{ color: calcTierColor(), marginLeft: '4px' }}>
              {getRank().value}
            </SubTitleTypo>
          </FlexRow>
        </EachInfo>
      )}
    </InfoContainer>
  );
};

const PubgInfo = ({ data }: any) => {
  if (!data)
    return <Circular height="500px" text="게임 정보를 불러오는 중입니다." />;
  const { duoInfo, squadInfo, rankedSquadInfo } = data;
  return (
    <Container>
      {/* 닉네임 인증, 변경 영역 */}
      <Nickname name={data.duoInfo.name} game="pubg" />
      {/* 듀오 정보 */}
      <Info data={duoInfo} />
      {/* 스쿼드 정보 */}
      <Info data={squadInfo} />
      {/* 랭크-스쿼드 정보 */}
      <Info data={rankedSquadInfo} />
    </Container>
  );
};

export default PubgInfo;

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '360px',
})) as typeof Box;

const TitleTypo = styled(Typography)(() => ({
  fontSize: '14px',
  fontWeight: '700',
  color: 'gray',
  whiteSpace: 'nowrap',
})) as typeof Typography;

const SubTitleTypo = styled(TitleTypo)(() => ({
  color: 'black',
  whiteSpace: 'nowrap',
  marginTop: '4px',
}));

const FlexRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
})) as typeof Box;

const FlexCol = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
})) as typeof Box;

const EachInfo = styled(FlexCol)(() => ({
  justifyContent: 'flex-start',
  marginRight: '32px',
}));

const InfoContainer = styled(Box)(() => ({
  maxHeight: '80px',
  height: '80px',
  marginBottom: '12px',
  marginRight: '12px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})) as typeof Box;
