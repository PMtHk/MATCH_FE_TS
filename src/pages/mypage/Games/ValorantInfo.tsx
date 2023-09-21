import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import MuiTypography from '@mui/material/Typography';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import MuiCheckbox from '@mui/material/Checkbox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MuiImageList from '@mui/material/ImageList';

import { RootState } from 'store';

import { tierList } from 'pages/valorant/data';

export const RSOConnectButton = () => {
  const { games } = useSelector((state: RootState) => state.register);

  const vlrtNickname = games.valorant;

  const [checked, setChecked] = useState(false);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked((prev) => !prev);
  };

  return (
    <InnerContainer>
      <ButtonWrapper>
        <Button
          disabled={!checked || Boolean(vlrtNickname)}
          href={`https://auth.riotgames.com/authorize?client_id=${process.env.REACT_APP_RIOT_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_RIOT_REDIRECT_URI_MYPAGE}&response_type=code&scope=openid+offline_access`}
        >
          <img
            src="https://cdn.match-gg.kr/assets/riot_games_icon.png"
            alt="riot_games_symbol"
            width="24px"
            height="24px"
          />
          <span>라이엇 로그인</span>
        </Button>
      </ButtonWrapper>
      {!vlrtNickname && (
        <FormControlLabel
          control={<CustomCheckbox checked={checked} onChange={handleCheck} />}
          label="MatchGG 에 나의 발로란트 프로필이 공개되는 것을 동의합니다."
        />
      )}
      {vlrtNickname && (
        <LinkedNickname>연결완료 - {vlrtNickname}</LinkedNickname>
      )}
    </InnerContainer>
  );
};

const Info = ({ data, type }: any) => {
  const gameType = type === 'COMPETITIVE' ? '경쟁전' : '일반게임';

  const calcKD = () => {
    let kd;
    if (data.kills === 0) kd = 0;
    else if (data.deaths === 0) kd = 100;
    else kd = Number((data.kills / data.deaths).toFixed(2));

    let color;
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
    let winRate;
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

  const calcHeadShotInfo = () => {
    const heads: number =
      data.heads === 0 || data.shots === 0
        ? 0
        : Number((data.shots / data.heads).toFixed(1));
    let color;
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

  const tier = tierList[data.tier];

  return (
    <InfoContainer>
      <EachInfo>
        <TitleTypo>타입</TitleTypo>
        <SubTitleTypo>{gameType}</SubTitleTypo>
      </EachInfo>
      {data.wins === 0 && data.losses === 0 && (
        <>
          <InfoOutlinedIcon
            sx={{ color: 'gray', fontSize: '18px', marginRight: '8px' }}
          />
          <TitleTypo>{`아직 ${gameType} 경기에 대한 정보가 없습니다.`}</TitleTypo>
        </>
      )}
      {(data.wins !== 0 || data.losses !== 0) && (
        <>
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
            <TitleTypo>평균 데미지</TitleTypo>
            <SubTitleTypo>{data.avgDmg}</SubTitleTypo>
          </EachInfo>
          <EachInfo>
            <TitleTypo>헤드샷</TitleTypo>
            <SubTitleTypo sx={{ color: calcHeadShotInfo().color }}>{`${
              calcHeadShotInfo().value
            } %`}</SubTitleTypo>
          </EachInfo>
          {gameType === '경쟁전' && (
            <EachInfo>
              <TitleTypo sx={{ textAlign: 'center', width: '100%' }}>
                티어
              </TitleTypo>
              <TierContainer>
                <img
                  src={tier?.imageUrl}
                  alt="rank"
                  width="44px"
                  height="38px"
                  loading="lazy"
                />
                <MuiTypography
                  sx={{
                    color: tier?.color,
                    fontSize: '12px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tier.label}
                </MuiTypography>
              </TierContainer>
            </EachInfo>
          )}
          <EachInfo>
            <TitleTypo>모스트 요원</TitleTypo>
            <MuiImageList sx={{ m: 0, p: 0 }} cols={3} gap={1}>
              {data.mostAgent?.map((aAgent: string, index: number) => (
                <ChampImgWrapper key={`most_${index + 1}_aChampion`}>
                  <img
                    src={`https://cdn.match-gg.kr/valorant/agents/${aAgent}.png?w=48&h=48`}
                    alt={`most${index}_${aAgent}`}
                    loading="lazy"
                  />
                </ChampImgWrapper>
              ))}
            </MuiImageList>
          </EachInfo>
        </>
      )}
    </InfoContainer>
  );
};

const ValorantInfo = ({ data }: any) => {
  const { games } = useSelector((state: RootState) => state.register);

  const { rankInfo, normalInfo } = data;

  // 발로란트 연결이 되어있는 경우
  return (
    <Container>
      <Info data={rankInfo} type="COMPETITIVE" />
      <Info data={normalInfo} type="STANDARD" />
    </Container>
  );
};

export default ValorantInfo;

const Container = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: '360px',
})) as typeof MuiBox;

const FormControlLabel = styled(MuiFormControlLabel)(() => ({
  padding: '0 0 0 10px',
  '& > span': {
    fontSize: '12px',
    fontWeight: 700,
    color: '#D64E5Bb5',
  },
})) as typeof MuiFormControlLabel;

const CustomCheckbox = styled(MuiCheckbox)(() => ({
  color: '#D64E5Bb5',
  '&.Mui-checked': {
    color: '#D64E5Bb5',
  },
})) as typeof MuiCheckbox;

const InnerContainer = styled(MuiBox)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const LinkedNickname = styled(MuiTypography)(() => ({
  fontSize: '14px',
  fontWeight: 700,
  color: '#D64E5Bb5',
  margin: '0 0 0 20px',
})) as typeof MuiTypography;

const ButtonWrapper = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  margin: '0 0 0  10px',
})) as typeof MuiBox;

