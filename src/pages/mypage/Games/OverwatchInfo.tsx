import React from 'react';
import { Box, ImageList, ImageListItem, Typography } from '@mui/material';
import Circular from 'components/loading/Circular';
import { styled } from '@mui/system';
import MuiDivider from '@mui/material/Divider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { positionList, tierList } from 'pages/overwatch/data';
import Nickname from './Nickname';

const Info = ({ data }: any) => {
  const getTypeLabel = () => {
    if (data.type === 'RANKED') return '경쟁전';
    return '일반 게임';
  };

  const calcKD = () => {
    let kd = 0;
    if (data.kills === 0) kd = 0;
    else if (data.deaths === 0) kd = 100;
    else kd = Number((data.kills / data.deaths).toFixed(2));

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

  const calcWinRate = () => {
    let winRate = 0;
    if (data.wins === 0) winRate = 0;
    else if (data.losses === 0) winRate = 100;
    else winRate = Math.round((data.wins / (data.wins + data.losses)) * 100);

    let color = '#5383e8';
    if (winRate >= 50) color = '#d31f45';

    return {
      winRate,
      color,
    };
  };

  const tank =
    data.tank_tier === 'none' ? 'UNRANKED' : data.tank_tier.toUpperCase();
  const damage =
    data.damage_tier === 'none' ? 'UNRANKED' : data.damage_tier.toUpperCase();
  const support =
    data.support_tier === 'none' ? 'UNRANKED' : data.support_tier.toUpperCase();

  const tankTier = tierList.find((aTier) => aTier.value === tank);
  const damageTier = tierList.find((aTier) => aTier.value === damage);
  const supportTier = tierList.find((aTier) => aTier.value === support);

  if (data.wins === 0 && data.losses === 0) {
    return (
      <>
        <InfoOutlinedIcon
          sx={{ color: 'gray', fontSize: '18px', marginRight: '8px' }}
        />
        <TitleTypo>{`아직 ${getTypeLabel()} 경기에 대한 정보가 없습니다.`}</TitleTypo>
      </>
    );
  }
  return (
    <InfoContainer>
      <EachInfo sx={{ minWidth: '80px' }}>
        <TitleTypo>타입</TitleTypo>
        <SubTitleTypo>{getTypeLabel()}</SubTitleTypo>
      </EachInfo>
      <EachInfo>
        <TitleTypo>K/D</TitleTypo>
        <SubTitleTypo sx={{ color: calcKD().color }}>
          {calcKD().kd}
        </SubTitleTypo>
      </EachInfo>
      <EachInfo>
        <TitleTypo>승률</TitleTypo>
        <SubTitleTypo sx={{ color: calcWinRate().color }}>
          {`${calcWinRate().winRate} %`}
        </SubTitleTypo>
      </EachInfo>
      <EachInfo>
        <TitleTypo>모스트 영웅</TitleTypo>
        <ImageList cols={3} sx={{ margin: '0px', padding: '0px' }}>
          {data?.mostHero.map((hero: string) => (
            <ImageListItem
              key={hero}
              sx={{
                width: '48px',
                height: '48px',
                border: '2px solid gray',
                borderRadius: '4px',
              }}
            >
              <img
                src={`https://d18ghgbbpc0qi2.cloudfront.net/overwatch/heroes/${hero.toLowerCase()}.png`}
                alt={hero}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </EachInfo>
      <EachInfo>
        <TitleTypo>티어</TitleTypo>
        <SectionContent>
          <PositionRankSection>
            <PositionEmblemWrapper>
              <img
                src={positionList[1].imageUrl}
                alt={positionList[1]?.value}
                width="12px"
                height="12px"
              />
            </PositionEmblemWrapper>
            <RankWrapper>
              <img
                src={tankTier?.imageUrl}
                alt={tankTier?.value}
                width={
                  tankTier?.value === 'GRANDMASTER' ||
                  tankTier?.value === 'MASTER'
                    ? '42px'
                    : '50px'
                }
                height={
                  tankTier?.value === 'GRANDMASTER' ||
                  tankTier?.value === 'MASTER'
                    ? '42px'
                    : '50px'
                }
              />
            </RankWrapper>
            <TierTypo sx={{ color: tankTier?.color }}>
              {tankTier?.acronym}
              {data.tank_rank === 'none' ? '' : data.tank_rank}
            </TierTypo>
          </PositionRankSection>
          <MuiDivider orientation="vertical" flexItem />
          <PositionRankSection>
            <PositionEmblemWrapper>
              <img
                src={positionList[2].imageUrl}
                alt={positionList[2]?.value}
                width="12px"
                height="12px"
              />
            </PositionEmblemWrapper>
            <RankWrapper>
              <img
                src={damageTier?.imageUrl}
                alt={damageTier?.value}
                width={
                  damageTier?.value === 'GRANDMASTER' ||
                  damageTier?.value === 'MASTER'
                    ? '42px'
                    : '50px'
                }
                height={
                  damageTier?.value === 'GRANDMASTER' ||
                  damageTier?.value === 'MASTER'
                    ? '42px'
                    : '50px'
                }
              />
            </RankWrapper>
            <TierTypo sx={{ color: damageTier?.color }}>
              {damageTier?.acronym}
              {data.damage_rank === 'none' ? '' : data.damage_rank}
            </TierTypo>
          </PositionRankSection>
          <MuiDivider orientation="vertical" flexItem />
          <PositionRankSection>
            <PositionEmblemWrapper>
              <img
                src={positionList[3].imageUrl}
                alt={positionList[3]?.value}
                width="12px"
                height="12px"
              />
            </PositionEmblemWrapper>
            <RankWrapper>
              <img
                src={supportTier?.imageUrl}
                alt={supportTier?.value}
                width={
                  supportTier?.value === 'GRANDMASTER' ||
                  supportTier?.value === 'MASTER'
                    ? '42px'
                    : '50px'
                }
                height={
                  supportTier?.value === 'GRANDMASTER' ||
                  supportTier?.value === 'MASTER'
                    ? '42px'
                    : '50px'
                }
              />
            </RankWrapper>
            <TierTypo sx={{ color: supportTier?.color }}>
              {supportTier?.acronym}
              {data.support_rank === 'none' ? '' : data.support_rank}
            </TierTypo>
          </PositionRankSection>
        </SectionContent>
      </EachInfo>
    </InfoContainer>
  );
};

const OverwatchInfo = ({ data }: any) => {
  if (!data)
    return <Circular height="500px" text="게임 정보를 불러오는 중입니다." />;
  const { rankInfo, normalInfo } = data;
  return (
    <Container>
      {/* 닉네임 인증, 변경 영역 */}
      <Nickname name={data.rankInfo.name} game="overwatch" />
      {/* 랭크 정보 */}
      <Info data={rankInfo} />
      {/* 일반 정보 */}
      <Info data={normalInfo} />
    </Container>
  );
};

export default OverwatchInfo;

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '360px',
})) as typeof Box;

const TitleTypo = styled(Typography)(() => ({
  fontSize: '16px',
  fontWeight: '700',
  color: 'gray',
  whiteSpace: 'nowrap',
})) as typeof Typography;

const SubTitleTypo = styled(TitleTypo)(() => ({
  color: 'black',
  whiteSpace: 'nowrap',
  marginTop: '12px',
}));

const FlexCol = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
})) as typeof Box;

const EachInfo = styled(FlexCol)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  marginRight: '24px',
  minHeight: '92px',
}));

const SectionContent = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '4px',
})) as typeof Box;

const PositionRankSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})) as typeof Box;

const RankWrapper = styled(Box)(() => ({
  width: '40px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
})) as typeof Box;

const PositionEmblemWrapper = styled(Box)(() => ({
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof Box;

const TierTypo = styled(Box)(() => ({
  width: '100%',
  fontSize: '12px',
  fontWeight: '600',
  textAlign: 'center',
})) as typeof Box;

const InfoContainer = styled(Box)(() => ({
  maxHeight: '120px',
  height: '120px',
  marginBottom: '12px',
  marginRight: '12px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})) as typeof Box;
