import {
  Box,
  Divider,
  ImageList,
  ImageListItem,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import Circular from 'components/loading/Circular';
import { positionList, tierList } from 'pages/leagueoflegends/data';

import Nickname from './Nickname';

const TierInfo = ({ info, type }: any) => {
  const tierData = tierList.find((tier) => tier.value === info.tier);

  return (
    <TierInfoContainer>
      <FlexRow>
        <InfoWrapper>
          <TierImgSection>
            <img
              src={tierData?.imageUrl}
              alt={tierData?.value}
              height="72"
              width="88px"
            />
          </TierImgSection>
          <TypoSection>
            <TypeTypo>{type}</TypeTypo>
            <FlexRowTypoSection>
              <RankTypo sx={{ color: tierData?.color }}>
                {info.rank !== 'UNRANKED'
                  ? `${tierData?.label}  ${info?.rank}`
                  : '언랭크드'}
              </RankTypo>
              {info?.rank !== 'UNRANKED' && (
                <LPTypo>{`${info.leaguePoints} LP`}</LPTypo>
              )}
            </FlexRowTypoSection>
            <FlexRowTypoSection>
              {info.rank !== 'UNRANKED' && (
                <>
                  <WinRateTypo>{`승률 ${(
                    (info.wins / (info.wins + info.losses)) *
                    100
                  ).toFixed(1)}%`}</WinRateTypo>
                  <WinLossesTypo>{`(${info.wins}승 ${info.losses}패)`}</WinLossesTypo>
                </>
              )}
            </FlexRowTypoSection>
          </TypoSection>
        </InfoWrapper>
      </FlexRow>
    </TierInfoContainer>
  );
};

const LolInfo = ({ data }: any) => {
  if (!data)
    return <Circular height="500px" text="게임 정보를 불러오는 중입니다." />;
  // 솔로랭크 , 자유랭크 정보
  const { duoRankInfo, freeRankInfo } = data;
  // 공통 정보
  const { summonerName } = data.duoRankInfo;
  const commonData = {
    mostLane: duoRankInfo.mostLane ? duoRankInfo.mostLane : '정보 없음',
    mostChampion: duoRankInfo.mostChampion
      ? duoRankInfo.mostChampion
      : '정보 없음',
  };

  const mostLaneData = positionList.find(
    (position) => position.value === commonData.mostLane,
  );
  return (
    <Container>
      {/* 닉네임 인증, 변경 영역 */}
      <Nickname name={summonerName} game="lol" />
      {/* 공통 영역 : 주 포지션, 모스트 챔피언 */}
      <CommonDataSection>
        <EachCommonSection>
          <CommonTitleTypo
            sx={{ fontSize: '14px', fontWeight: '700', color: 'gray' }}
          >
            주 포지션
          </CommonTitleTypo>
          {commonData.mostLane !== '정보 없음' && (
            <FlexRow
              sx={{
                alignItems: 'flex-end',
              }}
            >
              <img
                src={mostLaneData?.imageUrl}
                alt={mostLaneData?.value}
                height="52px"
              />
              <CommonSubTitleTypo>{mostLaneData?.label}</CommonSubTitleTypo>
            </FlexRow>
          )}
          {commonData.mostLane === '정보없음' && (
            <NoDataTypo>정보 없음...</NoDataTypo>
          )}
        </EachCommonSection>
        <EachCommonSection>
          <CommonTitleTypo>모스트 챔피언</CommonTitleTypo>
          {commonData.mostChampion !== '정보 없음' && (
            <ImageList cols={3} sx={{ margin: '0px', padding: '0px' }}>
              {commonData?.mostChampion.map((champion: string) => (
                <ImageListItem
                  key={champion}
                  sx={{ width: '52px', height: '52px' }}
                >
                  <img
                    src={
                      champion === 'poro'
                        ? 'https://d18ghgbbpc0qi2.cloudfront.net/lol/champions/poro.jpg'
                        : `http://ddragon.leagueoflegends.com/cdn/13.14.1/img/champion/${champion}.png`
                    }
                    alt={champion}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
          {commonData.mostChampion === '정보없음' && (
            <NoDataTypo>정보 없음...</NoDataTypo>
          )}
        </EachCommonSection>
      </CommonDataSection>
      <Divider sx={{ marginTop: '12px' }} />
      <FlexRow>
        {/* 솔로 / 듀오랭크 정보 */}
        <TierInfo info={duoRankInfo} type="솔로 / 듀오 랭크" />
        {/* 듀오랭크 정보 */}
        <TierInfo info={freeRankInfo} type="자유 랭크" />
      </FlexRow>
    </Container>
  );
};

export default LolInfo;

const Container = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '360px',
})) as typeof Box;

const CommonDataSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  marginTop: '12px',
})) as typeof Box;

const CommonTitleTypo = styled(Typography)(() => ({
  fontSize: '14px',
  fontWeight: '700',
  color: 'gray',
})) as typeof Typography;

const CommonSubTitleTypo = styled(CommonTitleTypo)(() => ({
  color: 'black',
}));

const FlexRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
})) as typeof Box;

const FlexRowTypoSection = styled(FlexRow)(() => ({
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
})) as typeof Box;

const TierInfoContainer = styled(Box)(() => ({
  borderRadius: '4px',
  minHeight: '116px',
  display: 'flex',
  margin: '4px',
  maxWidth: '270px',
})) as typeof Box;

const InfoWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '260px',
})) as typeof Box;

const TierImgSection = styled(Box)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100px',
})) as typeof Box;

const TypoSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '12px',
})) as typeof Box;

const TypeTypo = styled(Typography)(() => ({
  color: '#808080',
  fontSize: '12px',
})) as typeof Typography;

const RankTypo = styled(Typography)(() => ({
  fontWeight: '640',
})) as typeof Typography;

const LPTypo = styled(Typography)(() => ({
  fontSize: '14px',
  marginLeft: '2px',
})) as typeof Typography;

const WinRateTypo = styled(Typography)(() => ({
  color: '#808080',
  fontSize: '14px',
  fontWeight: '620',
})) as typeof Typography;

const WinLossesTypo = styled(Typography)(() => ({
  color: '#808080',
  fontSize: '12px',
})) as typeof Typography;

const EachCommonSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  width: '260px',
  marginLeft: '12px',
})) as typeof Box;

const NoDataTypo = styled(Typography)(() => ({
  fontSize: '14px',
  fontWeight: 'bold',
})) as typeof Typography;