const Button = styled(MuiButton)(() => ({
  width: '100%',
  maxWidth: '400px',
  height: '56px',
  backgroundColor: '#E84057',
  color: '#f4f4f4',
  fontSize: '16px',
  fontWeight: 700,
  gap: '8px',
  '& > img': {
    filter: 'brightness(0) invert(1)',
  },
  '&:hover': {
    color: '#E84057',
    border: '1px solid #E84057',
    '& > img': {
      filter:
        'invert(45%) sepia(43%) saturate(7074%) hue-rotate(330deg) brightness(95%) contrast(91%)',
    },
  },
  '&.Mui-disabled': {
    backgroundColor: '#D2D4DA',
  },
})) as typeof MuiButton;

const TitleTypo = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '700',
  color: 'gray',
  whiteSpace: 'nowrap',
})) as typeof MuiTypography;

const SubTitleTypo = styled(TitleTypo)(() => ({
  color: 'black',
  whiteSpace: 'nowrap',
  marginTop: '12px',
}));

const FlexCol = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
})) as typeof MuiBox;

const EachInfo = styled(FlexCol)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  marginRight: '24px',
  minHeight: '92px',
  maxHeight: '92px',
}));

const SectionContent = styled(MuiBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '4px',
})) as typeof MuiBox;

const PositionRankSection = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
})) as typeof MuiBox;

const RankWrapper = styled(MuiBox)(() => ({
  width: '40px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
})) as typeof MuiBox;

const PositionEmblemWrapper = styled(MuiBox)(() => ({
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})) as typeof MuiBox;

const TierTypo = styled(MuiBox)(() => ({
  width: '100%',
  fontSize: '12px',
  fontWeight: '600',
  textAlign: 'center',
})) as typeof MuiBox;

const InfoContainer = styled(MuiBox)(() => ({
  maxHeight: '120px',
  height: '120px',
  marginBottom: '12px',
  marginRight: '12px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})) as typeof MuiBox;

const ChampImgWrapper = styled(MuiBox)(() => ({
  borderRadius: '4px',
  '& > img': {
    borderRadius: '4px',
    objectFit: 'cover',
  },
})) as typeof MuiBox;

const TierContainer = styled(MuiBox)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));
