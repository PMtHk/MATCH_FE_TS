import React from 'react';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import MuiToolTip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import MicIcon from '@mui/icons-material/Mic';

import CardContainer from 'components/CardContainer';
import Timer from 'components/CountDownTimer';
import { EXPIRE_TIME } from 'types/commons';
import { VALORANT_POSITIONS_ID } from 'types/games';
import { positionList, queueTypeList, tierList } from './data';

interface CardProps {
  item: {
    id: number;
    oauth2Id: string;
    name: string;
    gameMode: string;
    tier: string;
    position: VALORANT_POSITIONS_ID;
    voice: 'Y' | 'N';
    content: string;
    expire: EXPIRE_TIME;
    expired: string;
    created: string;
    finished: string;
    author: {
      puuid: string;
      name: string;
      tier: number;
      wins: number;
      losses: number;
      kills: number;
      deaths: number;
      avgDmg: number;
      heads: number;
      totalShot: number;
      mostAgent: string[];
    };
    chatRoomId: string;
    memberList: [];
    banList: [];
  };
  expired: boolean;
}

const Card = ({ item, expired }: CardProps) => {
  const [isHover, setIsHover] = React.useState<boolean>(false);

  const position = positionList.find(
    (aPosition) => aPosition.value === item.position,
  );

  const tier = tierList.find((aTier) => aTier.value === item.tier);

  const queueType = queueTypeList.find(
    (aQueueType) => aQueueType.value === item.gameMode,
  );

  // author info
  const authorTier = tierList[item.author.tier];

  const totalPlayed = item.author.wins + item.author.losses;
  const winRate = Math.round((item.author.wins / totalPlayed) * 100);

  const maxMember = queueType?.maxMember || 5;
  const currentMember = item.memberList.length;

  const arrayForMemberStatus = new Array(maxMember)
    .fill(0)
    .map((value, i) => `member_${i}`);

  type calcedInfo = {
    value: number;
    color: string;
  };

  const calcKDInfo = (): calcedInfo => {
    const kd: number =
      item.author.kills === 0 || item.author.deaths === 0
        ? 0
        : Number((item.author.kills / item.author.deaths).toFixed(2));
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
    const avgDmg = Math.ceil(item.author.avgDmg);
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

  return (
    <div
      onMouseOver={() => {
        setIsHover(true);
      }}
      onFocus={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => setIsHover(false)}
    >
      <CardContainer expired={expired}>
        <CardTitleWrapper>
          <ImgWrapper sx={{ mr: 1 }}>
            <img
              src={queueType?.imageUrl || ''}
              alt="queueType_to_find"
              loading="lazy"
              height="36px"
              width="36px"
            />
          </ImgWrapper>
          <CardTitle>
            <TopInfo>
              <TopInfoTypo>#{queueType?.label || '모든큐'}</TopInfoTypo>
              <TopInfoTypo color={tier?.color || '#000000'}>
                #{tier?.label || '모든티어'}
              </TopInfoTypo>
            </TopInfo>
            <Description>{` ${item.content}`}</Description>
          </CardTitle>
        </CardTitleWrapper>
        {/* ------------------------------------------------------ */}
        <CardCenterWrapper>
          {isHover && (
            <GuideWrapper>
              <GuideTypo>클릭해서 상세보기</GuideTypo>
            </GuideWrapper>
          )}
          {!isHover && (
            <RecruitStatusWrapper>
              <MemberInfo>
                <RecruitStatusTypo>모집 현황</RecruitStatusTypo>
                {arrayForMemberStatus.map((value, index) => {
                  return (
                    <Check
                      key={value}
                      sx={{
                        color:
                          index < currentMember
                            ? 'primary.contrastText'
                            : '#d9d9d9',
                        backgroundColor:
                          index < currentMember ? 'primary.light' : '#d9d9d9',
                      }}
                    />
                  );
                })}
              </MemberInfo>
              <TimerWrapper>
                {!expired && (
                  <Timer expire={item.expire} created={item.created} />
                )}
              </TimerWrapper>
            </RecruitStatusWrapper>
          )}
        </CardCenterWrapper>
        {/* ------------------------------------------------------ */}
        <MuiDivider sx={{ my: 1 }} />
        <AuthorInfoWrapper>
          <AuthorSection>
            <SectionName>작성자</SectionName>
            <SectionContent>
              <Author>{item.author.name}</Author>
              {item.voice === 'Y' && (
                <MicIcon
                  fontSize="small"
                  sx={{
                    border: '1px solid black',
                    borderRadius: '50%',
                    margin: '0 0 0 4px',
                  }}
                />
              )}
            </SectionContent>
          </AuthorSection>
          <ChildAuthorSection>
            <ChildSectionName>K/D</ChildSectionName>
            <SectionContent>
              <SectionContentText sx={{ color: calcKDInfo().color }}>
                {calcKDInfo().value}
              </SectionContentText>
            </SectionContent>
          </ChildAuthorSection>
          <ChildAuthorSection>
            <ChildSectionName>평균 데미지</ChildSectionName>
            <SectionContent>
              <SectionContentText sx={{ color: calcAvgDmgInfo().color }}>
                {calcAvgDmgInfo().value}
              </SectionContentText>
            </SectionContent>
          </ChildAuthorSection>
          <AuthorSection>
            <SectionName>티어</SectionName>
            <SectionContent>
              <img
                src={authorTier?.imageUrl}
                alt={authorTier?.value}
                width="36px"
                height="36px"
              />

              <TierWinRateWrapper>
                <SectionTypo sx={{ color: authorTier?.color }}>
                  {authorTier?.label}
                </SectionTypo>
                <MatchPlayed>
                  {item.author?.wins}승 {item.author?.losses}패
                  <WinRate
                    component="span"
                    sx={{ color: winRate >= 50 ? '#d31f45' : '#5383e8' }}
                  >
                    ({winRate}%)
                  </WinRate>
                </MatchPlayed>
              </TierWinRateWrapper>
            </SectionContent>
          </AuthorSection>
          <AuthorSection>
            <SectionName>모스트 요원</SectionName>
            <SectionContent>
              <ImageList sx={{ m: 0, p: 0 }} cols={3} gap={1}>
                {item.author.mostAgent.map((aAgent, index) => {
                  return (
                    <ImageListItem
                      key={`most_${index + 1}_${aAgent}`}
                      sx={{
                        width: '44px',
                        height: '44px',
                        gap: 1,
                      }}
                    >
                      <img
                        src={`https://cdn.match-gg.kr/valorant/agents/${aAgent}.png?w=44&h=44`}
                        alt={aAgent}
                        loading="lazy"
                      />
                    </ImageListItem>
                  );
                })}
              </ImageList>
            </SectionContent>
          </AuthorSection>
        </AuthorInfoWrapper>
      </CardContainer>
    </div>
  );
};

export default Card;

const CardTitleWrapper = styled(MuiBox)(() => ({
  width: '100%',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
})) as typeof MuiBox;

const ImgWrapper = styled(MuiBox)(() => ({
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const CardTitle = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  margin: '0 0 0 4px',
})) as typeof MuiBox;

const TopInfo = styled(MuiBox)(() => ({
  display: 'flex',
})) as typeof MuiBox;

const TopInfoTypo = styled(MuiTypography)(() => ({
  fontSize: '12px',
  fontWeight: '700',
  margin: '0 4px 0 0',
})) as typeof MuiTypography;

const Description = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '500',
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 1,
})) as typeof MuiTypography;

