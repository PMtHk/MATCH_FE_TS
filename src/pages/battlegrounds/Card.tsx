import React from 'react';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiDivider from '@mui/material/Divider';

// mui icons
import CheckIcon from '@mui/icons-material/Check';
import MicIcon from '@mui/icons-material/Mic';

import CardContainer from 'components/CardContainer';
import Timer from 'components/CountDownTimer';
import { EXPIRE_TIME } from 'types/commons';
import { Stack } from '@mui/material';

import { platformList, typeList, tierList, rankImage } from './data';

interface CardProps {
  item: {
    id: number;
    oauth2Id: string;
    name: string;
    type: string;
    tier: string;
    platform: string;
    voice: 'Y' | 'N';
    content: string;
    expire: EXPIRE_TIME;
    expired: string;
    created: string;
    finished: string;
    author: {
      id: number;
      name: string;
      platform: string;
      type: string;
      currentRankPoint: number;
      tier: string;
      subTier: string;
      kills: number;
      deaths: number;
      avgDmg: number;
      totalPlayed: number;
      wins: number;
      top10: number;
    };
    chatRoomId: string;
    memberList: [];
    banList: [];
  };
  expired: boolean;
}

const Card = ({ item, expired }: CardProps) => {
  const [isHover, setIsHover] = React.useState<boolean>(false);

  const platform = platformList.find(
    (aPlatform) => aPlatform.value === item.platform,
  );

  const tier = tierList.find((aTier) => aTier.value === item.tier);

  const type = typeList.find((aType) => aType.value === item.type);

  // 작성자 정보
  const authorTier = tierList.find(
    (aTier) => aTier.value === item.author.tier.toUpperCase(),
  );

  const maxMember = type?.maxMember || 4;
  const currentMember = item.memberList.length;

  const arrayForMemberStatus = new Array(maxMember)
    .fill(0)
    .map((value, i) => `member_${i}`);

  type TierInfo = {
    imageUrl: string;
    value: string;
  };
  // 작성자의 정보를 표시할 때 사용할 랭크 정보 계산
  const getRank = (): TierInfo => {
    const str: string =
      item.author.tier === 'Master'
        ? 'MASTER'
        : item.author.tier.toUpperCase() + item.author.subTier;
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

  const calcTop1Info = (): string => {
    const { totalPlayed, wins } = item.author;
    if (totalPlayed === 0 || wins === 0) {
      return '0';
    }
    return ((wins / totalPlayed) * 100).toFixed(1);
  };

  const calcTop10Info = (): string => {
    const { totalPlayed, top10 } = item.author;
    if (totalPlayed === 0 || top10 === 0) {
      return '0';
    }
    return ((top10 / totalPlayed) * 100).toFixed(1);
  };

  return (
    <div
      onMouseOver={() => setIsHover(true)}
      onFocus={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <CardContainer expired={expired}>
        <CardTitleWrapper>
          <img
            src={platform?.imageUrl || ''}
            alt="platform_image"
            loading="lazy"
            height="40px"
            width="40px"
            style={{ borderRadius: '100%' }}
          />
          <CardTitle>
            <TopInfo>
              <TopInfoTypo>#{platform?.label || '모든큐'}</TopInfoTypo>
              <TopInfoTypo>#{type?.label || '모든큐'}</TopInfoTypo>
              <TopInfoTypo color={tier?.darkColor || '#000'}>
                #{tier?.label || '모든티어'}
              </TopInfoTypo>
            </TopInfo>
            <Description>{`${item.content}`}</Description>
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
          {/* 작성자 이름 */}
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
          {/* RP(Raing Point) */}
          <AuthorSection>
            <SectionName>RP (Rating Point)</SectionName>
            <SectionContent>
              {item.type !== 'RANKED_SQUAD' ||
              item.author.currentRankPoint === 0 ? (
                <SectionContentText sx={{ color: 'gray' }}>
                  정보없음
                </SectionContentText>
              ) : (
                <RPSection>
                  <RankEmblemWrapper>
                    <img
                      src={getRank().imageUrl}
                      alt={getRank().value}
                      width="28px"
                      height="28px"
                    />
                  </RankEmblemWrapper>
                  <SectionContentText
                    sx={{ color: authorTier?.darkColor, paddingTop: '8px' }}
                  >
                    {getRank().value}
                  </SectionContentText>
                </RPSection>
              )}
            </SectionContent>
          </AuthorSection>
          {/* 하위 4개 */}
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ marginTop: 1 }}
          >
            {/* K/D */}
            <ChildAuthorSection>
              <ChildSectionName>K/D</ChildSectionName>
              <SectionContent>
                <SectionContentText sx={{ color: calcKDInfo().color }}>
                  {calcKDInfo().value}
                </SectionContentText>
              </SectionContent>
            </ChildAuthorSection>
            {/* 평균 데미지 */}
            <ChildAuthorSection>
              <ChildSectionName>평균 데미지</ChildSectionName>
              <SectionContent>
                <Author sx={{ color: calcAvgDmgInfo().color }}>
                  {calcAvgDmgInfo().value}
                </Author>
              </SectionContent>
            </ChildAuthorSection>
            {/* Top 1 */}
            <ChildAuthorSection>
              <ChildSectionName>Top 1</ChildSectionName>
              <SectionContent>
                <Author>{`${calcTop1Info()}%`}</Author>
              </SectionContent>
            </ChildAuthorSection>
            {/* Top 10 */}
            <ChildAuthorSection>
              <ChildSectionName>Top 10</ChildSectionName>
              <SectionContent>
                <Author>{`${calcTop10Info()}%`}</Author>
              </SectionContent>
            </ChildAuthorSection>
          </Stack>
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

const RPSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'row',
  // justifyContent: 'flex-end',
  // alignItems: 'flex-end',
  // border: '1px solid red',
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

const SectionContent = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '4px',
})) as typeof MuiBox;

const RankEmblemWrapper = styled(MuiBox)(() => ({
  backgroundColor: '#eeeeee',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const Author = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '600',
  color: '#000000',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})) as typeof MuiTypography;

const SectionContentText = styled(MuiTypography)(() => ({
  minHeight: '32px',
  fontSize: '16px',
  fontWeight: '600',
  color: '#000000',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})) as typeof MuiTypography;
