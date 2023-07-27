import React from 'react';
import { useSelector } from 'react-redux';

// mui
import { styled } from '@mui/system';
import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';
import MuiTextField from '@mui/material/TextField';
import MuiButton from '@mui/material/Button';
import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MuiToggleButton from '@mui/material/ToggleButton';

import { RootState } from 'store';

const Games = () => {
  const {
    lol: initialLol,
    pubg: initialPubg,
    overwatch,
  } = useSelector((state: RootState) => state.mypage);

  // 롤
  const [lol, setLol] = React.useState<string>(initialLol);
  const [isLolChanged, setIsLolChanged] = React.useState<boolean>(false);
  const [isLolCertified, setIsLolCertified] = React.useState<boolean>(false);

  const lolHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLol(e.target.value);
    setIsLolChanged(true);
  };

  // 배그
  const initialPlatform = initialPubg.split('_')[0];
  const initialNickname = initialPubg.split('_')[1];
  const [pubgPlatform, setPubgPlatform] =
    React.useState<string>(initialPlatform);
  const [pubg, setPubg] = React.useState<string>(initialNickname);
  const [isPubgChanged, setIsPubgChanged] = React.useState<boolean>(false);
  const [isPubgCertified, setIsPubgCertified] = React.useState<boolean>(false);

  const pubgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPubg(e.target.value);
    setIsPubgChanged(true);
  };

  // 오버워치
  const [ow, setOw] = React.useState<string>(overwatch);
  const [isOwChanged, setIsOwChanged] = React.useState<boolean>(false);
  const [isOwCertified, setIsOwCertified] = React.useState<boolean>(false);

  const owHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOw(e.target.value);
    setIsOwChanged(true);
  };

  return (
    <Container>
      <MenuTitle>연결한 게임</MenuTitle>
      <Section>
        <SectionTitle>리그오브레전드</SectionTitle>
        <InputWrapper>
          <LolTextField
            id="lol"
            value={lol}
            size="small"
            onChange={lolHandler}
          />
          <CertifyButton
            disabled={!isLolChanged}
            onClick={() => {
              setIsLolCertified(true);
            }}
          >
            인증하기
          </CertifyButton>
          <UpdateButton disabled={!isLolCertified || !isLolChanged}>
            변경하기
          </UpdateButton>
        </InputWrapper>
      </Section>
      <Section>
        <SectionTitle>배틀그라운드</SectionTitle>
        <InputWrapper>
          <PubgPlatformToggle exclusive value={pubgPlatform}>
            <Platform
              value="STEAM"
              onClick={() => {
                setPubgPlatform('STEAM');
                setIsPubgChanged(true);
              }}
            >
              Steam
            </Platform>
            <Platform
              value="KAKAO"
              onClick={() => {
                setPubgPlatform('KAKAO');
                setIsPubgChanged(true);
              }}
            >
              Kakao
            </Platform>
          </PubgPlatformToggle>
          <LolTextField
            id="pubg"
            value={initialPubg}
            size="small"
            onChange={pubgHandler}
          />
          <CertifyButton
            disabled={!isPubgChanged}
            onClick={() => {
              setIsPubgCertified(true);
            }}
          >
            인증하기
          </CertifyButton>
          <UpdateButton disabled={!isPubgCertified || !isPubgChanged}>
            변경하기
          </UpdateButton>
        </InputWrapper>
      </Section>
      <Section>
        <SectionTitle>오버워치</SectionTitle>
        <InputWrapper>
          <LolTextField
            id="overwatch"
            value={ow}
            size="small"
            onChange={owHandler}
          />
          <CertifyButton
            disabled={!isOwChanged}
            onClick={() => {
              setIsOwCertified(true);
            }}
          >
            인증하기
          </CertifyButton>
          <UpdateButton disabled={!isOwCertified || !isOwChanged}>
            변경하기
          </UpdateButton>
        </InputWrapper>
      </Section>
    </Container>
  );
};
export default Games;

const Container = styled(MuiBox)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: '16px',
}));

const MenuTitle = styled(MuiTypography)(() => ({
  width: '100%',
  borderBottom: '1px solid #969393',
  fontSize: '22px',
  fontWeight: '700',
  padding: '0 0 0 8px',
})) as typeof MuiTypography;

const Section = styled(MuiBox)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '8px 0 0 16px',
  gap: '8px',
}));

const SectionTitle = styled(MuiTypography)(() => ({
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '8px',
}));

const SectionContentTypo = styled(MuiTypography)(() => ({
  fontSize: '16px',
  fontWeight: '500',
  padding: '0 0 0 16px',
}));

const LolTextField = styled(MuiTextField)(() => ({
  maxWidth: '280px',
  minWidth: '200px',
  '& .MuiInputBase-root': {
    height: '40px',
    padding: '0',
  },
})) as typeof MuiTextField;

const CertifyButton = styled(MuiButton)(() => ({
  height: '40px',
  width: '80px',
  fontSize: '14px',
  fontWeight: 'bold',
  borderRadius: '0',
  padding: '0',
})) as typeof MuiButton;

const InputWrapper = styled(MuiBox)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px 0 0',
  gap: '4px',
})) as typeof MuiBox;

const UpdateButton = styled(MuiButton)(() => ({
  height: '40px',
  width: '80px',
  fontSize: '14px',
  fontWeight: 'bold',
  borderRadius: '0',
  padding: '0',
})) as typeof MuiButton;

const PubgPlatformToggle = styled(MuiToggleButtonGroup)(() => ({
  '& .MuiToggleButton-root': {
    height: '40px',
    fontSize: '14px',
    fontWeight: 'bold',
    borderRadius: '4px',
    padding: '0 8px',
  },
})) as typeof MuiToggleButtonGroup;

const Platform = styled(MuiToggleButton)(() => ({})) as typeof MuiToggleButton;