const CardCenterWrapper = styled(MuiBox)(() => ({
  width: '100%',
  height: '20px',
  display: 'flex',
})) as typeof MuiBox;

const GuideWrapper = styled(MuiBox)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const GuideTypo = styled(MuiTypography)(() => ({
  fontSize: '14px',
  color: '#5383e8',
  fontWeight: '700',
})) as typeof MuiTypography;

const RecruitStatusWrapper = styled(MuiBox)(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '0 0 0 44px',
  justifyContent: 'space-between',
})) as typeof MuiBox;

const MemberInfo = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
})) as typeof MuiBox;

const RecruitStatusTypo = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '700',
  color: '#878888',
  margin: '0 10px 0 0',
})) as typeof MuiTypography;

const Check = styled(CheckIcon)(() => ({
  fontSize: '12px',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 6px 0 0',
}));

const TimerWrapper = styled(MuiBox)(() => ({})) as typeof MuiBox;

const AuthorInfoWrapper = styled(MuiBox)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
})) as typeof MuiBox;

const AuthorSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})) as typeof MuiBox;

const ChildAuthorSection = styled(MuiBox)(() => ({
  maxWidth: '80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})) as typeof MuiBox;

const SectionName = styled(MuiTypography)(() => ({
  minWidth: '160px',
  fontSize: '12px',
  fontWeight: '700',
  color: '#999999',
  margin: '0 0 4px 0',
})) as typeof MuiTypography;

const ChildSectionName = styled(MuiTypography)(() => ({
  minWidth: '80px',
  fontSize: '12px',
  fontWeight: '700',
  color: '#999999',
  margin: '0 0 4px 0',
})) as typeof MuiTypography;

const AuthorSectionName = styled(MuiTypography)(() => ({
  minWidth: '120px',
  fontSize: '12px',
  fontWeight: '700',
  color: '#999999',
  margin: '0 0 4px 0',
})) as typeof MuiTypography;

const SectionContent = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '4px',
})) as typeof MuiBox;

const ChildSectionContent = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '2px',
})) as typeof MuiBox;

const Author = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '600',
  color: '#000000',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})) as typeof MuiTypography;

const SectionTypo = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: '500',
  color: '#000000',
})) as typeof MuiTypography;

const RankEmblemWrapper = styled(MuiBox)(() => ({
  backgroundColor: '#eeeeee',
  borderRadius: '50%',
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const TierWinRateWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '0 0 0 4px',
})) as typeof MuiBox;

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

const SectionContentText = styled(MuiTypography)(() => ({
  minHeight: '32px',
  fontSize: '16px',
  fontWeight: '600',
  color: '#000000',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})) as typeof MuiTypography;
